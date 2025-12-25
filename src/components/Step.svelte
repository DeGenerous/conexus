<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import { story, game } from '@stores/conexus.svelte';
  import { conexusBG } from '@stores/conexus.svelte';
  import { GetCache, SetCache, GAME_INSTRUCTIONS_KEY } from '@constants/cache';
  import detectIOS from '@utils/ios-device';
  import {
    defaultFont,
    defaultStyling,
    paperThemeFont,
    paperThemeStyling,
  } from '@constants/customization';
  import openModal, { showModal } from '@stores/modal.svelte';
  import {
    themeSettingsModal,
    customFont,
    customStyling,
    getStoredCustomization,
    persistActiveTheme,
  } from '@stores/customization.svelte';
  import { gameRulesModal } from '@constants/modal';
  import isColorLight from '@utils/brightness';
  import { isGuest } from '@stores/account.svelte';

  import Slider from '@components/music/Slider.svelte';
  import ImageDisplay from '@components/utils/ImageDisplay.svelte';
  import Share from './utils/Share.svelte';

  import StylingController from './utils/StylingController.svelte';
  import SelectorSVG from '@components/icons/Selector.svelte';
  import QuitSVG from '@components/icons/Quit.svelte';
  import StepSVG from '@components/icons/Step.svelte';
  import SwitchSVG from '@components/icons/Switch.svelte';
  import SoundSVG from '@components/icons/Sound.svelte';
  import FullscreenSVG from '@components/icons/Fullscreen.svelte';
  import FilledEyeSVG from '@components/icons/FilledEye.svelte';
  import ResetSVG from '@components/icons/Reset.svelte';
  import LoadingSVG from '@components/icons/Loading.svelte';

  let {
    topic_name,
    restartGame,
    quitGame = () => window.location.reload(),
  }: {
    topic_name: string;
    restartGame: () => void;
    quitGame?: () => void;
  } = $props();

  let width = $state<number>(0);
  let height = $state<number>(0);

  let showCustomization = $state<boolean>(false);

  const step = $derived<StepData>($story?.step_data as StepData);

  const exitGame = () => {
    $story = null;
    game.background_image = null;
    game.background_music = null;
  };

  // Construct a derived style string for the root element
  const themeStyles = $derived.by(() => {
    if (!$customFont || !$customStyling) return '';

    const { baseColor, accentColor, family } = $customFont;
    const { bgColor, bgPictureOpacity } = $customStyling;

    return [
      `--theme-text: ${baseColor}`,
      `--theme-accent: ${accentColor}`,
      `--theme-bg: ${bgColor}`,
      `--theme-font: ${family}`,
      `--theme-panel-bg: color-mix(in srgb, var(--theme-accent), transparent 85%)`,
      `--theme-panel-border: color-mix(in srgb, var(--theme-accent), transparent 60%)`,
      `--theme-hover-bg: color-mix(in srgb, var(--theme-accent), transparent 70%)`,
      `--theme-panel-muted: color-mix(in srgb, var(--theme-bg), transparent 60%)`,
      `--theme-hover-muted: color-mix(in srgb, var(--theme-bg), transparent 50%)`,
      `--theme-panel-deep: color-mix(in srgb, var(--theme-bg), var(--theme-accent) 15%)`,
      `--theme-panel-dark: color-mix(in srgb, var(--theme-bg), black 15%)`,
    ].join(';');
  });

  // CONTROL BAR

  let hiddenControls = $state<boolean>(false);
  let activeControlPanel = $state<Nullable<StepController>>(null);

  $effect(() => {
    if (hiddenControls) activeControlPanel = null;
  });

  const DESKTOP_BREAKPOINT = 1024;
  const isDesktop = $derived<boolean>(width >= DESKTOP_BREAKPOINT);

  const switchController = (controller: StepController) => {
    if (activeControlPanel === controller) {
      activeControlPanel = null;
      return;
    }
    activeControlPanel = controller;
  };

  let hiddenControlsTimeout: ReturnType<typeof setTimeout> = setTimeout(
    () => {},
  );

  const hideControlsAfterDelay = () => {
    if (!isDesktop) return;
    clearTimeout(hiddenControlsTimeout);
    hiddenControlsTimeout = setTimeout(() => {
      hiddenControls = true;
    }, 3000);
  };

  const showControls = () => {
    clearTimeout(hiddenControlsTimeout);
    hiddenControls = false;
    hideControlsAfterDelay();
  };

  const cancelHide = () => {
    clearTimeout(hiddenControlsTimeout);
  };

  const handleWrapperPointer = (event: PointerEvent) => {
    const target = event.target as HTMLElement;
    if (
      target.closest(
        'nav, section.step-controller, section.sound-controller, section.styling-controller',
      )
    ) {
      return;
    }

    if (target.tagName === 'BUTTON') return;

    if (activeControlPanel) {
      activeControlPanel = null;
      return;
    }

    if (isDesktop) return;

    hiddenControls = !hiddenControls;
  };

  const selectorSize = $derived.by<number>(() => {
    if (!$customFont) return 1.5;
    switch ($customFont.accentSize) {
      case 'h4':
        return 1.75;
      case 'h5':
        return 1.5;
      case 'body':
        return 1.25;
      case 'small':
        return 1;
      default:
        return 0.75;
    }
  });

  $effect(() => {
    conexusBG.opacity = $customStyling ? $customStyling.bgPictureOpacity : 50;
  });

  $effect(() => {
    conexusBG.color = $customStyling ? $customStyling.bgColor : '#000000';
  });

  const openThemeSettings = () => {
    $showModal = true;
    $themeSettingsModal = true;
  };

  const applyQuickTheme = async (
    font: CustomFont,
    styling: CustomStyling,
    name: string,
  ) => {
    $customFont = structuredClone(font);
    $customStyling = structuredClone(styling);
    await persistActiveTheme(name);
  };

  let activeOptionNumber = $state<number>(0);
  let focusedOption = $state<Nullable<number>>(null);

  const blurActiveBtn = () => {
    if (document.activeElement?.tagName === 'BUTTON') {
      (document.activeElement as HTMLButtonElement).blur();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat) return;
    switch (event.key) {
      case 'f': {
        game.fullscreen = !game.fullscreen;
        break;
      }
      case 'ArrowLeft': {
        if (step.step !== 1) {
          $story?.loadStep(step.step - 1);
          blurActiveBtn();
          activeOptionNumber = 0;
        } else return;
        break;
      }
      case 'ArrowRight': {
        if (step.step !== $story?.maxStep) {
          $story?.loadStep(step.step + 1);
          blurActiveBtn();
          activeOptionNumber = 0;
        } else return;
        break;
      }
      case 'ArrowUp': {
        if (step.step !== $story?.maxStep || game.loading) return;
        event.preventDefault();
        if ($story?.step_data?.ended) activeOptionNumber = 0;
        else if (activeOptionNumber !== 0) activeOptionNumber--;
        document.getElementById(`option-${activeOptionNumber}`)?.focus();
        break;
      }
      case 'ArrowDown': {
        if (step.step !== $story?.maxStep || game.loading) return;
        event.preventDefault();
        if ($story?.step_data?.ended) activeOptionNumber = 0;
        else if (activeOptionNumber !== step.options.length - 1)
          activeOptionNumber++;
        document.getElementById(`option-${activeOptionNumber}`)?.focus();
        break;
      }
    }
  };

  onMount(() => {
    getStoredCustomization();

    if (isDesktop) {
      const dontShowInstructions = GetCache(GAME_INSTRUCTIONS_KEY);
      if (!dontShowInstructions) {
        setTimeout(
          () =>
            openModal(gameRulesModal, "Don't show again", () => {
              SetCache(GAME_INSTRUCTIONS_KEY, 'dont_show');
              hideControlsAfterDelay();
            }),
          600,
        );
      } else {
        hideControlsAfterDelay();
      }
    }

    const handleBeforeUnload = () => exitGame();
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  });

  onDestroy(exitGame);

  const stopPropagation = (event: Event) => {
    event.stopPropagation();
  };
