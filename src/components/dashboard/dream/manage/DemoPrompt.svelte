<!-- LEGACY SVELTE 3/4 SYNTAX -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { AdminApp } from '@lib/admin';
  import { CoNexusGame } from '@lib/story';

  import LoadingSVG from '@components/icons/Loading.svelte';
  import SelectorSVG from '@components/icons/Selector.svelte';

  let adminApp: AdminApp = new AdminApp();
  let game: CoNexusGame = new CoNexusGame();

  let promptId: string | null = null;
  let topic_name: string | null = null;
  let story: GameData | null = null;
  let step: StepData | null = null;

  let loading: boolean = false;
  let nextStepLoading: boolean = false;
  let demoStarted: boolean = false;
  let focusedOption: Nullable<number> = null;

  onMount(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      promptId = urlParams.get('demoID');
      topic_name = urlParams.get('demoName');

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
    }
  };

  const handleResponse = async (story_id: string, choice: number) => {
    nextStepLoading = true;
    const { data } = await game.respond(story_id, choice);
    if (data) story = data;
    nextStepLoading = false;
  };

  $: step = story as StepData;
</script>

{#if !demoStarted}
  <section class="dream-container fade-in">
    <h5>Experience how your prompt comes to life.</h5>
    <div class="container">
      {#if topic_name}
        <h4 class="text-glowing fade-in">{topic_name}</h4>
      {/if}
      <button class="start-btn" on:click={startDemo} disabled={!topic_name}>
        {#if topic_name}
          Start Demo
        {:else}
          Loading...
        {/if}
      </button>
    </div>
    <h5>
      Play through the opening moments of your creation and refine your vision.
    </h5>
  </section>
{:else if loading}
  <div class="transparent-container flex-row fade-in">
    <h5 class="loading-title text-glowing">Preparing a demo, please wait...</h5>
    <LoadingSVG />
  </div>
{:else if !story}
  <div class="transparent-container fade-in">
    <p class="validation">Sorry, we couldn't find that prompt</p>
  </div>
{:else}
  <section class="demo-step dream-container">
    <h3 class="text-glowing">{step.title}</h3>
    <div class="text container">
      {step.story}
    </div>
    {#if step.options.length > 0}
      <div class="options container flex">
        {#each step.options as option, i}
          <button
            class="void-btn flex-row text-glowing"
            on:click={() => story && handleResponse(story.id.toString(), i + 1)}
            on:pointerover={() => {
              if (!nextStepLoading) {
                focusedOption = i;
              }
            }}
            on:pointerout={() => {
              if (!nextStepLoading) {
                focusedOption = null;
              }
            }}
            disabled={nextStepLoading}
          >
            <SelectorSVG
              focused={focusedOption === i}
              disabled={nextStepLoading}
              hideForMobiles={true}
              glowing={true}
            />
            {option}
          </button>
        {/each}
      </div>
    {/if}
    <div class="step flex-row">
      {#if nextStepLoading}
        <LoadingSVG />
      {/if}
      <h5>{topic_name}:</h5>
      <h5>Step {step.step}</h5>
    </div>
  </section>
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .dream-container {
    width: auto;

    .container {
      width: auto;
      padding-inline: 1.5rem;

      h4 {
        width: auto;
      }
    }
  }

  .loading-title {
    text-align: left;
  }

  .demo-step {
    max-width: min(95%, 100rem);

    .text {
      text-align: left;
      white-space: pre-wrap;
      @include white-txt;
    }

    .options {
      flex-direction: column;
      align-items: flex-start;

      @include respond-up(small-desktop) {
        width: 100%;
      }

      button {
        width: 100%;
        justify-content: flex-start;
        text-align: left;

        @include font(h5);

        &:hover:not(&:disabled),
        &:active:not(&:disabled),
        &:focus:not(&:disabled) {
          filter: hue-rotate(30deg) saturate(200%);
        }

        &:disabled:not(&.active-option) {
          opacity: 0.25;
        }
      }
    }

    .step {
      justify-content: center;

      h5 {
        text-shadow: none;
        @include white-txt;
      }
    }
  }
</style>
