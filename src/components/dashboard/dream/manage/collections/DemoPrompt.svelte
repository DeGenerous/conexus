<!-- 🔒 GATED FOR ADMINS -->
<script lang="ts">
  import { onMount } from 'svelte';

  import CoNexusGame from '@lib/story';
  import { story, game } from '@stores/conexus.svelte';
  import { redirectTo } from '@utils/route-guard';
  import { NAV_ROUTES } from '@constants/routes';
  import detectIOS from '@utils/ios-device';

  import Step from '@components/Step.svelte';
  import Tts from '@components/music/Tts.svelte';
  import BackgroundMusic from '@components/music/BackgroundMusic.svelte';
  import LoadingSVG from '@components/icons/Loading.svelte';

  const conexusGame = new CoNexusGame();

  let topic_id = $state<string | null>(null);
  let topic_name = $state<string>('');

  let demoStarted = $state(false);
  let focusedOption = $state<Nullable<number>>(null);
  let demoError = $state<string | null>(null);

  let init = $state<boolean>(true); // initial loading state
  let exit = $state<boolean>(false); // exit state

  const step = $derived<Nullable<StepData>>($story?.step_data ?? null);

  $effect(() => {
    if (game.loading) {
      focusedOption = null;
    }
  });

  onMount(async () => {
    // ensure we start the demo with a clean slate
    $story = null;
    game.background_image = null;
    game.background_music = null;

    const urlParams = new URLSearchParams(window.location.search);
    topic_id = urlParams.get('demoID');
    topic_name = urlParams.get('demoName') || '';

    if (!topic_id) {
      window.history.back();
    }

    if (topic_id && topic_name) {
      startDemo();
    }
  });

  const setDemoMedia = async (_topicId: string) => {
    game.background_image = null;
    game.background_music = null;
  };

  const startDemo = async () => {
    if (!topic_id || game.loading) return;

    demoError = null;
    demoStarted = true;
    $story = null;
    init = false; // disable initial loading

    try {
      await conexusGame.demo(topic_id, setDemoMedia);

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

  const quitGame = () => {
    exit = true; // reset to initial loading state
    demoStarted = false;
    $story = null;
    game.background_image = null;
    game.background_music = null;
    redirectTo(NAV_ROUTES.EXPLORE(topic_id || ''));
  };

  const restartGame = () => {
    game.background_image = null;
    game.background_music = null;
    $story = null;
    setTimeout(startDemo);
  };
</script>

{#if (game.loading || init || exit) && !step}
  <section class="dream-container fade-in">
    <h5>Experience how your prompt comes to life.</h5>
    <div class="container">
      {#if demoError}
        <p class="validation">{demoError}</p>
      {:else}
        <span class="flex-row">
          <LoadingSVG />
          <h4 class="text-glowing fade-in">
            {#if !demoStarted}
              {#if init}
                Loading story data...
              {:else if exit}
                Exiting demo...
              {/if}
            {:else}
              Preparing a demo for {topic_name}...
            {/if}
          </h4>
        </span>
      {/if}
    </div>
    <h5>
      Play through the opening moments of your creation and refine your vision.
    </h5>
  </section>
{:else if !step}
  <div class="transparent-container fade-in">
    <p class="validation">Sorry, we couldn't load that prompt.</p>
    <button onclick={() => window.location.reload()}>Try again</button>
  </div>
{:else}
  {#if !detectIOS()}
    <BackgroundMusic />
  {/if}
  <Tts />

  <Step {topic_name} {restartGame} {quitGame} />
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
  }
</style>
