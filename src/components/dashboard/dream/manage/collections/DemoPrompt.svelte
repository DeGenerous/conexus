<!-- 🔒 GATED FOR ADMINS -->
<script lang="ts">
  import { onMount } from 'svelte';

  import CoNexusGame from '@lib/story';
  import { story, game } from '@stores/conexus.svelte';
  import { ensureCreator } from '@utils/route-guard';

  import LoadingSVG from '@components/icons/Loading.svelte';
  import SelectorSVG from '@components/icons/Selector.svelte';

  const conexusGame = new CoNexusGame();

  let promptId = $state<string | null>(null);
  let topicName = $state<string | null>(null);

  let demoStarted = $state(false);
  let focusedOption = $state<Nullable<number>>(null);
  let demoError = $state<string | null>(null);

  const step = $derived<Nullable<StepData>>($story?.step_data ?? null);
  const options = $derived(() => step?.options ?? []);
  const isEnded = $derived(() => step?.ended ?? false);
  const canInteract = $derived(() => {
    if (!step || game.loading) return false;
    if (step.ended) return false;
    const activeStory = $story;
    const maxStep = activeStory?.maxStep ?? step.step;
    return step.step === maxStep;
  });

  $effect(() => {
    if (game.loading) {
      focusedOption = null;
    }
  });

  onMount(async () => {
    await ensureCreator();

    // ensure we start the demo with a clean slate
    $story = null;
    game.background_image = null;
    game.background_music = null;

    const urlParams = new URLSearchParams(window.location.search);
    promptId = urlParams.get('demoID');
    topicName = urlParams.get('demoName');

    if (!promptId) {
      window.history.back();
    }
  });

  const setDemoMedia = async (_topicId: string) => {
    game.background_image = null;
    game.background_music = null;
  };

  const startDemo = async () => {
    if (!promptId || game.loading) return;

    demoError = null;
    demoStarted = true;
    $story = null;

    try {
      await conexusGame.demo(promptId, setDemoMedia);

      if (!$story) {
        demoError = 'We could not load that demo. Please try again.';
        demoStarted = false;
      }
    } catch (error) {
      console.error(error);
      demoError = 'We could not load that demo. Please try again.';
      demoStarted = false;
    }
  };

  const handleResponse = async (choice: number) => {
    if (!canInteract) return;
    focusedOption = null;
    await $story?.nextStep(choice);
  };

  const stopDemo = () => {
    demoStarted = false;
    $story = null;
    game.background_image = null;
    game.background_music = null;
  };
</script>

{#if !demoStarted}
  <section class="dream-container fade-in">
    <h5>Experience how your prompt comes to life.</h5>
    <div class="container">
      {#if topicName}
        <h4 class="text-glowing fade-in">{topicName}</h4>
      {/if}
      <button
        class="start-btn"
        onclick={startDemo}
        disabled={!topicName || game.loading}
      >
        {#if topicName}
          Start Demo
        {:else}
          Loading...
        {/if}
      </button>
      {#if demoError}
        <p class="validation">{demoError}</p>
      {/if}
    </div>
    <h5>
      Play through the opening moments of your creation and refine your vision.
    </h5>
  </section>
{:else if game.loading && !step}
  <div class="transparent-container flex-row fade-in">
    <h5 class="loading-title text-glowing">Preparing a demo, please wait...</h5>
    <LoadingSVG />
  </div>
{:else if !step}
  <div class="transparent-container fade-in">
    <p class="validation">Sorry, we couldn't load that prompt.</p>
    <button class="void-btn" onclick={stopDemo}>Try again</button>
  </div>
{:else}
  <section class="demo-step dream-container">
    {#if topicName}
      <h3 class="text-glowing">{topicName}</h3>
    {/if}

    {#if step.title}
      <h4 class="text-glowing">{step.title}</h4>
    {/if}

    <div class="text container">
      {step.story}
    </div>

    {#if !isEnded && options.length}
      <div class="options container flex">
        {#each options() as option, i}
          <button
            id="option-{i}"
            class="void-btn flex-row text-glowing"
            disabled={!canInteract}
            onclick={() => handleResponse(i + 1)}
            onpointerover={() => {
              if (canInteract()) {
                focusedOption = i;
              }
            }}
            onpointerout={() => {
              if (canInteract()) {
                focusedOption = null;
              }
            }}
            onfocus={() => (focusedOption = i)}
            onblur={() => (focusedOption = null)}
          >
            <SelectorSVG
              focused={focusedOption === i}
              disabled={!canInteract}
              hideForMobiles={true}
              glowing={true}
            />
            {option}
          </button>
        {/each}
      </div>
    {:else}
      <div class="summary container transparent-container">
        <h5 class="text-glowing">Summary</h5>
        <p>{step.summary}</p>
        {#if step.trait}
          <p>
            CoNexus identified your trait as:
            <strong class="text-glowing">{step.trait}</strong>
          </p>
        {/if}
        <div class="actions flex-row">
          <button class="start-btn" onclick={startDemo} disabled={game.loading}>
            Run Demo Again
          </button>
          <button class="void-btn" onclick={stopDemo} disabled={game.loading}>
            Exit Demo
          </button>
        </div>
      </div>
    {/if}

    <div class="step flex-row">
      {#if game.loading}
        <LoadingSVG />
      {/if}
      <h5>{topicName}:</h5>
      <h5>Step {step.step}</h5>
    </div>
  </section>
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .dream-container {
    @include auto-width;

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
    .text {
      text-align: left;
      white-space: pre-wrap;
      @include white-txt;
    }

    .summary {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      text-align: left;
      @include white-txt;

      p {
        white-space: pre-wrap;
      }

      .actions {
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: flex-start;
      }
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
        &:focus-visible:not(&:disabled) {
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