</script>

<svelte:window
  onkeydown={handleKeyDown}
  bind:innerWidth={width}
  bind:innerHeight={height}
/>

<!-- svelte-ignore
a11y_click_events_have_key_events
a11y_no_static_element_interactions
a11y_no_noninteractive_element_interactions -->
{#if $customFont && $customStyling}
  <section
    class="step-wrapper flex {$customFont.baseSize}-font"
    style={themeStyles}
    onpointerdown={handleWrapperPointer}
  >
    <div class="step-content transparent-container">
      <h4 class="flex-row gap-8 {$customFont.accentSize}-font">
        {#if game.loading}
          <LoadingSVG
            primary={$customFont.accentColor}
            secondary={$customFont.baseColor}
          />
          Loading story data...
        {:else}
          Step {step.step}{#if step.title}: "{step.title}"{/if}
        {/if}
      </h4>

      <span class="description flex">
        {#if !$isGuest && step.task_id !== ''}
          <ImageDisplay
            image={step.image}
            image_type={step.image_type}
            style={themeStyles}
          />
        {/if}

        <article
          class="vert-scrollbar"
          class:text-only={$isGuest || step.task_id === ''}
        >
          {step.story}
        </article>
      </span>

      {#if $story?.step_data?.ended}
        <hr />

        <h4 class="{$customFont.accentSize}-font">
          {topic_name.trim()} Story Summary
        </h4>

        <article>
          {step.summary}
        </article>

        <h4 class="{$customFont.accentSize}-font">
          CoNexus identified your trait as:
          <strong>{step.trait}</strong>
        </h4>

        {#if step.trait_description}
          <article>
            {step.trait_description}
          </article>
        {/if}

        <Share container={true} style={themeStyles} />
      {/if}
    </div>

    {#if $story?.step_data?.ended}
      <div
        class="step-options transparent-container {$customFont.accentSize}-font"
      >
        <button
          id="option-1"
          class="void-btn"
          onclick={() => (window.location.href = '/')}
        >
          Return to main menu
        </button>
        <button id="option-0" class="void-btn" onclick={restartGame}>
          Start a new story
        </button>
      </div>
    {:else}
      <div
        class="step-options transparent-container {$customFont.accentSize}-font"
      >
        {#each step.options as option, i}
          <button
            id="option-{i}"
            class="void-btn flex-row gap-8"
            class:active-option={step.choice && step.choice - 1 === i}
            disabled={game.loading || step.step !== $story?.maxStep}
            onclick={() => {
              $story?.nextStep(i + 1);
              if (activeOptionNumber !== 0) activeOptionNumber = 0;
            }}
            onpointerover={() => {
              if (!game.loading && step.step == $story?.maxStep) {
                focusedOption = i;
              }
              blurActiveBtn();
            }}
            onpointerout={() => {
              if (!game.loading && step.step == $story?.maxStep) {
                focusedOption = null;
              }
            }}
            onfocus={() => (focusedOption = i)}
            onblur={() => (focusedOption = null)}
          >
            {option}
            <SelectorSVG
              focused={(step.choice && step.choice - 1 === i) ||
                focusedOption === i}
              disabled={game.loading || step.step !== $story?.maxStep}
              hideForMobiles={true}
              color={$customFont.accentColor}
              {selectorSize}
            />
          </button>
        {/each}
      </div>
    {/if}

    <!-- CONTROL PANEL -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <nav
      class="flex-row blur transition shad-behind pad-8"
      class:hidden={hiddenControls}
      onpointerenter={cancelHide}
      onpointerleave={hideControlsAfterDelay}
      onclick={stopPropagation}
      tabindex="-1"
    >
      <span class="flex-row">
        <QuitSVG onclick={quitGame} voidBtn={true} />
        <h5 class="title">{topic_name.trim()}</h5>
      </span>
      <div class="controls flex-row">
        <div class:pad-inline={detectIOS()}>
          <label class:pc-only={!detectIOS()} for="filled-eye"> Styling </label>
          <FilledEyeSVG onclick={() => switchController('styling')} />
        </div>
        {#if !detectIOS()}
          <div>
            <label class="pc-only" for="sound">Sound</label>
            <SoundSVG onclick={() => switchController('sound')} />
          </div>
        {/if}
        <div class:pad-inline={detectIOS()}>
          <label class:pc-only={!detectIOS()} for="step-control">Step</label>
          <StepSVG
            text={`${step.step < 10 ? '0' : ''}${step.step}`}
            onclick={() => switchController('step')}
            control={true}
            accentColor={$customStyling.bgColor}
          />
        </div>
      </div>
      {#if !detectIOS()}
        <FullscreenSVG />
      {/if}
    </nav>

    <div
      id="controls-placeholder"
      onpointerenter={showControls}
      onpointerleave={hideControlsAfterDelay}
    ></div>

    <!-- STEP CONTROLLER -->
    <section
      class="step-controller"
      class:visible={activeControlPanel == 'step'}
      onpointerenter={cancelHide}
      onpointerleave={hideControlsAfterDelay}
      onclick={stopPropagation}
      role="toolbar"
      tabindex="-1"
    >
      <div class="transparent-container flex-row">
        <SwitchSVG
          onclick={() => $story?.loadStep(step.step - 1)}
          disabled={step.step === 1}
        />
        <span class="flex gap-8">
          <h5>{topic_name.trim()}</h5>
          <hr />
          <h5>
            {#if step.title}
              {step.title}
            {:else}
              Step {step.step}
            {/if}
          </h5>
        </span>
        <SwitchSVG
          onclick={() => $story?.loadStep(step.step + 1)}
          disabled={step.step === $story?.maxStep}
          right={true}
        />
      </div>
      <ul class="transparent-container vert-scrollbar pad-inline">
        {#each Array($story!.maxStep) as _, index}
          <StepSVG
            text={String(index + 1)}
            onclick={() => $story?.loadStep(index + 1)}
            active={step.step == index + 1}
            accentColor={$customStyling.bgColor}
          />
        {/each}
      </ul>
    </section>

    <!-- SOUND CONTROLLER -->
    <section
      class="sound-controller"
      class:visible={activeControlPanel == 'sound'}
      onpointerenter={cancelHide}
      onpointerleave={hideControlsAfterDelay}
      onclick={stopPropagation}
      role="toolbar"
      tabindex="-1"
    >
      <Slider type="music" style={themeStyles} />
      {#if !$isGuest && step.task_id !== ''}
        <Slider type="voice" style={themeStyles} />
      {/if}
    </section>

    <!-- STYLING CONTROLLER -->
    <section
      class="styling-controller"
      class:visible={activeControlPanel == 'styling'}
      onpointerenter={cancelHide}
      onpointerleave={hideControlsAfterDelay}
      onclick={stopPropagation}
      role="toolbar"
      tabindex="-1"
    >
      <span class="custom-themes flex">
        {#if isColorLight($customStyling.bgColor)}
          <ResetSVG
            onclick={() =>
              applyQuickTheme(defaultFont, defaultStyling, 'VOID (default)')}
            text="Apply VOID Theme"
          />
        {:else}
          <ResetSVG
            onclick={() =>
              applyQuickTheme(paperThemeFont, paperThemeStyling, 'PAPER')}
            text="Apply PAPER Theme"
          />
        {/if}

        <button class="purple-btn" onclick={openThemeSettings}>
          Manage Themes 🧩
        </button>

        <button
          class:active-btn={showCustomization}
          onclick={() => (showCustomization = !showCustomization)}
        >
          Customize look 🎨
        </button>
      </span>

      {#if showCustomization}
        <StylingController style={themeStyles} />
      {/if}
    </section>
  </section>
{:else}
  <div class="opaque-container">
    <h4 class="red-txt">Some error is occured...</h4>
    <p class="soft-white-txt">Please try again or contact support.</p>
  </div>
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  // GENERAL STEP STYLING
  .step-wrapper {
    color: var(--theme-text);
    font-family: var(--theme-font, inherit);

    @include respond-up(small-desktop) {
      margin-block: -4rem 4rem;
    }

    * {
      font-family: inherit;
      font-weight: inherit;
    }

    .transparent-container {
      background-color: var(--theme-panel-bg);
      animation: none;

      @include respond-up(small-desktop) {
        width: 960px;
      }

      @include respond-up(large-desktop) {
        width: 1360px;
      }

      @include respond-up(full-hd) {
        width: 1600px;
      }

      @include respond-up(quad-hd) {
        width: 1920px;
      }
    }

    h4,
    h5 {
      color: var(--theme-accent);
      font-style: inherit;
    }

    .step-content {
      padding: 1.5rem;

      article {
        width: 100%;
        text-align: left;
        white-space: pre-wrap;
        color: inherit;
        text-shadow: inherit;

        &::-webkit-scrollbar-thumb {
          background: var(--theme-panel-border);
          border-radius: 4px;
        }

        &.text-only {
          background-color: var(--theme-panel-muted);
          padding: 1rem;
          border-radius: 0.5rem;
          @include gray-border;
        }
      }

      @include respond-up(small-desktop) {
        .description {
          flex-direction: row;

          article {
            max-height: 400px;
            overflow-y: scroll;
            padding-right: 0.5rem;
          }
        }
      }
    }

    .step-options {
      align-items: stretch;

      @include respond-up(tablet) {
        flex-direction: row;
      }

      button {
        width: 100%;
        justify-content: space-between;
        text-align: left;

        color: var(--theme-accent);
        fill: var(--theme-accent);
        stroke: var(--theme-accent);
        font-family: var(--theme-font);

        font-size: inherit;
        line-height: inherit;
        font-style: inherit;
        text-shadow: inherit;

        background-color: var(--theme-panel-muted);

        padding: 1rem;
        border-radius: 0.5rem;
        @include gray-border;

        &:hover:not(&:disabled),
        &:active:not(&:disabled),
        &:focus:not(&:disabled) {
          background-color: var(--theme-hover-muted);
          border-color: var(--theme-panel-border);
          filter: brightness(1.1);
        }

        &:disabled:not(&.active-option) {
          opacity: 0.5;
        }

        &.active-option {
          border-color: var(--theme-accent);
        }
      }
    }

    // CONTROL PANEL STYLING
    nav {
      position: fixed;
      bottom: 0;
      width: 100vw;
      height: 4rem;
      padding-inline: 1rem;
      z-index: 100;
      justify-content: space-between;
      background-color: var(--theme-panel-deep);
      color: var(--theme-text);

      @include respond-up(small-desktop) {
        padding: 1rem;
      }

      label {
        color: inherit;

        &::after {
          content: ':';
        }
      }

      span {
        flex: none;

        .title {
          display: none;

          @include respond-up(small-desktop) {
            display: block;
          }
        }
      }

      .controls {
        gap: 0.5rem;
        justify-content: flex-end;

        @include respond-up(tablet) {
          gap: 1rem;
        }

        div {
          display: flex;
          flex-flow: row nowrap;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem;
          border-radius: 0.5rem;
          background-color: var(--theme-panel-bg);
          @include box-shadow(soft, inset);

          @include respond-up(tablet) {
            padding-inline: 0.5rem;
          }

          @include respond-up(small-desktop) {
            padding-block: 0.5rem;
          }

          &.pad-inline {
            padding-inline: 0.5rem;
          }
        }
      }

      &.hidden {
        transform: translateY(100%);
      }
    }

    #controls-placeholder {
      position: fixed;
      bottom: 0;
      width: 100vw;
      height: 4rem;
      z-index: 10;
    }

    // ADDITIONAL CONTROLLERS STYLING
    section {
      @extend :global(.shad-behind);
      max-height: 50vh;
      overflow-y: auto;
      display: flex;
      flex-flow: row wrap;
      justify-content: center;
      align-items: center;
      position: fixed;
      bottom: 0;
      width: 100vw;
      z-index: 90;
      padding: 0.5rem;
      gap: 0.5rem;
      transform: translateY(100%);
      transition: all 0.6s ease;
      background-color: var(--theme-panel-dark);

      @include respond-up(tablet) {
        max-height: 70vh;
      }

      div {
        width: 100%;
        flex-wrap: wrap;
        margin-inline: unset;

        &.transparent-container {
          animation: none;
          background-color: var(--theme-panel-bg);
        }

        @include respond-up(tablet) {
          width: auto;
          flex-flow: row wrap;
        }
      }

      &.visible {
        bottom: 4rem;
        transform: none;
      }

      // STEPS
      &.step-controller {
        div {
          justify-content: space-between;
        }

        ul {
          width: 100%;
          flex-flow: row wrap;
          max-height: 15rem;
          overflow-y: auto;

          @include respond-up(small-desktop) {
            max-height: unset;
          }
        }

        @include respond-up(tablet) {
          span {
            flex-flow: row wrap;
            gap: 1rem;

            h5:first-of-type::after {
              content: ':';
            }
          }

          hr {
            display: none;
          }
        }
      }

      // STYLING
      &.styling-controller {
        .custom-themes {
          width: 100%;
          flex-flow: column nowrap;
          padding-block: 1rem;

          @include respond-up(tablet) {
            flex-flow: row wrap;
            padding-block: 0;
          }
        }
      }
    }
  }
</style>
