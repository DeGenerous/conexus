<script lang="ts">
  import { onMount } from 'svelte';

  import { fullscreen, story, loading } from '@stores/conexus';
  import { background_volume, tts_volume } from '@stores/volumes';
  import { bgPictureOpacity, bgColor } from '@stores/background';
  import {
    GetCache,
    SetCache,
    ONE_YEAR_TTL,
    FONT_KEY,
    STYLING_KEY,
    SCALE_KEY
  } from '@constants/cache';
  import detectIOS from '@utils/ios-device';
  import {
    showModal,
    secondButton,
    handleSecondButton,
    modalContent,
  } from '@stores/modal';

  import Slider from '@components/music/Slider.svelte';
  import ImageDisplay from '@components/utils/ImageDisplay.svelte';

  import SelectorSVG from '@components/icons/Selector.svelte';
  import QuitSVG from '@components/icons/Quit.svelte';
  import StepSVG from '@components/icons/Step.svelte';
  import SwitchSVG from '@components/icons/Switch.svelte';
  import SoundSVG from '@components/icons/Sound.svelte';
  import FullscreenSVG from '@components/icons/Fullscreen.svelte';
  import FilledEyeSVG from '@components/icons/FilledEye.svelte';
  import ZoomInSVG from '@components/icons/ZoomIn.svelte';
  import ResetSVG from '@components/icons/Reset.svelte';
  import type { CustomFunction } from 'sass-embedded';

  export let story_name: string;

  let width: number;
  let height: number;

  $: step = $story?.step_data as StepData;

  // CONTROL BAR

  let activeControlPanel: Nullable<StepController> = null;

  const switchController = (controller: StepController) => {
    if (activeControlPanel == controller) {
      activeControlPanel = null;
      return;
    }
    activeControlPanel = controller;
  };

  // FONT FOR ALL ELEMENTS INSIDE step-wrapper

  let customFont: CustomFont = null;

  const updateFont = (reset: Nullable<"reset"> = null) => {
    if (reset) {
      customFont = {
        family: 'Verdana',
        baseSize: 'body',
        accentSize: 'h5',
        baseColor: '#dedede',
        accentColor: '#33e2e6',
        bold: true,
        italic: false,
        shadow: true
      }
    }
    SetCache(
      FONT_KEY,
      JSON.stringify(customFont),
      ONE_YEAR_TTL
    );
  }

  // update FONT in localStorage after every change
  $: customFont && updateFont();

  // calculate option selector size based on font size
  let selectorSize: number = 1.5; // rem
  $: if (customFont) selectorSize = customFont.accentSize === 'h4'
    ? 1.75
    : customFont.accentSize === 'h5'
      ? 1.5
      : customFont.accentSize === 'body'
        ? 1.25
        : customFont.accentSize === 'small'
         ? 1
         : 0.75;

  // STYLING CUSTOMIZATION

  let customStyling: CustomStyling = null;

  const updateStyling = (reset: Nullable<'reset'> = null) => {
    if (reset) {
      customStyling = {
        boxShadow: true,
        optionsContainer: true,
        optionSelector: true,
        bgPictureOpacity: 25,
        bgColor: '#000000'
      }
    }
    SetCache(
      STYLING_KEY,
      JSON.stringify(customStyling),
      ONE_YEAR_TTL
    );
  }

  // update STYLING in localStorage after every change
  $: customStyling && updateStyling(); 

  // reactive updatement of BG storages
  $: $bgPictureOpacity = customStyling ? customStyling.bgPictureOpacity : 50;
  $: $bgColor = customStyling ? customStyling.bgColor : '#000000';

  // SCALE CUSTOMIZATION

  let customScale: CustomScale = null;

  const updateScale = (reset: Nullable<'reset'> = null) => {
    if (reset) {
      customScale = {
        paragraphWidth: 80,
        optionsWidth: 80,
        imageWidth: 800,
        imageHeight: 512
      }
    }
    SetCache(
      SCALE_KEY,
      JSON.stringify(customScale),
      ONE_YEAR_TTL
    );
  }

  // update SCALE in localStorage after every change
  $: customScale && updateScale(); 

  // Show confirmation dialog on reset
  const openModal = (resetFunc: any) => {
    $secondButton = `Reset`;
    $handleSecondButton = () => {
      resetFunc();
      $showModal = false;
    }
    $modalContent = `<h4>Are you sure you want to reset ${activeControlPanel} settings?</h4>`;
    $showModal = true;
  }

  // KEYBOARD CONTROLS

  let activeOptionNumber: number = 0;
  let focusedOption: Nullable<number> = null;

  const blurActiveBtn = () => {
    if (document.activeElement!.tagName == 'BUTTON') {
      const activeOption = document.activeElement as HTMLButtonElement;
      activeOption.blur();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat) return;
    switch (event.key) {
      case 'f': {
        $fullscreen = !$fullscreen;
        break;
      }
      case 'ArrowLeft': {
        if ($loading) return;
        if (step.step !== 1) {
          // load PREV step and blur focused button if it is
          $story?.loadGameStep(step.step - 1);
          blurActiveBtn();
          activeOptionNumber = 0;
        } else return;
        break;
      }
      case 'ArrowRight': {
        if ($loading) return;
        if (step.step !== $story?.maxStep) {
          // load NEXT step and blur focused button if it is
          $story?.loadGameStep(step.step + 1);
          blurActiveBtn();
          activeOptionNumber = 0;
        } else return;
        break;
      }
      case 'ArrowUp': {
        if (step.step !== $story?.maxStep || $loading) return;
        event.preventDefault(); // prevent scroll
        // get PREV (TOP) option ID if step is not last
        if ($story?.step_data?.end) activeOptionNumber = 0; 
        else if (activeOptionNumber !== 0) activeOptionNumber--;
        const activeOption = document.getElementById(
          `option-${activeOptionNumber}`,
        );
        activeOption?.focus();
        break;
      }
      case 'ArrowDown': {
        if (step.step !== $story?.maxStep || $loading) return;
        event.preventDefault(); // prevent scroll
        // get NEXT (BOTTOM) option ID if step is not last
        if ($story?.step_data?.end) activeOptionNumber = 0;
        else if (activeOptionNumber !== step.options.length - 1)
          activeOptionNumber++;
        const activeOption = document.getElementById(
          `option-${activeOptionNumber}`,
        );
        activeOption?.focus();
        break;
      }
    }
  };

  // SCROLL ANIMATION ON IMAGE LOAD

  let pictureKeyframe: KeyframeEffect;
  let pictureAnimation: Animation;

  $: if (step.image && step.image_type !== 'url') {
    pictureAnimation.play();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

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
        easing: 'ease-in-out',
      },
    );
    pictureAnimation = new Animation(pictureKeyframe, document.timeline);

    // GET CUSTOMIZATION FROM THE localStorage

    const storedFont = JSON.parse(GetCache(FONT_KEY) as string);
    if (storedFont) customFont = storedFont;
    else updateFont('reset');

    const storedStyling = JSON.parse(GetCache(STYLING_KEY) as string);
    if (storedStyling) customStyling = storedStyling;
    else updateStyling('reset');

    const storedScale = JSON.parse(GetCache(SCALE_KEY) as string);
    if (storedScale) customScale = storedScale;
    else updateScale('reset');
  });
