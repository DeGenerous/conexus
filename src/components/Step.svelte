<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';

  import MediaManager from '@lib/media';
  import { fullscreen, story, loading } from '@stores/conexus';
  import { background_volume, tts_volume } from '@stores/volumes';
  import { iosDevice } from '@stores/ios';

  import Slider from '@components/music/Slider.svelte';
  import ImageDisplay from '@components/utils/ImageDisplay.svelte';
  import SelectorSVG from '@components/icons/Selector.svelte';
  import QuitSVG from '@components/icons/Quit.svelte';
  import StepSVG from '@components/icons/Step.svelte';
  import SwitchSVG from '@components/icons/Switch.svelte';
  import SoundSVG from '@components/icons/Sound.svelte';

  export let story_name: string;

  const media: MediaManager = new MediaManager();

  const handleSetMedia = async (topic_id: number) => {
    await media.setBackgroundImage(topic_id);
    await media.playBackgroundMusic(topic_id);
  };

  let stepFont: string = 'Verdana';
  let width: number;

  let fullWidthImage: boolean = false;
  let activeControlPanel: Nullable<string> = null;

  let activeOptionNumber: number = 0;
  let focusedOption: Nullable<number> = null;

  $: step = $story?.step_data as StepData;

  const switchController = (controller: string) => {
    if (activeControlPanel == controller) {
      activeControlPanel = null;
      return;
    }
    activeControlPanel = controller;
  }

  const blurActiveBtn = () => {
    if (document.activeElement!.tagName == 'BUTTON') {
      const activeOption = document.activeElement as HTMLButtonElement;
      activeOption.blur();
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat) return;
    switch (event.key) {
      case 'f': {
        $fullscreen = !$fullscreen;
        break;
      }
      case 'ArrowLeft': {
        console.log($story)
        if ($loading) return;
        if (step.step !== 1) {
          $story?.loadGameStep(step.step - 1);
          blurActiveBtn();
          activeOptionNumber = 0;
        } else return;
        break;
      }
      case 'ArrowRight': {
        console.log($story)
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
      // case '-': {
      //   event.preventDefault();
      //   if (width < 1280) return;
      //   let stepZoom = zoom - 0.05;
      //   zoom = setZoom(stepZoom);
      //   break;
      // }
      // case '=': {
      //   event.preventDefault();
      //   if (width < 1280) return;
      //   let stepZoom = zoom + 0.05;
      //   zoom = setZoom(stepZoom);
      //   break;
      // }
    }
  };

  // afterUpdate(() => {
  //   document.onfullscreenchange = () => {
  //     if ($fullscreen !== !!document.fullscreenElement)
  //       fullscreen.set(!!document.fullscreenElement);
  //   };
  // });

  // $: if ($fullscreen) document.documentElement.requestFullscreen();
  // else if (document.fullscreenElement) document.exitFullscreen();

  let zoom: number = 1;

  let pictureKeyframe: KeyframeEffect;
  let pictureAnimation: Animation;

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

  const handleZoomWheel = (event: WheelEvent) => {
    if (width < 1280) return;
    const { deltaY, ctrlKey, metaKey } = event;
    if (!(ctrlKey || metaKey)) return;
    // event.preventDefault();
    // let stepZoom: number;
    // stepZoom = deltaY > 0 ? zoom - 0.05 : zoom + 0.05;
    // zoom = setZoom(stepZoom);
  };

  // function setZoom(zoom: number): number {
  //   const finalZoom =
  //     zoom < 0.3 ? 0.3 : zoom > width / 1280 ? width / 1280 : zoom;
  //   localStorage.setItem('step-zoom', finalZoom.toString());
  //   return finalZoom;
  // }

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
  $: if (width < 600)
    mobileTextWrapperStyling = `
    padding: 1em;
  `;

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
  bind:innerWidth={width}
  on:keydown={handleKeyDown}
  on:wheel={handleZoomWheel}
/>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- <div class="zoom-slider">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-100 -100 200 200"
    class="search-svg filter-image"
    stroke="#dedede"
    stroke-width="15"
    stroke-linecap="round"
    fill="none"
    on:click={() => {
      let stepZoom = zoom - 0.05;
      zoom = setZoom(stepZoom);
    }}
    role="button"
    tabindex="0"
    aria-label="Zoom out"
  >
    <circle cx="-20" cy="-20" r="70" />
    <line x1="34" y1="34" x2="85" y2="80" stroke-width="25" />
    <line x1="-55" y1="-20" x2="15" y2="-20" />
  </svg>
  <input
    type="range"
    min="0.3"
    max={width / 1280}
    step="0.005"
    autocomplete="off"
    bind:value={zoom}
    on:change={() => localStorage.setItem('step-zoom', zoom.toString())}
  />
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-100 -100 200 200"
    class="search-svg filter-image"
    stroke="#dedede"
    stroke-width="15"
    stroke-linecap="round"
    fill="none"
    on:click={() => {
      let stepZoom = zoom + 0.05;
      zoom = setZoom(stepZoom);
    }}
    role="button"
    tabindex="0"
    aria-label="Zoom in"
  >
    <circle cx="-20" cy="-20" r="70" />
    <line x1="34" y1="34" x2="85" y2="80" stroke-width="25" />
    <line x1="-55" y1="-20" x2="15" y2="-20" />
    <line x1="-20" y1="-55" x2="-20" y2="15" />
  </svg>
</div> -->

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions a11y-no-static-element-interactions -->
<section
  class="step-wrapper flex"
  style:font-family={stepFont}
>
  <ImageDisplay
    bind:image={step.image}
    bind:image_type={step.image_type}
    bind:fullWidthImage
  />

  {#if step.title}
    {#key step.options}
      <h4 class="text-glowing">{step.title}</h4>
    {/key}
  {/if}

  <article style={textWrapperStyling}>{step.story}</article>

  {#if $story?.step_data?.end}
    <hr />

    <h4>Story Summary</h4>

    <article style={textWrapperStyling}>{step.summary}</article>

    <h4>CoNexus identified your trait as:
      <strong class="text-glowing">{step.trait}</strong>
    </h4>

    {#if step.trait_description}
      <article style={textWrapperStyling}>{step.trait_description}</article>
    {/if}

    <div class="options transparent-container">
      <button
        id="option-0"
        class="void-btn menu-option"
        on:click={() => window.open('/', '_self')}>Return to main menu</button
      >
    </div>
  {:else}
    <div class="options transparent-container wide-container">
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
            <SelectorSVG
              focused={step.choice && step.choice - 1 === i || focusedOption === i}
              disabled={$loading || step.step !== $story?.maxStep}
              hideForMobiles={true}
              glowing={true}
            />
            {option}
          </button>
        {/each}
      {/key}
    </div>
  {/if}

  <!-- CONTROL PANEL -->
  <nav class="flex-row blur transition shad-behind pad-8">
    <span class="flex-row">
      <QuitSVG onClick={() => (window.location.reload())} voidBtn={true} />
      <h5>{story_name.trim()}</h5>
    </span>
    <div class="flex-row">
      <SoundSVG onClick={() => (switchController("sound"))}/>
      <StepSVG
        text={`${step.step < 10 ? '0' : ''}${step.step}`}
        onClick={() => (switchController("step"))}
        active={activeControlPanel == "step"}
      />
    </div>
  </nav>

  <!-- STEP CONTROLLER -->
  <section
    class="step-controller flex shad-behind"
    class:visible={activeControlPanel == "step"}
  >
    <div class="container flex-row">
      <SwitchSVG
        onClick={() => ($story?.loadGameStep(step.step - 1))}
        disabled={step.step === 1}
      />
      <span class="flex gap-8">
        <h5 class="title">{story_name.trim()}</h5>
        <hr />
        <h5>Step {step.step}</h5>
      </span>
      <SwitchSVG
        onClick={() => ($story?.loadGameStep(step.step + 1))}
        disabled={step.step === $story?.maxStep}
        right={true} />
    </div>
    <ul class="transparent-container vert-scrollbar pad-inline">
      {#each Array($story!.maxStep) as _, index}
        <StepSVG
          text={String(index + 1)}
          onClick={() => ($story?.loadGameStep(index + 1))}
          active={step.step == (index + 1)} />
      {/each}
    </ul>
  </section>

  <!-- SOUND CONTROLLER -->
  <section
    class="sound-controller flex-row shad-behind"
    class:visible={activeControlPanel == "sound"}
  >
    <Slider type="music" volume={background_volume} />
    <Slider type="voice" volume={tts_volume} restartable />
  </section>
</section>

<style lang="scss">
  @use "/src/styles/mixins" as *;

  // GENERAL STEP STYLING
  .step-wrapper {
    margin-top: -2rem;

    @include respond-up(small-desktop) {
      margin-bottom: 4rem;
    }

    * {
      font-family: inherit;
      font-weight: bold;
      word-spacing: 0.3em;
    }

    h4 {
      @include white-txt;
    }

    article {
      width: clamp(250px, 95%, 70rem);
      padding-inline: 1rem;
      text-align: left;
      white-space: pre-wrap;
      @include white-txt(soft);
      @include text-shadow;
    }

    .options {
      align-items: flex-start;
      
      button {
        @extend :global(.text-glowing);
        width: 100%;
        justify-content: flex-start;
        text-align: left;
        fill: $cyan;
        stroke: $cyan;
        color: $cyan;
        @include font(h5);

        &:hover:not(&:disabled),
        &:active:not(&:disabled),
        &:focus:not(&:disabled) {
          @include bright;
        }

        &:disabled:not(&.active-option) {
          opacity: 0.5;
          color: $cyan !important;
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
      @include dark-blue;

      @include respond-up(small-desktop) {
        padding: 1rem;
      }

      span {
        flex: none;

        h5 {
          @include light-blue(1, text);
        }
      }

      div {
        width: 100%;
        justify-content: flex-end;
      }
    }

    // ADDITIONAL CONTROLLERS STYLING
    section {
      position: fixed;
      bottom: 4rem;
      width: 100vw;
      z-index: 90;
      padding: 0.5rem;
      gap: 0.5rem;
      transform: translateY(100%);
      transition: all 0.6s ease-in-out;
      @include navy;

      &.visible {
        transform: none;
      }

      &.step-controller {
        div {
          width: 100%;
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

            .title::after {
              content: ":";
            }
          }

          hr {
            display: none;
          }
        }
      }
    }
  }
</style>

  <!-- <section class="controls-container">
    {#if width > 600}


      {#if !$fullscreen}
        <div class="control-bar blur">
          <div class="story-info-container">
            <button
              class="quit"
              on:click={() => window.location.reload()}
              on:pointerover={() => (quitSvgWindowFocus = true)}
              on:pointerout={() => (quitSvgWindowFocus = false)}
              aria-label="quit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-100 -100 200 200"
              >
                <defs>
                  <mask id="quit-svg-mask">
                    <circle r="95" fill="white" />
                    <path
                      class="quit-svg-mask"
                      d="
                        M 50 0
                        L -50 0
                        L 0 -50
                        M -50 0
                        L 0 50
                      "
                      fill="none"
                      stroke="black"
                      stroke-width="25"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      style="transform: {quitSvgWindowFocus
                        ? 'scale(1.2)'
                        : 'none'}"
                    />
                  </mask>
                </defs>

                <circle
                  r="95"
                  fill="rgb(22, 30, 95)"
                  mask="url(#quit-svg-mask)"
                  style="
                    transform: {quitSvgWindowFocus ? 'scale(1.05)' : 'none'};
                    fill: {quitSvgWindowFocus
                    ? 'rgb(1, 0, 32)'
                    : 'rgb(22, 30, 95)'}
                  "
                />
              </svg>
            </button>

            <h3>{storyTitle}</h3>
          </div>

          <div class="controls">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-100 -100 200 200"
              class="eye-svg filled-out-eye"
              stroke={themeColor}
              stroke-width="15"
              stroke-linejoin="round"
              stroke-linecap="round"
              opacity="0.75"
              on:click={switchTheme}
              role="button"
              tabindex="0"
            >
              <mask id="eye-circle">
                <path
                  fill="white"
                  stroke="white"
                  d="
                    M -80 0
                    Q 0 -90 80 0
                    Q 0 90 -80 0
                    Z
                  "
                  mask="url(#eye-circle)"
                />
                <circle r="25" fill="black" stroke="black" />
              </mask>
              <circle r="15" fill={themeColor} stroke="none" />
              <path
                fill={themeColor}
                d="
                  M -80 0
                  Q 0 -90 80 0
                  Q 0 90 -80 0
                  Z
                "
                mask="url(#eye-circle)"
              />
            </svg>
            <Slider type="music" volume={background_volume} />
            <Slider type="voice" volume={tts_volume} restartable />
            <button
              class="fullscreen"
              on:click={() => ($fullscreen = true)}
              on:pointerover={() => (fullscreenSvgWindowFocus = true)}
              on:pointerout={() => (fullscreenSvgWindowFocus = false)}
              aria-label="Enter fullscreen mode"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-100 -100 200 200"
                class="fullscreen-svg"
                fill="rgb(22, 30, 95)"
                stroke="rgb(22, 30, 95)"
                stroke-width="25"
                stroke-linecap="round"
                stroke-linejoin="round"
                style="
                  transform: {fullscreenSvgWindowFocus ? 'scale(1.05)' : ''};
                  fill: {fullscreenSvgWindowFocus
                  ? 'rgb(1, 0, 32)'
                  : 'rgb(22, 30, 95)'};
                  stroke: {fullscreenSvgWindowFocus
                  ? 'rgb(1, 0, 32)'
                  : 'rgb(22, 30, 95)'};
                "
              >
                <g
                  id="fullscreen-arrow"
                  style="transform: {fullscreenSvgWindowFocus
                    ? 'translate(-2.5%, -2.5%)'
                    : ''}"
                >
                  <line x1="0" y1="0" x2="-55" y2="-55" />
                  <polygon
                    points="
                      -85 -32 -85 -85 -32 -85
                    "
                    stroke-width="15"
                  />
                </g>
                <use href="#fullscreen-arrow" transform="rotate(90)" />
                <use href="#fullscreen-arrow" transform="rotate(180)" />
                <use href="#fullscreen-arrow" transform="rotate(270)" />
              </svg>
            </button>
          </div>
        </div>



      {:else}
        <div class="control-bar-fullscreen">
          <div class="story-info-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-100 -100 200 200"
              class="quit-svg-element"
              on:click={() => window.location.reload()}
              role="button"
              tabindex="0"
            >
              <defs>
                <mask id="quit-svg-mask">
                  <circle r="95" fill="white" />
                  <path
                    class="quit-svg-mask"
                    d="
                      M 50 0
                      L -50 0
                      L 0 -50
                      M -50 0
                      L 0 50
                    "
                    fill="none"
                    stroke="black"
                    stroke-width="25"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    style="transform: {quitSvgFullscreenFocus
                      ? 'scale(1.2)'
                      : 'none'}"
                  />
                </mask>
              </defs>

              <circle
                class="quit-svg"
                r="95"
                fill="rgba(51, 226, 230, 0.5)"
                mask="url(#quit-svg-mask)"
                on:pointerover={() => (quitSvgFullscreenFocus = true)}
                on:pointerout={() => (quitSvgFullscreenFocus = false)}
              />
            </svg>
            <h3 style="color: rgba(51, 226, 230, 0.5); max-width: none;">
              {storyTitle}
            </h3>
          </div>



    {:else}
      <div class="control-bar blur">
        <div class="mobile-controls">
          <svg
            class="quit-button-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-100 -100 200 200"
            on:click={() => window.location.reload()}
            role="button"
            tabindex="0"
          >
            <defs>
              <mask id="quit-svg-mask">
                <circle r="95" fill="white" />
                <path
                  d="
                    M 50 0
                    L -50 0
                    L 0 -50
                    M -50 0
                    L 0 50
                  "
                  fill="none"
                  stroke="black"
                  stroke-width="25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </mask>
            </defs>

            <circle
              class="quit-svg"
              r="95"
              fill="#dedede"
              mask="url(#quit-svg-mask)"
            />
          </svg>

    

          {#if !$iosDevice}
            {#if $fullscreen}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-100 -100 200 200"
                class="fullscreen-svg"
                fill="#dedede"
                stroke="#dedede"
                stroke-width="20"
                stroke-linecap="round"
                stroke-linejoin="round"
                on:click={() => fullscreen.update((old) => !old)}
                role="button"
                tabindex="0"
              >
                <g id="windowed-arrow">
                  <line x1="-90" y1="-90" x2="-50" y2="-50" />
                  <polygon
                    points="
                      -85 -32 -32 -32 -32 -85
                    "
                    stroke-width="12"
                    transform="translate(10 10)"
                  />
                </g>
                <use href="#windowed-arrow" transform="rotate(90)" />
                <use href="#windowed-arrow" transform="rotate(180)" />
                <use href="#windowed-arrow" transform="rotate(270)" />
              </svg>
            {:else}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-100 -100 200 200"
                class="fullscreen-svg"
                fill="#dedede"
                stroke="#dedede"
                stroke-width="20"
                stroke-linecap="round"
                stroke-linejoin="round"
                on:click={() => fullscreen.update((old) => !old)}
                role="button"
                tabindex="0"
              >
                <g id="fullscreen-arrow">
                  <line x1="0" y1="0" x2="-55" y2="-55" />
                  <polygon
                    points="
                      -85 -32 -85 -85 -32 -85
                    "
                    stroke-width="12"
                  />
                </g>
                <use href="#fullscreen-arrow" transform="rotate(90)" />
                <use href="#fullscreen-arrow" transform="rotate(180)" />
                <use href="#fullscreen-arrow" transform="rotate(270)" />
              </svg>
            {/if}
          {:else}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-100 -100 200 200"
              class="eye-svg filled-out-eye"
              stroke={themeColor}
              stroke-width="15"
              stroke-linejoin="round"
              stroke-linecap="round"
              opacity="1"
              on:click={switchTheme}
              role="button"
              tabindex="0"
            >
              <mask id="eye-circle">
                <path
                  fill="white"
                  stroke="white"
                  d="
                    M -80 0
                    Q 0 -90 80 0
                    Q 0 90 -80 0
                    Z
                  "
                  mask="url(#eye-circle)"
                />
                <circle r="25" fill="black" stroke="black" />
              </mask>
              <circle r="15" fill={themeColor} stroke="none" />
              <path
                fill={themeColor}
                d="
                  M -80 0
                  Q 0 -90 80 0
                  Q 0 90 -80 0
                  Z
                "
                mask="url(#eye-circle)"
              />
            </svg>
          {/if}
        </div>
        {#if !$iosDevice}
          <div class="mobile-sliders">
            <Slider type="music" volume={background_volume} />
            <Slider type="voice" volume={tts_volume} restartable />
          </div>
        {/if}
      </div>
    {/if}
  </section>
  {#if width <= 600}
    {#if !$iosDevice}
      <div
        class="theme-switcher blur"
        on:click={switchTheme}
        role="button"
        tabindex="0"
      >
        <p style="color: {themeColor}">
          {theme.charAt(0).toUpperCase() + theme.slice(1)} theme
        </p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-100 -100 200 200"
          class="eye-svg filled-out-eye"
          stroke={themeColor}
          stroke-width="15"
          stroke-linejoin="round"
          stroke-linecap="round"
          opacity="1"
        >
          <mask id="eye-circle">
            <path
              fill="white"
              stroke="white"
              d="
                M -80 0
                Q 0 -90 80 0
                Q 0 90 -80 0
                Z
              "
              mask="url(#eye-circle)"
            />
            <circle r="25" fill="black" stroke="black" />
          </mask>
          <circle r="15" fill={themeColor} stroke="none" />
          <path
            fill={themeColor}
            d="
              M -80 0
              Q 0 -90 80 0
              Q 0 90 -80 0
              Z
            "
            mask="url(#eye-circle)"
          />
        </svg>
      </div>
    {/if}
    <h3>{storyTitle}</h3>
  {/if} -->
