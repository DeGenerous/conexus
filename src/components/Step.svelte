<script lang="ts">
  import { fullscreen, story, loading } from '@stores/conexus';
  import { background_volume, tts_volume } from '@stores/volumes';
  import { storyTitle as _storyTitle } from '@lib/conexus';
  import type { StepData } from '@lib/conexus';

  import Slider from './music/Slider.svelte';
  import { afterUpdate } from 'svelte';

  let fullWidthImage: boolean = false;
  let imageWrapper: HTMLDivElement;

  afterUpdate(() => {
    if (width <= 600)
      imageWrapper.style.height = fullWidthImage ? 'auto' : '512px';
    else imageWrapper.style.height = 'auto';
  });

  $: if ($fullscreen) document.documentElement.requestFullscreen();
  else if (document.fullscreenElement) document.exitFullscreen();

  $: step = $story?.step_data as StepData;

  let stepFont: string = 'Verdana';
  let width: number;
  const storyTitle: string =
    _storyTitle.charAt(0).toUpperCase() + _storyTitle.slice(1);
</script>

<svelte:window bind:outerWidth={width} />

<section class="step-wrapper" style="font-family: {stepFont}">
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions a11y-no-static-element-interactions -->
  <div
    class="image-wrapper"
    bind:this={imageWrapper}
    on:click={() => (fullWidthImage = !fullWidthImage)}
  >
    {#if step.image}
      <img class="image" src={`data:image/png;base64,${step.image}`} alt="" />
    {:else}
      <img class="image loading-image" src="/icons/loading.png" alt="" />
      {#if width <= 600}
        <p class="click-hint">Click to change image size</p>
      {/if}
    {/if}
  </div>

  <!-- <p class="story-text">{step.story}</p> -->
  {#each step.story.split('\n') as paragraph}
    <p class="story-text">{paragraph}</p>
  {/each}

  {#if $story?.step_data?.end}
    <hr />

    <h2>Story Summary</h2>

    <p class="summary-text">{step.summary}</p>

    <h2>AI identified you as <strong>{step.trait}</strong></h2>

    <div class="options-container blur">
      <button
        class="option menu-option"
        on:click={() => window.open('/', '_self')}>Return to main menu</button
      >
    </div>
  {:else}
    <div class="options-container blur">
      {#each step.options as option, i}
        <button
          class="option {step.choice
            ? step.choice - 1 === i
              ? 'active-option'
              : ''
            : ''}"
          style="font-family: {stepFont}"
          disabled={$loading || step.step !== $story?.maxStep}
          on:click={() => $story?.next_step(i + 1)}
        >
          <img
            class="option-selector"
            src="/icons/option-selector.png"
            alt="Option"
          />
          {option}
        </button>
      {/each}
    </div>
  {/if}

  <section class="controls-container">
    {#if width > 600}
      <!-- PC NORMAL VIEW -->

      {#if !$fullscreen}
        <div class="control-bar blur">
          <div class="story-info-container">
            <button class="quit" on:click={() => window.open('/', '_self')}>
              <img src="/icons/quit.png" alt="Quit" />
            </button>
            <h3>{storyTitle}</h3>
          </div>

          <div class="controls">
            <Slider src="/icons/volume.png" volume={background_volume} />
            <Slider src="/icons/voice.png" volume={tts_volume} restartable />
            <button class="fullscreen" on:click={() => ($fullscreen = true)}>
              <img src="/icons/fullscreen.png" alt="Enter fullscreen mode" />
            </button>
          </div>
        </div>

        <div class="step-bar blur">
          <button
            class="step-button"
            on:click={() => $story?.loadStep(step.step - 1)}
            disabled={step.step === 1}
          >
            <img src="/icons/step-arrow.png" alt="Back" />
          </button>
          <h3>Step {`${step.step < 10 ? '0' : ''}${step.step}`}</h3>
          <button
            class="step-button"
            on:click={() => $story?.loadStep(step.step + 1)}
            disabled={step.step === $story?.maxStep}
          >
            <img
              src="/icons/step-arrow.png"
              alt="Next"
              style="transform: rotate(180deg)"
            />
          </button>
        </div>

        <!-- PC FULLSCREEN VIEW -->
      {:else}
        <div class="control-bar-fullscreen">
          <div class="story-info-container">
            <button
              class="quit fullscreen-btn"
              on:click={() => window.open('/', '_self')}
            >
              <img src="/icons/quit-fullscreen.png" alt="Quit" />
            </button>
            <h3 style="color: rgba(51, 226, 230, 0.5)">{storyTitle}</h3>
          </div>

          <div class="step-bar-fullscreen">
            <button
              class="step-button fullscreen-btn"
              on:click={() => $story?.loadStep(step.step - 1)}
              disabled={step.step === 1}
            >
              <img src="/icons/step-arrow-fullscreen.png" alt="Back" />
            </button>
            <h3 style="color: rgba(51, 226, 230, 0.5)">
              Step {`${step.step < 10 ? '0' : ''}${step.step}`}
            </h3>
            <button
              class="step-button fullscreen-btn"
              on:click={() => $story?.loadStep(step.step + 1)}
              style="background-color: rgba(1, 0, 32, 0.1)"
              disabled={step.step === $story?.maxStep}
            >
              <img
                src="/icons/step-arrow-fullscreen.png"
                alt="Next"
                style="transform: rotate(180deg)"
              />
            </button>
          </div>

          <button
            class="fullscreen fullscreen-btn"
            on:click={() => ($fullscreen = false)}
          >
            <img src="/icons/fullscreen-exit.png" alt="Exit fullscreen mode" />
          </button>
        </div>
      {/if}

      <!-- MOBILE VIEW -->
    {:else}
      <div class="control-bar">
        <div class="mobile-controls">
          <button class="quit" on:click={() => window.open('/', '_self')}>
            <img class="quit" src="/icons/quit.png" alt="Quit" />
          </button>

          <div class="step-bar">
            <button
              class="step-button"
              on:click={() => $story?.loadStep(step.step - 1)}
              disabled={step.step === 1}
            >
              <img src="/icons/step-arrow.png" alt="Back" />
            </button>
            <h3>Step {`${step.step < 10 ? '0' : ''}${step.step}`}</h3>
            <button
              class="step-button"
              on:click={() => $story?.loadStep(step.step + 1)}
              disabled={step.step === $story?.maxStep}
            >
              <img
                src="/icons/step-arrow.png"
                alt="Next"
                style="transform: rotate(180deg)"
              />
            </button>
          </div>

          <button
            class="fullscreen"
            on:click={() => fullscreen.update((old) => !old)}
          >
            <img
              src={$fullscreen
                ? '/icons/fullscreen-exit-mobile.png'
                : '/icons/fullscreen.png'}
              alt={($fullscreen ? 'Exit' : 'Enter') + ' fullscreen mode'}
            />
          </button>
        </div>
        <div class="mobile-sliders">
          <Slider src="/icons/volume.png" volume={background_volume} />
          <Slider src="/icons/voice.png" volume={tts_volume} restartable />
        </div>
      </div>
    {/if}
  </section>
  {#if width <= 600}
    <h3>{storyTitle}</h3>
  {/if}
</section>

<style>
  .step-wrapper {
    font-family: sans-serif;
    font-weight: bold;
    word-spacing: 0.4em;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    gap: 2vw;
    padding: 2vw;
  }

  .image-wrapper {
    position: relative;
    width: 100%;
    border-radius: 1em;
    box-shadow: 0 0 0.5vw rgba(51, 226, 230, 0.25);
    -webkit-backdrop-filter: blur(1em);
    backdrop-filter: blur(1em);
    background-color: rgba(51, 226, 230, 0.05);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 1em;
  }

  .loading-image {
    object-fit: contain;
    animation: pulse 5s linear infinite;
  }

  @keyframes pulse {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 0;
    }
  }

  .click-hint {
    position: absolute;
    width: 100%;
    text-align: center;
    bottom: 1em;
    color: rgb(51, 226, 230);
    animation: pulse 5s linear infinite;
  }

  .story-text,
  .summary-text {
    width: 100%;
    padding-inline: 1vw;
    font-size: 1.25vw;
    line-height: 2.5vw;
    text-shadow: 0 0.25vw 0.25vw #010020;
  }

  h2 {
    color: rgba(51, 226, 230, 0.75);
  }

  strong {
    color: rgb(51, 226, 230);
    text-shadow: 0 0 0.1vw rgb(51, 226, 230);
  }

  .options-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1vw;
    border-radius: 1em;
    background-color: rgba(51, 226, 230, 0.05);
    box-shadow: inset 0 0 0.5vw rgba(51, 226, 230, 0.25);
  }

  .option {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 0.75em;
    text-align: start;
    font-weight: bold;
    font-size: 1.5vw;
    line-height: 3vw;
    color: rgba(51, 226, 230, 0.75);
    background-color: rgba(0, 0, 0, 0);
    border: none;
  }

  .active-option {
    color: rgb(51, 226, 230) !important;
    text-shadow: 0 0 0.1vw rgb(51, 226, 230) !important;
  }

  .menu-option {
    width: 100%;
  }

  .option-selector {
    height: 2vw;
    width: auto;
    opacity: 0.85;
  }

  .option:hover,
  .option:active {
    color: rgba(51, 226, 230, 1);
    text-shadow: 0 0.25vw 0.5vw #010020;
    filter: none;
    transform: scale(1.025);
  }

  .option:disabled {
    opacity: 0.75;
    color: rgba(51, 226, 230, 0.6);
    text-shadow: none;
  }

  .option:disabled:hover,
  .option:disabled:active {
    border: none;
    background-color: transparent;
    color: rgba(51, 226, 230, 0.6);
    filter: none;
  }

  .controls-container {
    position: relative;
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
  }

  .controls-container h3 {
    white-space: nowrap;
  }

  .control-bar,
  .step-bar {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 1vw;
    padding: 1vw;
    background-color: rgba(36, 65, 189, 0.75);
    border: 0.1rem solid rgba(51, 226, 230, 0.5);
    border-radius: 1em;
    box-shadow: 0 0.5vw 0.5vw #010020;
  }

  .control-bar {
    width: 77%;
  }

  .step-bar {
    width: 21%;
  }

  .story-info-container {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 1vw;
  }

  .controls {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: 1vw;
  }

  .fullscreen,
  .quit,
  .step-button {
    height: 3.5vw;
    width: 3.5vw;
    padding: 0.5vw;
  }

  .fullscreen {
    padding: 0.75vw;
  }

  .step-button:disabled {
    opacity: 0.3 !important;
  }

  .fullscreen-btn {
    background-color: transparent !important;
    border: none;
    opacity: 0.5;
  }

  .fullscreen-btn:hover,
  .fullscreen-btn:active {
    opacity: 0.75;
    filter: drop-shadow(0 0.25vw 0.25vw #010020);
  }

  .control-bar-fullscreen {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 2vw;
  }

  .step-bar-fullscreen {
    width: 21%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
  }

  @media screen and (max-width: 600px) {
    :global(html) {
      padding-top: 0;
    }

    .step-wrapper {
      gap: 1em;
      padding: 1em;
    }

    .image-wrapper {
      height: 512px;
    }

    .story-text,
    .summary-text {
      font-size: 1em;
      line-height: 1.75em;
      padding-inline: 0.5em;
    }

    .options-container {
      gap: 0.5em;
      padding: 0.5em;
    }

    .option {
      font-size: 1em;
      line-height: 2em;
    }

    .option-selector {
      height: 1.25em;
    }

    .control-bar {
      flex-flow: column nowrap;
      padding: 0.5em;
      gap: 1em;
    }

    .control-bar {
      width: 100%;
    }

    .step-bar {
      width: 50%;
      gap: 0.5em;
      border-radius: 0.5em;
    }

    .step-bar h3 {
      color: #dedede;
      font-weight: 100;
    }

    h3 {
      color: rgba(51, 226, 230, 0.75);
    }

    .mobile-controls {
      width: 100%;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
    }

    .mobile-sliders {
      width: 100%;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
    }

    .controls {
      width: 100%;
      justify-content: space-between;
    }

    .fullscreen,
    .quit,
    .step-button {
      height: 2em;
      width: 2em;
      padding: 0.1em;
      border-radius: 0.5em;
    }

    .fullscreen {
      padding: 0.25em;
    }
  }

  @media screen and (min-width: 1920px) {
    h3 {
      font-size: 1.75rem;
      line-height: 1.75rem;
    }

    .step-wrapper {
      gap: 2rem;
      padding: 2rem;
    }

    .image-wrapper {
      width: 100rem;
    }

    .story-text,
    .summary-text {
      width: 100rem;
      font-size: 1.5rem;
      line-height: 3rem;
      padding-inline: 1rem;
    }

    .options-container {
      width: 100rem;
      padding: 1rem;
      gap: 0;
    }

    .option {
      font-size: 1.75rem;
      line-height: 2.5rem;
    }

    .option-selector {
      height: 1.5rem;
    }

    .controls-container {
      width: 100rem;
    }

    .control-bar,
    .step-bar {
      padding: 1rem;
      gap: 1rem;
    }

    .controls {
      gap: 1rem;
    }

    .fullscreen,
    .quit,
    .step-button {
      height: 3.5rem;
      width: 3.5rem;
      padding: 0.5rem;
      border-radius: 1rem;
    }

    .fullscreen {
      padding: 0.75rem;
    }
  }
</style>
