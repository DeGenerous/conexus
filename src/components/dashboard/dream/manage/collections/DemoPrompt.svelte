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
    if (game.loading) return;
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
    <LoadingSVG />
    <h5 class="text-glowing">Preparing a demo, please wait...</h5>
  </div>
{:else if !step}
  <div class="transparent-container fade-in">
    <p class="validation">Sorry, we couldn't load that prompt.</p>
    <button onclick={() => window.location.reload()}>Try again</button>
  </div>
{:else}
  <section class="demo-step dream-container">
    {#if step.title}
      <h4>{step.title}</h4>
    {/if}

    <article class="container round-8">
      {step.story}
    </article>

    <div class="options container">
      {#if !step.ended}
        {#each step.options as option, i}
          <button
            id="option-{i}"
            class="void-btn flex-row"
            disabled={game.loading}
            onclick={() => handleResponse(i + 1)}
            onpointerover={() => {
              if (!game.loading) {
                focusedOption = i;
              }
            }}
            onpointerout={() => {
              if (!game.loading) {
                focusedOption = null;
              }
            }}
            onfocus={() => (focusedOption = i)}
            onblur={() => (focusedOption = null)}
          >
            <SelectorSVG
              focused={focusedOption === i}
              disabled={game.loading}
              hideForMobiles={true}
            />
            {option}
          </button>
        {/each}
      {:else}
        <button
          class="void-btn menu-option"
          onclick={startDemo}
          disabled={game.loading}
        >
          Run Demo Again
        </button>
        <button
          class="void-btn menu-option"
          onclick={stopDemo}
          disabled={game.loading}
        >
          Exit Demo
        </button>
      {/if}
    </div>

    <div class="step flex-row">
      <h5>{topicName}</h5>
      <span class="flex-row">
        {#if game.loading}
          <LoadingSVG />
        {/if}
        <h5>Step {step.step}</h5>
      </span>
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
      animation: none;
      background-color: $transparent-black;

      h4 {
        width: auto;
      }
    }

    &.demo-step {
      h4 {
        @include cyan(1, text);
      }

      article {
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
          fill: $cyan;
          stroke: $cyan;
          color: $cyan;
          @include font(h5);

          &:hover:not(&:disabled),
          &:active:not(&:disabled),
          &:focus:not(&:disabled) {
            filter: hue-rotate(30deg) saturate(200%);
          }

          &:disabled {
            opacity: 0.25;
          }

          &.menu-option {
            text-align: center;
          }
        }
      }

      .step {
        width: 100%;
        justify-content: space-between;

        h5 {
          text-shadow: none;
          @include white-txt;
        }
      }
    }
  }
</style>
