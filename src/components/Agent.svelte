<script lang="ts">
  import { v4 as uuid } from 'uuid';
  import { onMount } from 'svelte';

  import { blankImage } from '@constants/media';
  import AgentGame from '@lib/agent';
  import { story, game } from '@stores/conexus.svelte';
  import { redirectTo } from '@utils/route-guard';
  import { user } from '@stores/account.svelte';
  import {
    GetCache,
    SetCache,
    TEMP_USER_ID,
    TTL_MONTH,
  } from '@constants/cache';

  import Tts from '@components/music/Tts.svelte';
  import Step from '@components/Step.svelte';

  const agent = new AgentGame();

  const topic_name = 'topic_name';

  let isDevelopmentEnv = $derived<boolean>(
    import.meta.env.PUBLIC_ENV === 'local' ||
      import.meta.env.PUBLIC_ENV === 'development',
  );

  let topic_id = $state<string>('');

  let descriptionImage = $state<string>(blankImage);
  let descriptionLoading = $state<boolean>(false);

  onMount(() => {
    if (!isDevelopmentEnv && typeof window !== 'undefined') {
      redirectTo('/');
    }

    if (!$user) {
      const storedUserId = GetCache<string>(TEMP_USER_ID);
      if (storedUserId) {
        topic_id = storedUserId; // use existing temp user id
      } else {
        topic_id = uuid();
        SetCache<string>(TEMP_USER_ID, topic_id, TTL_MONTH); // store new temp user id
      }
    } else {
      topic_id = $user.id!; // use logged-in user id
    }
  });

  const startAgentStory = () => {
    agent.start(topic_id);
  };

  const restartGame = () => {
    game.background_image = null;
    game.background_music = null;
    $story = null;
  };

  $effect(() => {
    if (!topic_id || !isDevelopmentEnv) return;

    const currentId = topic_id;
    descriptionLoading = true;

    (async () => {
      const image = await agent.getDescriptionImage(currentId);
      if (topic_id !== currentId) return;
      descriptionImage = image || blankImage;
      descriptionLoading = false;
    })();
  });
</script>

{#if $story === null}
  <section class="container fade-in">
    {#if descriptionLoading}
      <span class="fake-img loading-animation round-8"></span>
    {:else}
      <img src={descriptionImage} alt="Description" />
    {/if}

    <p>{topic_id}</p>

    <button class="cta" onclick={startAgentStory} disabled={game.loading}>
      {#if game.loading}
        Loading...
      {:else}
        Start Agent Story
      {/if}
    </button>
  </section>
{:else}
  <Tts />
  <Step {topic_name} {restartGame} />
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  img,
  .fake-img {
    width: 100%;
    height: 25rem;
    object-fit: cover;
    @include cyan(0.1);
  }
</style>