</script>

<svelte:window
  on:keydown={handleKeyDown}
  bind:innerWidth={width}
  bind:innerHeight={height}
/>

{#if customFont && customStyling && customScale}
  <section
    class="step-wrapper flex {customFont.baseSize}-font"
    class:text-shad={customFont.shadow}
    style:font-family={customFont.family}
    style:font-weight={customFont.bold ? 'bold' : 'normal'}
    style:font-style={customFont.italic ? 'italic' : ''}
    style:color={customFont.baseColor}
  >
    <ImageDisplay
      {width}
      image={step.image}
      image_type={step.image_type}
      imageWidth={customScale.imageWidth}
      imageHeight={customScale.imageHeight}
      boxShadow={customStyling.boxShadow}
    />

    {#if step.title}
      <h4
        class="{customFont.accentSize}-font"
        class:text-shad={customFont.shadow}
        style:font-style={customFont.italic ? 'italic' : ''}
        style:color={customFont.accentColor}
      >
        {step.title}
      </h4>
    {/if}

    <article style:max-width="{customScale.paragraphWidth}%">{step.story}</article>

    {#if $story?.step_data?.end}
      <hr />

      <h4
        class="{customFont.accentSize}-font"
        class:text-shad={customFont.shadow}
        style:font-style={customFont.italic ? 'italic' : ''}
        style:color={customFont.accentColor}
      >
        Story Summary
      </h4>

      <article style:max-width="{customScale.paragraphWidth}%">{step.summary}</article>

      <h4
        class="{customFont.accentSize}-font"
        class:text-shad={customFont.shadow}
        style:font-style={customFont.italic ? 'italic' : ''}
        style:color={customFont.accentColor}
      >
        CoNexus identified your trait as:
        <strong class="text-glowing">{step.trait}</strong>
      </h4>

      {#if step.trait_description}
        <article style:max-width="{customScale.paragraphWidth}%">
          {step.trait_description}
        </article>
      {/if}

      <div
        class="options {customFont.accentSize}-font"
        class:text-shad={customFont.shadow}
        class:transparent-container={customStyling.optionsContainer}
        style:font-style={customFont.italic ? 'italic' : ''}
        style:color={customFont.accentColor}
        style:box-shadow={customStyling.boxShadow ? '' : 'none'}
        style:max-width="{customScale.optionsWidth}%"
      >
        <button
          id="option-0"
          class="void-btn menu-option"
          on:click={() => window.open('/', '_self')}>Return to main menu</button
        >
      </div>
    {:else}
      <div
        class="flex options wide-container {customFont.accentSize}-font"
        class:text-shad={customFont.shadow}
        class:transparent-container={customStyling.optionsContainer}
        style:color={customFont.accentColor}
        style:box-shadow={customStyling.boxShadow ? '' : 'none'}
        style:max-width="{customScale.optionsWidth}%"
      >
        {#each step.options as option, i}
          <button
            id="option-{i}"
            class="void-btn flex-row gap-8"
            class:active-option={step.choice && step.choice - 1 === i}
            style:font-family={customFont.family}
            disabled={$loading || step.step !== $story?.maxStep}
            on:click={() => {
              $story?.nextStep(i + 1);
              if (activeOptionNumber !== 0) activeOptionNumber = 0;
            }}
            on:pointerover={() => {
              if (!$loading && step.step == $story?.maxStep) {
                focusedOption = i;
              }
              blurActiveBtn();
            }}
            on:pointerout={() => {
              if (!$loading && step.step == $story?.maxStep) {
                focusedOption = null;
              }
            }}
            on:focus={() => (focusedOption = i)}
            on:blur={() => (focusedOption = null)}
          >
            {#if customStyling.optionSelector}
              <SelectorSVG
                focused={(step.choice && step.choice - 1 === i) ||
                  focusedOption === i}
                disabled={$loading || step.step !== $story?.maxStep}
                hideForMobiles={true}
                color={customFont.accentColor}
                {selectorSize}
              />
            {/if}
            {option}
          </button>
        {/each}
      </div>
    {/if}

    <!-- CONTROL PANEL -->
    <nav class="flex-row blur transition shad-behind pad-8">
      <span class="flex-row">
        <QuitSVG onClick={() => window.location.reload()} voidBtn={true} />
        <h5 class="title">{story_name.trim()}</h5>
      </span>
      <div class="controls flex-row">
        <div class="scale-icon">
          <label class="pc-only" for="zoom-in-control">Scale</label>
          <ZoomInSVG
            onClick={() => switchController('scale')}
            active={activeControlPanel == 'scale'}
            control={true}
          />
        </div>
        <div>
          <label class="pc-only" for="filled-eye">Styling</label>
          <FilledEyeSVG
            onClick={() => switchController('styling')}
            active={activeControlPanel == 'styling'}
          />
        </div>
        {#if !detectIOS()}
          <div>
            <label class="pc-only" for="sound">Sound</label>
            <SoundSVG
              onClick={() => switchController('sound')}
              active={activeControlPanel == 'sound'}
            />
          </div>
        {/if}
        <div>
          <label class="pc-only" for="step-control">Step</label>
          <StepSVG
            text={`${step.step < 10 ? '0' : ''}${step.step}`}
            onClick={() => switchController('step')}
            active={activeControlPanel == 'step'}
            control={true}
          />
        </div>
      </div>
      <FullscreenSVG />
    </nav>

    <!-- STEP CONTROLLER -->
    <section class="step-controller" class:visible={activeControlPanel == 'step'}>
      <div class="transparent-container flex-row">
        <SwitchSVG
          onClick={() => $story?.loadGameStep(step.step - 1)}
          disabled={step.step === 1}
        />
        <span class="flex gap-8">
          <h5 class="title">{story_name.trim()}</h5>
          <hr />
          <h5>Step {step.step}</h5>
        </span>
        <SwitchSVG
          onClick={() => $story?.loadGameStep(step.step + 1)}
          disabled={step.step === $story?.maxStep}
          right={true}
        />
      </div>
      <ul class="transparent-container vert-scrollbar pad-inline">
        {#each Array($story!.maxStep) as _, index}
          <StepSVG
            text={String(index + 1)}
            onClick={() => $story?.loadGameStep(index + 1)}
            active={step.step == index + 1}
          />
        {/each}
      </ul>
    </section>

    <!-- SOUND CONTROLLER -->
    <section
      class="sound-controller"
      class:visible={activeControlPanel == 'sound'}
    >
      <Slider type="music" volume={background_volume} />
      <Slider type="voice" volume={tts_volume} restartable />
    </section>

    <!-- STYLING CONTROLLER -->
    <section
      class="styling-controller"
      class:visible={activeControlPanel == 'styling'}
    >
      <div class="font-family transparent-container flex-row">
        <span class="flex-row">
          <label for="custom-font">Font</label>
          <select id="custom-font" bind:value={customFont.family}>
            <option value="PT Serif Caption">Default (serif)</option>
            <option value="Merriweather">Merriweather</option>
            <option value="Lora">Lora</option>
            <option value="Roboto">Roboto</option>
            <option value="Verdana">Verdana</option>
            <option value="Monospace">Monospace</option>
            <option value="Courier Prime">Courier prime</option>
            <option value="Comic Neue">Comic Neue</option>
            <option value="Caveat">Caveat</option>
          </select>
        </span>

        <span class="flex-row gap-8">
          {#if customFont.family !== 'PT Serif Caption'}
            <button
              class:active-btn={customFont.bold}
              on:click={() => (customFont!.bold = !customFont!.bold)}
            >
              bold
            </button>
          {/if}

          <button
            class:active-btn={customFont.italic}
            on:click={() => (customFont!.italic = !customFont!.italic)}
          >
            italic
          </button>

          <button
            class:active-btn={customFont.shadow}
            on:click={() => (customFont!.shadow = !customFont!.shadow)}
          >
            shadow
          </button>
        </span>

        <span class="flex-row pad-8 round-8 gap-8 dark-glowing">
          <label for="text-color">Base color</label>
          <input id="text-color" type="color" bind:value={customFont.baseColor} />
        </span>

        <span class="flex-row pad-8 round-8 gap-8 dark-glowing">
          <label for="title-color">Accent color</label>
          <input id="title-color" type="color" bind:value={customFont.accentColor} />
        </span>
      </div>

      <div class="font-size transparent-container">
        <span class="flex-row">
          <label for="text-size">Base size</label>
          <select id="text-size" bind:value={customFont.baseSize}>
            <option value="caption">Tiny</option>
            <option value="small">Small</option>
            <option value="body">Normal</option>
            <option value="h5">Big</option>
            <option value="h4">Huge</option>
          </select>
        </span>

        <span class="flex-row">
          <label for="title-size">Accent size</label>
          <select id="title-size" bind:value={customFont.accentSize}>
            <option value="caption">Tiny</option>
            <option value="small">Small</option>
            <option value="body">Normal</option>
            <option value="h5">Big</option>
            <option value="h4">Huge</option>
          </select>
        </span>
      </div>

      <div class="transparent-container flex-row">
        <label for="bg-opacity">BG image opacity</label>
        <span class="flex-row pad-8 round-8 gap-8 dark-glowing">
          <input
            id="bg-opacity"
            type="range"
            min="0"
            max="100"
            step="5"
            bind:value={customStyling.bgPictureOpacity}
          />
          <p>{customStyling.bgPictureOpacity}%</p>
        </span>

        <span class="flex-row pad-8 round-8 gap-8 dark-glowing">
          <label for="bg-color">BG color</label>
          <input id="bg-color" type="color" bind:value={customStyling.bgColor} />
        </span>
      </div>

      <div class="transparent-container flex-row">
        <button
          class:active-btn={customStyling.boxShadow}
          on:click={() => (customStyling!.boxShadow = !customStyling!.boxShadow)}
        >
          box shadow
        </button>

        <button
          class:active-btn={customStyling.optionsContainer}
          on:click={() => (customStyling!.optionsContainer = !customStyling!.optionsContainer)}
        >
          options box
        </button>

        <button
          class:active-btn={customStyling.optionSelector}
          on:click={() => (customStyling!.optionSelector = !customStyling!.optionSelector)}
        >
          option selector
        </button>
      </div>
      <ResetSVG text="Reset to default" onClick={() => openModal(() => updateStyling('reset'))} />
    </section>

    <!-- SCALE CONTROLLER -->
    <section
      class="scale-controller"
      class:visible={activeControlPanel == 'scale'}
    >
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
      <ResetSVG text="Reset to default" onClick={() => openModal(() => updateScale('reset'))} />
    </section>
  </section>
{:else}
  <div class="non-transparent-container">
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
      width: clamp(250px, 95%, 70rem);
      padding-inline: 1rem;
      text-align: left;
      white-space: pre-wrap;
      color: inherit;
      text-shadow: inherit;

      @include respond-up(large-desktop) {
        width: 100%;
      }
    }

    .options {
      align-items: flex-start;

      @include respond-up(large-desktop) {
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

          &.scale-icon {
            display: none;

            @include respond-up(large-desktop) {
              display: flex;
            }
          }
        }
      }
    }

    label {
      transition: color 0.3s ease-in-out;

      &::after {
        content: ':';
      }

      &:hover,
      &:active {
        @include white-txt;
      }
    }

    select {
      width: 12rem;

      @include respond-up(tablet) {
        width: 15rem;
      }
    }

    // ADDITIONAL CONTROLLERS STYLING
    section {
      @extend :global(.shad-behind);
      max-height: 80vh;
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
      transition: all 0.6s ease-in-out;
      background-color: $dark-gray;
      @include white-txt(soft);

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

      // STYLING
      &.styling-controller {
        .font-family {
          gap: 1rem 1.5rem;
        }

        .font-size {
          align-items: flex-end;

          @include respond-up(tablet) {
            gap: 1.5rem;
          }
        }
      }
    }
  }
</style>
