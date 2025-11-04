<script lang="ts">
  import { onMount } from 'svelte';
  import { tippy } from 'svelte-tippy';

  import { story, game } from '@stores/conexus.svelte';
  import { conexusBG } from '@stores/conexus.svelte';
  import {
    GetCache,
    SetCache,
    GAME_INSTRUCTIONS_KEY,
    SCALE_KEY,
  } from '@constants/cache';
  import detectIOS from '@utils/ios-device';
  import {
    defaultFont,
    defaultStyling,
    defaultScale,
    lightThemeFont,
    lightThemeStyling,
  } from '@constants/customization';
  import openModal, { showModal } from '@stores/modal.svelte';
  import {
    themeSettingsModal,
    customFont,
    customStyling,
    getStoredCustomization,
  } from '@stores/customization.svelte';
  import { ensureMessage, gameRulesModal } from '@constants/modal';
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
  import ZoomInSVG from '@components/icons/ZoomIn.svelte';
  import ResetSVG from '@components/icons/Reset.svelte';
  import LoadingSVG from '@components/icons/Loading.svelte';

  let {
    topic_name,
    restartGame,
  }: {
    topic_name: string;
    restartGame: () => void;
  } = $props();

  let width = $state<number>(0);
  let height = $state<number>(0);

  let zoom = $state<number>(1);
  let showCustomization = $state<boolean>(false);

  const step = $derived<StepData>($story?.step_data as StepData);

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
        'nav, section.step-controller, section.sound-controller,' +
          'section.styling-controller, section.scale-controller',
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

  const toggleZoom = () => {
    zoom = zoom === 1 ? 0.5 : 1;
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

  let customScale = $state<CustomScale | null>(null);

  const updateScale = (reset: Nullable<'reset'> = null) => {
    if (reset) customScale = defaultScale;
    if (customScale) SetCache(SCALE_KEY, customScale);
  };

  $effect(() => {
    if (customScale) updateScale();
  });

  const openThemeSettings = () => {
    $showModal = true;
    $themeSettingsModal = true;
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
      case 'z': {
        toggleZoom();
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

  let pictureKeyframe: KeyframeEffect | null = null;
  let pictureAnimation: Animation | null = null;

  $effect(() => {
    if (!step?.image || !pictureAnimation) return;
    pictureAnimation.play();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  onMount(() => {
    const stepImage = document.getElementById('step-image') as HTMLImageElement;
    pictureKeyframe = new KeyframeEffect(
      stepImage,
      [
        { transform: 'scale(1)' },
        { transform: 'scale(0.975)' },
        { transform: 'scale(1.025)' },
        { transform: 'scale(1)' },
      ],
      {
        duration: 600,
        easing: 'ease',
      },
    );
    pictureAnimation = new Animation(pictureKeyframe, document.timeline);

    getStoredCustomization();

    const storedScale = GetCache<CustomScale>(SCALE_KEY);
    if (storedScale) customScale = storedScale;
    else updateScale('reset');

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
  });

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
{#if $customFont && $customStyling && customScale}
  <section
    class="step-wrapper flex {$customFont.baseSize}-font"
    class:text-shad={$customFont.shadow}
    style:font-family={$customFont.family}
    style:font-weight={$customFont.bold ? 'bold' : 'normal'}
    style:font-style={$customFont.italic ? 'italic' : ''}
    style:color={$customFont.baseColor}
    style:cursor={game.loading ? 'wait' : 'default'}
    onpointerdown={handleWrapperPointer}
  >
    {#if !$isGuest && step.task_id !== ''}
      <ImageDisplay
        {width}
        {zoom}
        image={step.image}
        image_type={step.image_type}
        imageWidth={customScale.imageWidth}
        imageHeight={customScale.imageHeight}
        boxShadow={$customStyling.boxShadow}
      />
    {/if}

    {#if step.title}
      <h4
        class="{$customFont.accentSize}-font"
        class:text-shad={$customFont.shadow}
        style:font-style={$customFont.italic ? 'italic' : ''}
        style:color={$customFont.accentColor}
        style:zoom
      >
        {step.title}
      </h4>
    {/if}

    <article
      style:max-width={width >= DESKTOP_BREAKPOINT
        ? `${customScale.paragraphWidth}%`
        : ''}
      style:width="{100 * zoom}%"
      style:zoom
    >
      {step.story}
    </article>

    {#if $story?.step_data?.ended}
      <hr />

      <h4
        class="{$customFont.accentSize}-font"
        class:text-shad={$customFont.shadow}
        style:font-style={$customFont.italic ? 'italic' : ''}
        style:color={$customFont.accentColor}
        style:zoom
      >
        {topic_name.trim()} Story Summary
      </h4>

      <article
        style:max-width={width >= DESKTOP_BREAKPOINT
          ? `${customScale.paragraphWidth}%`
          : ''}
        style:zoom
      >
        {step.summary}
      </article>

      <h4
        class="{$customFont.accentSize}-font"
        class:text-shad={$customFont.shadow}
        style:font-style={$customFont.italic ? 'italic' : ''}
        style:color={$customFont.accentColor}
        style:zoom
      >
        CoNexus identified your trait as:
        <strong class="text-glowing">{step.trait}</strong>
      </h4>

      {#if step.trait_description}
        <article
          style:max-width={width >= DESKTOP_BREAKPOINT
            ? `${customScale.paragraphWidth}%`
            : ''}
          style:zoom
        >
          {step.trait_description}
        </article>
      {/if}

      <div
        class="options {$customFont.accentSize}-font"
        class:text-shad={$customFont.shadow}
        class:transparent-container={$customStyling.optionsContainer}
        style:font-style={$customFont.italic ? 'italic' : ''}
        style:color={$customFont.accentColor}
        style:box-shadow={$customStyling.boxShadow ? '' : 'none'}
        style:border={$customStyling.boxShadow ? 'none' : ''}
        style:max-width={width >= DESKTOP_BREAKPOINT
          ? `${customScale.optionsWidth}%`
          : ''}
        style:width="{width >= DESKTOP_BREAKPOINT ? 100 * zoom : 95}%"
        style:zoom
      >
        <button id="option-0" class="void-btn menu-option" onclick={restartGame}
          >Start a new story</button
        >
        <button
          id="option-1"
          class="void-btn menu-option"
          onclick={() => (window.location.href = '/')}
          >Return to main menu</button
        >
      </div>
      <Share container={true} />
    {:else}
      <div
        class="flex options wide-container {$customFont.accentSize}-font"
        class:text-shad={$customFont.shadow}
        class:transparent-container={$customStyling.optionsContainer}
        style:color={$customFont.accentColor}
        style:box-shadow={$customStyling.boxShadow ? '' : 'none'}
        style:border={$customStyling.boxShadow ? 'none' : ''}
        style:max-width={width >= DESKTOP_BREAKPOINT
          ? `${customScale.optionsWidth}%`
          : ''}
        style:width="{width >= DESKTOP_BREAKPOINT ? 100 * zoom : 95}%"
        style:zoom
      >
        {#each step.options as option, i}
          <button
            id="option-{i}"
            class="void-btn flex-row gap-8"
            class:active-option={step.choice && step.choice - 1 === i}
            style:font-family={$customFont.family}
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
            {#if $customStyling.optionSelector}
              <SelectorSVG
                focused={(step.choice && step.choice - 1 === i) ||
                  focusedOption === i}
                disabled={game.loading || step.step !== $story?.maxStep}
                hideForMobiles={true}
                color={$customFont.accentColor}
                {selectorSize}
              />
            {/if}
            {option}
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
        <QuitSVG onclick={() => window.location.reload()} voidBtn={true} />
        <h5 class="title">{topic_name.trim()}</h5>
      </span>
      <div class="controls flex-row">
        <div class="scale-icon">
          <label class="pc-only" for="zoom-in-control">Scale</label>
          <ZoomInSVG
            onclick={() => switchController('scale')}
            active={activeControlPanel == 'scale'}
            control={true}
          />
        </div>
        <div class:pad-inline={detectIOS()}>
          <label class:pc-only={!detectIOS()} for="filled-eye"> Styling </label>
          <FilledEyeSVG
            onclick={() => switchController('styling')}
            active={activeControlPanel == 'styling'}
          />
        </div>
        {#if !detectIOS()}
          <div>
            <label class="pc-only" for="sound">Sound</label>
            <SoundSVG
              onclick={() => switchController('sound')}
              active={activeControlPanel == 'sound'}
            />
          </div>
        {/if}
        <div class:pad-inline={detectIOS()}>
          <label class:pc-only={!detectIOS()} for="step-control">Step</label>
          <StepSVG
            text={`${step.step < 10 ? '0' : ''}${step.step}`}
            onclick={() => switchController('step')}
            active={activeControlPanel == 'step'}
            control={true}
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
          <h5 class="title">{topic_name.trim()}</h5>
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
      <Slider type="music" />
      {#if !$isGuest && step.task_id !== ''}
        <Slider type="voice" />
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
            onclick={() => {
              $customFont = defaultFont;
              $customStyling = defaultStyling;
            }}
            text="Apply DARK Theme"
          />
        {:else}
          <ResetSVG
            onclick={() => {
              $customFont = lightThemeFont;
              $customStyling = lightThemeStyling;
            }}
            text="Apply LIGHT Theme"
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
        <StylingController />
      {/if}
    </section>

    <!-- SCALE CONTROLLER -->
    <section
      class="scale-controller"
      class:visible={activeControlPanel == 'scale'}
      onpointerenter={cancelHide}
      onpointerleave={hideControlsAfterDelay}
      onclick={stopPropagation}
      role="toolbar"
      tabindex="-1"
    >
      {#if zoom !== 1}
        <p class="zoom-hint validation green-txt">
          Zoomed-out mode active - perfect for screenshots 🖼️
        </p>
      {/if}
      <div class="image-scale transparent-container">
        <span class="flex-row">
          <label for="image-width">Picture width</label>
          <span class="flex-row pad-8 round-8 gap-8 dark-glowing">
            <input
              id="image-width"
              type="range"
              min="800"
              max={width}
              step="16"
              bind:value={customScale.imageWidth}
            />
            <p>{customScale.imageWidth}px</p>
          </span>
        </span>

        <span class="flex-row">
          <label for="image-height">Picture height</label>
          <span class="flex-row pad-8 round-8 gap-8 dark-glowing">
            <input
              id="image-height"
              type="range"
              min="512"
              max={height}
              step="16"
              bind:value={customScale.imageHeight}
            />
            <p>{customScale.imageHeight}px</p>
          </span>
        </span>
      </div>

      <div class="text-scale transparent-container">
        <span class="flex-row">
          <label for="paragraph-width">Paragraph width</label>
          <span class="flex-row pad-8 round-8 gap-8 dark-glowing">
            <input
              id="paragraph-width"
              type="range"
              min="50"
              max="100"
              step="1"
              bind:value={customScale.paragraphWidth}
            />
            <p>{customScale.paragraphWidth}%</p>
          </span>
        </span>

        <span class="flex-row">
          <label for="options-width">Options width</label>
          <span class="flex-row pad-8 round-8 gap-8 dark-glowing">
            <input
              id="options-width"
              type="range"
              min="50"
              max="100"
              step="1"
              bind:value={customScale.optionsWidth}
            />
            <p>{customScale.optionsWidth}%</p>
          </span>
        </span>
      </div>
      <span class="flex-row flex-wrap">
        <ResetSVG
          text="Reset to default scale"
          onclick={() =>
            openModal(
              ensureMessage(`reset ${activeControlPanel} settings`),
              'Reset scale',
              () => updateScale('reset'),
            )}
        />
        <button
          class:green-btn={zoom !== 1}
          use:tippy={{
            content: "Press 'Z' to toggle zoom",
            animation: 'scale',
          }}
          onclick={toggleZoom}
        >
          {#if zoom === 1}
            Zoom out
          {:else}
            Reset zoom
          {/if}
        </button>
      </span>
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
    margin-top: -2rem;

    @include respond-up(small-desktop) {
      margin-bottom: 4rem;
    }

    * {
      font-family: inherit;
      font-weight: inherit;
    }

    h4 {
      @include white-txt;
    }

    article {
      width: 100%;
      padding-inline: 1rem;
      text-align: left;
      white-space: pre-wrap;
      color: inherit;
      text-shadow: inherit;

      @include respond-up(tablet) {
        width: clamp(250px, 95%, 70rem);
      }

      @include respond-up(small-desktop) {
        width: 100%;
      }
    }

    .options {
      align-items: flex-start;
      @include box-shadow;

      @include respond-up(small-desktop) {
        width: 100%;
      }

      button {
        width: 100%;
        justify-content: flex-start;
        text-align: left;
        fill: $cyan;
        stroke: $cyan;
        color: $cyan;

        font-size: inherit;
        line-height: inherit;
        color: inherit;
        font-style: inherit;
        text-shadow: inherit;

        &:hover:not(&:disabled),
        &:active:not(&:disabled),
        &:focus:not(&:disabled) {
          filter: hue-rotate(30deg) saturate(200%);
        }

        &:disabled:not(&.active-option) {
          opacity: 0.25;
        }

        &.menu-option {
          text-align: center;
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
      @include navy;

      @include respond-up(small-desktop) {
        padding: 1rem;
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
          @include dark-blue(0.5);
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

          &.scale-icon {
            display: none;

            @include respond-up(small-desktop) {
              display: flex;
            }
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

    label {
      transition: color 0.3s ease;

      &::after {
        content: ':';
      }

      &:hover,
      &:active {
        @include white-txt;
      }
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
      background-color: $dark-gray;
      @include white-txt(soft);

      @include respond-up(tablet) {
        max-height: 70vh;
      }

      div {
        width: 100%;
        flex-wrap: wrap;
        margin-inline: unset;

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

            .title {
              @include white-txt(0.5);

              &::after {
                content: ':';
              }
            }
          }

          hr {
            display: none;
          }
        }
      }

      // SCALE
      .zoom-hint {
        width: 100%;
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
