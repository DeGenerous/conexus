<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';

  import MediaManager from '@lib/media';
  import { fullscreen, story, loading } from '@stores/conexus';
  import { background_volume, tts_volume } from '@stores/volumes';
  import { bgPictureOpacity, bgColor } from '@stores/background';
  import { iosDevice } from '@stores/ios';

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

  export let story_name: string;

  let width: number;
  let height: number;

  const media: MediaManager = new MediaManager();

  const handleSetMedia = async (topic_id: number) => {
    await media.setBackgroundImage(topic_id);
    await media.playBackgroundMusic(topic_id);
  };

  $: step = $story?.step_data as StepData;

  // Font for all elements inside step-wrapper

  let stepFont: string = 'Verdana';

  let baseSize: string = 'body';
  let accentSize: string = 'h5';

  let boldFont: boolean = true;
  let italicFont: boolean = false;
  let textShadow: boolean = true;

  let baseColor: string = '#dedede';
  let accentColor: string = '#33e2e6';

  // Styling customization

  let boxShadow: boolean = true;
  let optionsContainer: boolean = true;
  let optionSelector: boolean = true;

  let paragraphWidth: number = 80;
  let optionsWidth: number = 80;

  let fullWidthImage: boolean = false;
  let imageWidth: number = 800;
  let imageHeight: number = 512;
  let activeControlPanel: Nullable<string> = null;

  let activeOptionNumber: number = 0;
  let focusedOption: Nullable<number> = null;

  const switchController = (controller: string) => {
    if (activeControlPanel == controller) {
      activeControlPanel = null;
      return;
    }
    activeControlPanel = controller;
  };

  // Keyboard controls

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
        console.log($story);
        if ($loading) return;
        if (step.step !== 1) {
          $story?.loadGameStep(step.step - 1);
          blurActiveBtn();
          activeOptionNumber = 0;
        } else return;
        break;
      }
      case 'ArrowRight': {
        console.log($story);
        if ($loading) return;
        if (step.step !== $story?.maxStep) {
          $story?.loadGameStep(step.step + 1);
          blurActiveBtn();
          activeOptionNumber = 0;
        } else return;
        break;
      }
      case 'ArrowUp': {
        if (step.step !== $story?.maxStep || $loading) return;
        event.preventDefault();
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
        event.preventDefault();
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

  // let pictureKeyframe: KeyframeEffect;
  // let pictureAnimation: Animation;

  // $: if (step.image && step.image_type !== 'url') {
  //   pictureAnimation.play();
  //   window.scrollTo({
  //     top: 0,
  //     behavior: 'smooth',
  //   });
  // }

  onMount(() => {
    // const storedZoom = localStorage.getItem('step-zoom');
    // if (storedZoom) zoom = setZoom(Number(storedZoom));
    // pictureKeyframe = new KeyframeEffect(
    //   imageWrapper,
    //   [
    //     { transform: 'scale(1)' },
    //     { transform: 'scale(0.95)' },
    //     { transform: 'scale(1.05)' },
    //     { transform: 'scale(1)' },
    //   ],
    //   {
    //     duration: 600,
    //     easing: 'ease-in-out',
    //   },
    // );
    // pictureAnimation = new Animation(pictureKeyframe, document.timeline);
  });

  // Light Theme
  let local_theme: string | null = localStorage.getItem('theme')
    ? localStorage.getItem('theme')
    : 'dark';
  let theme: 'dark' | 'white' | 'beige' =
    local_theme == 'dark' ? 'dark' : local_theme == 'white' ? 'white' : 'beige';
  $: themeColor =
    theme == 'white'
      ? 'rgba(255, 255, 255, 0.9)'
      : theme == 'beige'
        ? 'rgba(250, 238, 209, 0.9)'
        : 'rgba(1, 0, 32, 0.9)';

  let mobileTextWrapperStyling = '';
  $: textWrapperStyling =
    theme == 'dark'
      ? ''
      : `
    background-color:${themeColor};
    color: black;
    border-radius: 1em;
    padding-block: 1%;
    text-shadow: none;
    box-shadow:
      inset 0 0 0.5rem #010020,
      0 0 0.5rem #010020;
    ${mobileTextWrapperStyling}
  `;
  // $: if (width < 600)
  //   mobileTextWrapperStyling = `
  //   padding: 1em;
  // `;

  const switchTheme = () => {
    switch (theme) {
      case 'dark': {
        theme = 'white';
        break;
      }
      case 'white': {
        theme = 'beige';
        break;
      }
      default:
        theme = 'dark';
    }
    localStorage.setItem('theme', theme);
  };
</script>

<svelte:window
  on:keydown={handleKeyDown}
  bind:innerWidth={width}
  bind:innerHeight={height}
/>

<section
  class="step-wrapper flex {baseSize}-font"
  class:text-shad={textShadow}
  style:font-family={stepFont}
  style:font-weight={boldFont ? 'bold' : 'normal'}
  style:font-style={italicFont ? 'italic' : ''}
  style:color={baseColor}
>
  <ImageDisplay
    bind:width
    bind:image={step.image}
    bind:image_type={step.image_type}
    bind:fullWidthImage
    bind:imageWidth
    bind:imageHeight
    bind:boxShadow
  />

  {#if step.title}
    {#key step.options}
      <h4
        class="{accentSize}-font"
        class:text-shad={textShadow}
        style:font-style={italicFont ? 'italic' : ''}
        style:color={accentColor}
      >
        {step.title}
      </h4>
    {/key}
  {/if}

  <article style:max-width="{paragraphWidth}%">{step.story}</article>

  {#if $story?.step_data?.end}
    <hr />

    <h4
      class="{accentSize}-font"
      class:text-shad={textShadow}
      style:font-style={italicFont ? 'italic' : ''}
      style:color={accentColor}
    >
      Story Summary
    </h4>

    <article style:max-width="{paragraphWidth}%">{step.summary}</article>

    <h4
      class="{accentSize}-font"
      class:text-shad={textShadow}
      style:font-style={italicFont ? 'italic' : ''}
      style:color={accentColor}
    >
      CoNexus identified your trait as:
      <strong class="text-glowing">{step.trait}</strong>
    </h4>

    {#if step.trait_description}
      <article style:max-width="{paragraphWidth}%">
        {step.trait_description}
      </article>
    {/if}

    <div
      class="options {accentSize}-font"
      class:text-shad={textShadow}
      class:transparent-container={optionsContainer}
      style:font-style={italicFont ? 'italic' : ''}
      style:color={accentColor}
      style:box-shadow={boxShadow ? '' : 'none'}
      style:max-width="{optionsWidth}%"
    >
      <button
        id="option-0"
        class="void-btn menu-option"
        on:click={() => window.open('/', '_self')}>Return to main menu</button
      >
    </div>
  {:else}
    <div
      class="flex options wide-container {accentSize}-font"
      class:text-shad={textShadow}
      class:transparent-container={optionsContainer}
      style:color={accentColor}
      style:box-shadow={boxShadow ? '' : 'none'}
      style:max-width="{optionsWidth}%"
    >
      {#key step.options}
        {#each step.options as option, i}
          <button
            id="option-{i}"
            class="void-btn flex-row gap-8"
            class:active-option={step.choice && step.choice - 1 === i}
            style:font-family={stepFont}
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
            {#if optionSelector}
              <SelectorSVG
                focused={(step.choice && step.choice - 1 === i) ||
                  focusedOption === i}
                disabled={$loading || step.step !== $story?.maxStep}
                hideForMobiles={true}
                color={accentColor}
              />
            {/if}
            {option}
          </button>
        {/each}
      {/key}
    </div>
  {/if}

  <!-- CONTROL PANEL -->
  <nav class="flex-row blur transition shad-behind pad-8">
    <span class="flex-row">
      <QuitSVG onClick={() => window.location.reload()} voidBtn={true} />
      <h5 class="title">{story_name.trim()}</h5>
    </span>
    <div class="controls flex-row">
      <div>
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
      <div>
        <label class="pc-only" for="sound">Sound</label>
        <SoundSVG
          onClick={() => switchController('sound')}
          active={activeControlPanel == 'sound'}
        />
      </div>
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
        <label for="text-size">Font</label>
        <select id="text-size" bind:value={stepFont}>
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
        {#if stepFont !== 'PT Serif Caption'}
          <button
            class:active-btn={boldFont}
            on:click={() => (boldFont = !boldFont)}
          >
            bold
          </button>
        {/if}

        <button
          class:active-btn={italicFont}
          on:click={() => (italicFont = !italicFont)}
        >
          italic
        </button>

        <button
          class:active-btn={textShadow}
          on:click={() => (textShadow = !textShadow)}
        >
          shadow
        </button>
      </span>

      <span class="flex-row pad-8 round-8 gap-8 dark-glowing">
        <label for="text-color">Base color</label>
        <input id="text-color" type="color" bind:value={baseColor} />
      </span>

      <span class="flex-row pad-8 round-8 gap-8 dark-glowing">
        <label for="title-color">Accent color</label>
        <input id="title-color" type="color" bind:value={accentColor} />
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
          bind:value={$bgPictureOpacity}
        />
        <p>{$bgPictureOpacity}%</p>
      </span>

      <span class="flex-row pad-8 round-8 gap-8 dark-glowing">
        <label for="bg-color">BG color</label>
        <input id="bg-color" type="color" bind:value={$bgColor} />
      </span>
    </div>

    <div class="transparent-container flex-row">
      <button
        class:active-btn={boxShadow}
        on:click={() => (boxShadow = !boxShadow)}
      >
        box shadow
      </button>

      <button
        class:active-btn={optionsContainer}
        on:click={() => (optionsContainer = !optionsContainer)}
      >
        options box
      </button>

      <button
        class:active-btn={optionSelector}
        on:click={() => (optionSelector = !optionSelector)}
      >
        option selector
      </button>
    </div>
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
            bind:value={imageWidth}
          />
          <p>{imageWidth}px</p>
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
            bind:value={imageHeight}
          />
          <p>{imageHeight}px</p>
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
            bind:value={paragraphWidth}
          />
          <p>{paragraphWidth}%</p>
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
            bind:value={optionsWidth}
          />
          <p>{optionsWidth}%</p>
        </span>
      </span>
    </div>

    <div class="font-size transparent-container">
      <span class="flex-row">
        <label for="text-size">Base font</label>
        <select id="text-size" bind:value={baseSize}>
          <option value="caption">Tiny</option>
          <option value="small">Small</option>
          <option value="body">Default</option>
          <option value="h5">Big</option>
          <option value="h4">Huge</option>
        </select>
      </span>

      <span class="flex-row">
        <label for="title-size">Accent font</label>
        <select id="title-size" bind:value={accentSize}>
          <option value="caption">Tiny</option>
          <option value="small">Small</option>
          <option value="body">Default</option>
          <option value="h5">Big</option>
          <option value="h4">Huge</option>
        </select>
      </span>
    </div>
  </section>
</section>

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
          filter: brightness(125%) hue-rotate(45deg);
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
        gap: 0.25rem;
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
      }

      // SCALE
      &.scale-controller {
        .font-size {
          align-items: flex-end;

          @include respond-up(tablet) {
            gap: 1.5rem;
          }
        }

        .image-scale,
        .text-scale {
          display: none;

          @include respond-up(large-desktop) {
            display: flex;
          }
        }
      }
    }
  }
</style>
