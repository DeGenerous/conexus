<script lang="ts">
  import { onMount } from 'svelte';
  import { AdminApp } from '@lib/admin';
  import { CoNexusGame } from '@lib/story';

  let adminApp: AdminApp = new AdminApp();
  let game: CoNexusGame = new CoNexusGame();

  let promptId: string | null = null;
  let topic_name: string | null = null;
  let story: GameData | null = null;
  let step: StepData | null = null;

  let loading: boolean = false;
  let nextStepLoading: boolean = false;
  let demoStarted: boolean = false;

  onMount(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      promptId = urlParams.get('demoID');
      topic_name = urlParams.get('demoName');

      console.log('Prompt ID:', promptId);
      console.log('Topic Name:', topic_name);

      if (!promptId) {
        window.history.back();
      }
    }
  });

  const startDemo = async () => {
    demoStarted = true;
    loading = true;

    if (promptId) {
      story = await adminApp.demoPrompt(parseInt(promptId));
      loading = false;
      console.log(story)
    }
  };

  const handleResponse = async (story_id: string, choice: number) => {
    nextStepLoading = true;
    const { data } = await game.respond(story_id, choice);
    if (data) story = data;
    nextStepLoading = false;
    console.log(data)
  };

  $: step = story as StepData;
</script>

<section class="container-wrapper">
  <div class="container blur" class:story-container={story}>
  <h3 class:hide={story}>Experience how your prompt comes to life.</h3>
    {#if !demoStarted}
      <button class="start-btn" on:click={startDemo} disabled={!topic_name}>
        {#if topic_name}
          Start {topic_name} Demo
        {:else}
          Loading...
        {/if}
      </button>
    {:else if loading}
      <div class="buttons-wrapper">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          class="loading-svg"
          stroke="transparent"
          stroke-width="7.5"
          stroke-dasharray="288.5"
          stroke-linecap="round"
          fill="none"
        >
          <path
            d="
                M 50 96 a 46 46 0 0 1 0 -92 46 46 0 0 1 0 92
              "
            transform-origin="50 50"
          />
        </svg>
        <h3 class="loading">Preparing a demo...</h3>
      </div>
    {:else if !story}
      <p class="validation">Sorry, we couldn't find that prompt</p>
    {:else}
      <h2>{step.title}</h2>
      <article class="container blur">
        {step.story}
      </article>
      {#if step.options.length > 0}
        <div class="options-container blur">
          {#each step.options as option, i}
            <button
              class="option"
              on:click={() => story && handleResponse(story.id.toString(), i + 1)}
              disabled={nextStepLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-100 -100 200 200"
                class="option-selector-svg"
                fill="rgb(51, 226, 2305)"
                stroke="rgb(51, 226, 230)"
                stroke-width="20"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polygon points="-40 -90 -40 90 50 0" opacity="0.75" />
              </svg>
              {option}
            </button>
          {/each}
        </div>
      {/if}
      <div class="buttons-wrapper story-data">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          class="loading-svg"
          stroke="transparent"
          stroke-width="7.5"
          stroke-dasharray="288.5"
          stroke-linecap="round"
          fill="none"
          visibility={nextStepLoading ? 'visible' : 'hidden'}
        >
          <path
            d="
                M 50 96 a 46 46 0 0 1 0 -92 46 46 0 0 1 0 92
              "
            transform-origin="50 50"
          />
        </svg>
        <h3>{topic_name}:</h3>
        <h3>Step {step.step}</h3>
      </div>
    {/if}
  <h3 class:hide={story}>Play through the opening moments of your creation and refine your vision.</h3>
  </div>
</section>

<style>
  .hide {
    display: none;
  }

  .story-container {
    background-color: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    box-shadow: none;
  }

  .loading,
  .story-data h3 {
    color: rgba(51, 226, 230, 0.85);
  }

  .story-data {
    margin-left: -2.5%;
  }

  article {
    font-size: 1.25vw;
    line-height: 2.5vw;
    text-shadow: 0 0.25vw 0.25vw #010020;
  }

  .options-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1vw;
    border-radius: 1em;
    background-color: rgba(51, 226, 230, 0.05);
    box-shadow:
      inset 0 0 0.5vw rgba(51, 226, 230, 0.25),
      0 0 0.5vw #010020;
  }

  .option {
    width: 100%;
    justify-content: flex-start;
    gap: 0.75em;
    text-align: start;
    font-size: 1.5vw;
    line-height: 3vw;
    color: rgba(51, 226, 230, 0.75);
    background-color: rgba(0, 0, 0, 0);
    border: none;
  }

  .option:hover,
  .option:active {
    color: rgba(51, 226, 230, 1);
    text-shadow: 0 0.25vw 0.5vw #010020;
    filter: none;
    transform: scale(1.025) translateX(0.5%);
  }

  .option:disabled {
    opacity: 0.75;
    color: rgba(51, 226, 230, 0.6);
    text-shadow: none !important;
  }

  .option:disabled:hover,
  .option:disabled:active {
    border: none;
    background-color: transparent;
    color: rgba(51, 226, 230, 0.6);
    filter: none;
    transform: none;
  }

  @media screen and (max-width: 600px) {
    .container {
      width: 100vw;
      border-radius: 0;
    }

    article {
      font-size: 1em;
      line-height: 1.75em;
      padding-inline: 1em !important;
    }

    .options-container {
      gap: 1em;
      padding: 1em 0.5em;
    }

    .option {
      font-size: 1em;
      line-height: 2em;
    }

    .option svg {
      display: none;
    }
  }
</style>
