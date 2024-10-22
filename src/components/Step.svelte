<script lang="ts">
  import { fullscreen, story, loading } from '@stores/conexus';
  import { background_volume, tts_volume } from '@stores/volumes';
  import { storyTitle as _storyTitle } from '@lib/conexus';
  import type { StepData } from '@lib/conexus';

  import Slider from './music/Slider.svelte';

  $: step = $story?.step_data as StepData;

  let stepFont: string = 'Verdana';

  let width: number;

  const storyTitle: string =
    _storyTitle.charAt(0).toUpperCase() + _storyTitle.slice(1);
</script>

<svelte:window bind:outerWidth={width} />

<div class="step-wrapper" style="font-family: {stepFont}">
  <div class="image-wrapper blur">
    {#if step.image}
      <img class="image" src={`data:image/png;base64,${step.image}`} alt="" />
    {:else}
      <img class="image loading-image" src="/icons/loading.svg" alt="" />
    {/if}
  </div>

  <p class="story-text">{step.story}</p>

  {#if $story?.step_data?.end}
    <hr />

    <h2 class="summary-title">Story Summary</h2>

    <p class="summary-text">{step.summary}</p>

    <h2 class="trait">AI identified you as <strong>{step.trait}</strong></h2>

    <div class="options-container blur">
      <button
        class="option menu-option"
        on:click={() => window.open('/', '_self')}>Return to main menu</button
      >
    </div>
  {:else}
    <div class="options-container">
      {#each step.options as option, i}
        <button
          style="font-family: {stepFont}"
          disabled={$loading || step.step !== $story?.maxStep}
          class="option"
          on:click={() => $story?.next_step(i + 1)}
        >
          <img
            class="option-selector"
            src="/icons/option-selector.png"
            alt="Option"
          />
          <span
            class={step.choice
              ? step.choice - 1 === i
                ? 'active-option'
                : ''
              : ''}>{option}</span
          >
        </button>
      {/each}
    </div>
  {/if}

  <section class="controls-container">
    {#if width > 600}
      <!-- PC NORMAL VIEW -->

      {#if !$fullscreen}
        <div class="control-bar">
          <div class="story-info-container">
            <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
            <div
              class="quit-wrapper"
              on:click={() => window.open('/', '_self')}
              role="button"
              tabindex="0"
            >
              <img class="quit" src="/icons/quit.png" alt="Quit" />
            </div>

            <div class="story-title">
              {storyTitle}
            </div>
          </div>

          <div class="controls">
            <Slider src="/icons/volume.png" volume={background_volume} />
            <Slider src="/icons/voice.png" volume={tts_volume} restartable />

            <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
            <div
              class="fullscreen-wrapper"
              on:click={() => fullscreen.update((old) => !old)}
              role="button"
              tabindex="0"
            >
              <img
                class="fullscreen"
                src="/icons/fullscreen.png"
                alt="Enter fullscreen mode"
              />
            </div>
          </div>
        </div>

        <div class="step-bar">
          <button
            class="step-button"
            on:click={() => $story?.loadStep(step.step - 1)}
            disabled={step.step === 1}
          >
            <img class="previous-step" src="/icons/step-arrow.png" alt="Back" />
          </button>
          <p class="step-counter">
            Step {`${step.step < 10 ? '0' : ''}${step.step}`}
          </p>
          <button
            class="step-button"
            on:click={() => $story?.loadStep(step.step + 1)}
            disabled={step.step === $story?.maxStep}
          >
            <img
              class="next-step"
              src="/icons/step-arrow.png"
              alt="Next"
              style="transform: rotate(180deg)"
            />
          </button>
        </div>

        <!-- PC FULLSCREEN VIEW -->
      {:else}
        <div class="story-info-container">
          <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
          <div
            class="quit-wrapper"
            on:click={() => window.open('/', '_self')}
            role="button"
            tabindex="0"
            style="background-color: rgba(1, 0, 32, 0.1)"
          >
            <img
              class="quit"
              src="/icons/quit-fullscreen.png"
              alt="Quit"
              style="opacity: 0.5"
            />
          </div>

          <div class="story-title" style="opacity: 0.5">
            {storyTitle}
          </div>
        </div>

        <div class="step-bar-fullscreen">
          <button
            class="step-button"
            on:click={() => $story?.loadStep(step.step - 1)}
            style="background-color: rgba(1, 0, 32, 0.1)"
            disabled={step.step === 1}
          >
            <img
              class="previous-step"
              src="/icons/step-arrow-fullscreen.png"
              alt="Back"
              style="opacity: 0.5"
            />
          </button>
          <p class="step-counter" style="opacity: 0.5">
            Step {`${step.step < 10 ? '0' : ''}${step.step}`}
          </p>
          <button
            class="step-button"
            on:click={() => $story?.loadStep(step.step + 1)}
            style="background-color: rgba(1, 0, 32, 0.1)"
            disabled={step.step === $story?.maxStep}
          >
            <img
              class="next-step"
              src="/icons/step-arrow-fullscreen.png"
              alt="Next"
              style="transform: rotate(180deg); opacity: 0.5"
            />
          </button>
        </div>

        <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
        <div
          class="fullscreen-wrapper"
          on:click={() => fullscreen.update((old) => !old)}
          role="button"
          tabindex="0"
          style="background-color: rgba(1, 0, 32, 0.1)"
        >
          <img
            class="fullscreen"
            src="/icons/fullscreen-exit.png"
            alt="Exit fullscreen mode"
            style="opacity: 0.5"
          />
        </div>
      {/if}

      <!-- MOBILE VIEW -->
    {:else}
      <div class="control-bar blur">
        <div class="mobile-controls">
          <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
          <div
            class="quit-wrapper"
            on:click={() => window.open('/', '_self')}
            role="button"
            tabindex="0"
          >
            <img class="quit" src="/icons/quit.png" alt="Quit" />
          </div>

          <div class="step-bar blur">
            <button
              class="step-button"
              on:click={() => $story?.loadStep(step.step - 1)}
              disabled={step.step === 1}
            >
              <img
                class="previous-step"
                src="/icons/step-arrow.png"
                alt="Back"
              />
            </button>
            <p class="step-counter">
              Step {`${step.step < 10 ? '0' : ''}${step.step}`}
            </p>
            <button
              class="step-button"
              on:click={() => $story?.loadStep(step.step + 1)}
              disabled={step.step === $story?.maxStep}
            >
              <img
                class="next-step"
                src="/icons/step-arrow.png"
                alt="Next"
                style="transform: rotate(180deg)"
              />
            </button>
          </div>

          <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
          <div
            class="fullscreen-wrapper"
            on:click={() => fullscreen.update((old) => !old)}
            role="button"
            tabindex="0"
          >
            <img
              class="fullscreen"
              src={$fullscreen
                ? '/icons/fullscreen-exit.png'
                : '/icons/fullscreen.png'}
              alt={($fullscreen ? 'Exit' : 'Enter') + ' fullscreen mode'}
            />
          </div>
        </div>
        <div class="mobile-sliders">
          <Slider src="/icons/volume.png" volume={background_volume} />
          <Slider src="/icons/voice.png" volume={tts_volume} restartable />
        </div>
      </div>
    {/if}
  </section>
  {#if width <= 600}
    <div class="story-title">
      {storyTitle}
    </div>
  {/if}
</div>

<style>
  .step-wrapper {
    font-family: sans-serif;
    font-weight: bold;
    word-spacing: 0.4em;
  }

  hr {
    width: 100%;
    margin: 2vw auto;
    border: 0.1vw solid rgba(51, 226, 230, 0.5);
  }

  button {
    font-family: 'PT Serif Caption', 'serif';
    cursor: pointer;
  }

  .image-wrapper {
    align-self: center;
    width: 95%;
    height: auto;
    margin-block: 4vw 2vw;
    margin-inline: auto;
    border: 0.05vw solid rgba(51, 226, 230, 0.25);
    border-radius: 1em;
    filter: drop-shadow(0 0 0.5vw rgba(51, 226, 230, 0.25));
    background-color: rgba(51, 226, 230, 0.05);
    transition: cubic-bezier(0.19, 1, 0.22, 1) 1s;
  }

  .image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 1em;
  }

  .loading-image {
    height: 53.4375vw;
    object-fit: contain;
  }

  .story-text,
  .summary-text {
    padding-block: 1vw;
    width: 94%;
    font-size: 1.5vw;
    line-height: 3vw;
    margin-inline: auto;
  }

  .summary-title,
  .trait {
    font-size: 2vw;
    line-height: 4vw;
    color: rgba(51, 226, 230, 0.5);
  }

  .summary-title {
    margin: 0;
  }

  .trait strong {
    color: rgba(51, 226, 230, 1);
    filter: drop-shadow(0 0 0.5vw rgba(51, 226, 230, 0.5));
  }

  .options-container {
    width: 93%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 1vw;
    margin-block: 2vw;
    margin-inline: auto;
    border: 0.05vw solid rgba(51, 226, 230, 0.5);
    border-radius: 1em;
    background-color: rgba(51, 226, 230, 0.05);
  }

  .option {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 0.75em;
    text-align: start;
    font-weight: bold;
    font-size: 2vw;
    line-height: 4vw;
    padding: 1vw 2vw;
    color: rgba(51, 226, 230, 0.8);
    background-color: rgba(0, 0, 0, 0);
    border: none;
  }

  .active-option {
    color: rgba(51, 226, 230, 1);
    filter: drop-shadow(0 0 0.5vw rgba(51, 226, 230, 0.5));
  }

  .menu-option {
    justify-content: center;
  }

  .option-selector {
    height: 2vw;
    width: auto;
    opacity: 0.8;
  }

  .option:hover,
  .option:active {
    color: rgba(51, 226, 230, 1);
    filter: drop-shadow(0 0 0.5vw rgba(51, 226, 230, 0.25));
  }

  .option:disabled {
    opacity: 0.5;
    cursor: auto;
    color: rgba(51, 226, 230, 0.6) !important;
  }

  .option:disabled:hover,
  .option:disabled:active {
    color: rgba(51, 226, 230, 0.8);
    filter: none;
  }

  .controls-container {
    position: relative;
    width: 95%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    margin-top: 2vw;
    margin-bottom: 4vw;
    margin-inline: auto;
  }

  .control-bar,
  .step-bar {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 1vw;
    background-color: rgba(36, 65, 189, 0.75);
    border: 0.05vw solid rgba(51, 226, 230, 0.5);
    border-radius: 1em;
  }

  .control-bar {
    width: 73%;
  }

  .step-bar {
    width: 21%;
  }

  .step-bar-fullscreen {
    width: 35%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    margin-right: 5vw;
  }

  .story-info-container {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }

  .story-title,
  .step-counter {
    font-size: 1.75vw;
    line-height: 3vw;
    font-weight: normal;
  }

  .story-title {
    padding-right: 1rem;
  }

  .controls {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 1vw;
  }

  .fullscreen-wrapper,
  .quit-wrapper,
  .step-button {
    height: 3.5vw;
    width: 3.5vw;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5vw;
    background-color: rgba(1, 0, 32, 0.5);
    border: 0.05vw solid rgba(51, 226, 230, 0.5);
    border-radius: 1em;
    cursor: pointer;
  }

  .quit-wrapper,
  .step-button {
    background-color: rgba(51, 226, 230, 0.25);
    margin-right: 2vw;
    flex-shrink: 0;
  }

  .step-button {
    margin: 0;
    height: 4.6vw;
    width: 4.6vw;
  }

  .quit,
  .previous-step,
  .next-step {
    height: 100%;
  }

  .fullscreen {
    height: 2vw;
    object-fit: contain;
  }

  .fullscreen-wrapper:hover,
  .fullscreen-wrapper:active,
  .quit-wrapper:hover,
  .quit-wrapper:active,
  .step-button:hover,
  .step-button:active {
    opacity: 0.75 !important;
  }

  .step-button:disabled {
    opacity: 0.4 !important;
  }

  @media screen and (max-width: 600px) {
    hr {
      width: 90%;
      margin: 1.5em auto;
    }

    .image-wrapper {
      height: 512px;
    }

    .loading-image {
      height: 512px;
    }

    .story-title,
    .step-counter {
      font-size: 1em;
      line-height: 1.5em;
    }

    .story-text,
    .summary-text {
      width: 90%;
      margin-top: 0.75em;
      font-size: 1em;
      line-height: 1.75em;
      color: #dedede;
    }

    .summary-title,
    .trait {
      color: rgba(51, 226, 230, 0.75);
      font-size: 1.2em;
      line-height: 3em;
    }

    .option {
      font-size: 1em;
      line-height: 2em;
      padding: 0.5em 1em;
    }

    .option-selector {
      height: 1em;
    }

    .controls-container {
      margin-block: 1em 0.5em;
    }

    .control-bar {
      flex-flow: column nowrap;
      padding: 0.5em;
      gap: 0.5em;
      border-radius: 0.5em;
    }

    .control-bar {
      width: 100%;
    }

    .step-bar {
      width: 50%;
      gap: 0.5em;
      border-radius: 0.5em;
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

    .story-title,
    .step-counter {
      font-size: 1em;
      line-height: 1.5em;
    }

    .story-title {
      width: 90%;
      text-align: center;
      font-weight: bold;
      color: rgba(51, 226, 230, 0.75);
      margin-bottom: 4vw;
      margin-inline: 5%;
    }

    .controls {
      width: 100%;
      justify-content: space-between;
    }

    .fullscreen-wrapper,
    .quit-wrapper,
    .step-button {
      height: 2em;
      width: 2em;
      padding: 0.1em;
      border-radius: 0.5em;
    }

    .quit,
    .previous-step,
    .next-step {
      height: 90%;
    }

    .fullscreen {
      height: 1em;
    }
  }

  @media screen and (min-width: 1920px) {
    hr {
      width: 100rem;
      border: 0.1rem solid rgba(51, 226, 230, 0.5);
      margin: 2rem auto;
    }

    .image-wrapper {
      width: 100rem;
      margin-block: 2rem 1rem;
    }

    .loading-image {
      height: 56.25rem;
    }

    .story-text,
    .summary-text {
      width: 98rem;
      padding-block: 1rem;
      margin-top: 1rem;
      font-size: 1.5rem;
      line-height: 3rem;
      color: #dedede;
    }

    .options-container {
      width: 98rem;
      padding: 1rem;
      margin-block: 1rem;
    }

    .option {
      font-size: 1.75rem;
      line-height: 4rem;
      padding: 0.5rem 1rem;
    }

    .option-selector {
      height: 1.5rem;
    }

    .summary-title,
    .trait {
      font-size: 1.5rem;
      line-height: 3rem;
      -webkit-text-stroke: 0.1rem;
      margin: 0;
    }

    .trait {
      margin-bottom: 2rem;
    }

    .controls-container {
      width: 100rem;
      margin-top: 2rem;
    }

    .control-bar,
    .step-bar {
      padding: 1rem;
    }

    .control-bar {
      width: 78%;
    }

    .step-bar {
      width: 16%;
    }

    .step-bar-fullscreen {
      width: 20%;
      margin-right: 5rem;
    }

    .controls {
      gap: 1rem;
    }

    .story-title,
    .step-counter {
      font-size: 1.5rem;
      line-height: 3rem;
    }

    .fullscreen-wrapper,
    .quit-wrapper,
    .step-button {
      height: 2rem;
      width: 2rem;
      padding: 0.5rem;
    }

    .step-button {
      height: 3.1rem;
      width: 3.1rem;
    }

    .quit-wrapper {
      margin-right: 2rem;
    }

    .fullscreen {
      height: 1.5rem;
    }
  }
</style>
