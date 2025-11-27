<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { tippy } from 'svelte-tippy';

  import { GetCache, SetCache, PLAY_OPTIONS_KEY } from '@constants/cache';
  import { blankImage, serveUrl } from '@constants/media';
  import { ensureMessage, referralWarning } from '@constants/modal';
  import { NAV_ROUTES } from '@constants/routes';
  import CoNexusGame from '@lib/story';
  import CoNexusApp from '@lib/view';
  import { story, game } from '@stores/conexus.svelte';
  import openModal, {
    modal,
    showModal,
    showProfile,
    playOptions,
    resetModal,
  } from '@stores/modal.svelte';
  import detectIOS from '@utils/ios-device';
  import { getCurrentUser, userState } from '@utils/route-guard';
  import { getPersonalSetup, developerMode } from '@stores/account.svelte';
  import convertDate from '@utils/date-converter';
  import { resolveRenderableImage } from '@utils/file-validation';
  import { navContext } from '@stores/navigation.svelte';

  import Bookmark from '@components/utils/Bookmark.svelte';
  import BackgroundMusic from '@components/music/BackgroundMusic.svelte';
  import Tts from '@components/music/Tts.svelte';
  import Step from '@components/Step.svelte';
  import Share from '@components/utils/Share.svelte';
  import PullToRefresh from '@components/utils/PullToRefresh.svelte';

  import DeleteSVG from '@components/icons/Delete.svelte';
  import DoorSVG from '@components/icons/Door.svelte';
  import LoadingSVG from '@components/icons/Loading.svelte';
  import LockSVG from '@components/icons/Lock.svelte';
  import PlaySVG from '@components/icons/Play.svelte';

  let {
    section_name,
    username,
    topic_id,
    topic_name,
    category_id,
  }: {
    section_name?: string;
    username?: string;
    topic_id: string;
    topic_name: string;
    category_id?: string;
  } = $props();

  let userID = $state<string | undefined>(undefined);
  let isReferred = $state<boolean>(false);

  const conexusGame: CoNexusGame = new CoNexusGame();
  const view: CoNexusApp = new CoNexusApp();

  // hydrate the shared stores with whatever background assets this topic exposes
  const handleSetMedia = async (topic_id: string) => {
    const [image, audio] = await Promise.all([
      view.setBackgroundImage(topic_id),
      view.playBackgroundMusic(topic_id),
    ]);

    if (image) game.background_image = image;
    if (audio) game.background_music = audio;
  };

  let inFlight = $state<boolean>(false);
  let activeTopic = $state<Nullable<TopicPage>>(null);
  let unfinishedStories = $state<UnfinishedStory[]>([]);

  let videoError = $state<boolean>(false);
  let imageError = $state<boolean>(false);
  let descriptionImage = $state<string>(blankImage);

  // Keep the story hero image valid across topic transitions
  $effect(() => {
    const topic = activeTopic;
    const fileId = topic?.description_file_url ?? null;

    if (!fileId) {
      descriptionImage = blankImage;
      imageError = false;
      return;
    }

    const candidate = serveUrl(fileId);
    let cancelled = false;

    descriptionImage = candidate;

    (async () => {
      const safe = await resolveRenderableImage(candidate);
      if (!cancelled) {
        descriptionImage = safe;
        imageError = safe === blankImage;
      }
    })();

    return () => {
      cancelled = true;
    };
  });

  const applyNavContext = (neighbors: TopicNeighbor[]) => {
    if (!neighbors || neighbors.length < 2) {
      navContext.clear();
      return;
    }

    const index = neighbors.findIndex((t) => t.topic_id === topic_id);
    if (index < 0) {
      navContext.clear();
      return;
    }

    navContext.setContext({
      items: neighbors.map((t) => ({
        name: `${t.topic_name}`,
        link: `/${section_name ? 's' : 'c'}/${
          section_name || username
        }/${t.topic_id}?title=${t.topic_name}&category=${category_id}`,
      })),
      index,
    });
  };

  // fetch the complete topic page payload plus unfinished stories for the current user
  const fetchTopicData = async (
    user_id: string | undefined,
    refresh = false,
  ): Promise<void> => {
    try {
      inFlight = true;
      const topicPageData = await view.getTopicPage(
        topic_id,
        user_id,
        category_id,
        1,
        5,
        refresh,
      );
      activeTopic = topicPageData.topic;
      unfinishedStories = topicPageData.topic?.unfinished_stories || [];
      applyNavContext(topicPageData.neighbors);
    } catch (error) {
      console.error('Error fetching topic data:', error);
      navContext.clear();
      activeTopic = null;
    } finally {
      inFlight = false;
    }
  };

  const retrieveSettings = (): StorySettingSelector => {
    const cachedSetup = getPersonalSetup();
    if (cachedSetup) {
      return cachedSetup.settings === 'personal' ? 'account' : 'topic';
    } else return 'topic';
  };

  const retrievePlayMode = (): PlayMode => {
    const cachedSetup = getPersonalSetup();
    if (cachedSetup) {
      return cachedSetup.play_mode || 'play_limited';
    } else return 'play_limited';
  };

  const launchStory = () => {
    if (!activeTopic) return;
    conexusGame.start(
      activeTopic.id,
      retrieveSettings(),
      retrievePlayMode(),
      handleSetMedia,
    );
  };

  const startGame = () => {
    if (!isReferred && !$developerMode) {
      openModal(
        referralWarning,
        'Proceed',
        () => (window.location.href = '/referral'),
      );
      return;
    }

    const showPlayOptions = GetCache<boolean>(PLAY_OPTIONS_KEY);
    if (showPlayOptions) {
      launchStory();
      return;
    }

    $showModal = true;
    $playOptions = true;
    modal.button =
      retrievePlayMode() === 'play_limited'
        ? 'Play: 1 credit'
        : 'Play: 3 credits';
    modal.buttonFunc = () => {
      if ($playOptions === 'dont_show_again') {
        SetCache(PLAY_OPTIONS_KEY, true);
      }
      launchStory();
      resetModal();
    };
  };

  const restartGame = () => {
    game.background_image = null;
    game.background_music = null;
    $story = null;
    setTimeout(launchStory);
  };

  onMount(async () => {
    const user = await getCurrentUser();
    userID = user?.id;
    isReferred = await userState('referred');

    await fetchTopicData(userID);
  });

  onDestroy(() => {
    navContext.clear();
  });

  // CONTINUE SHAPING section
  async function DeleteStory(story_id: any) {
    await conexusGame.delete(story_id);
    unfinishedStories = unfinishedStories.filter(
      ({ story_id: id }) => id !== story_id,
    );
  }

  const refreshTopic = async () => {
    const user = await getCurrentUser(true);
    userID = user?.id;
    navContext.clear();
    await fetchTopicData(userID, true);
  };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<PullToRefresh refresh={refreshTopic}>
  {#if $story === null}
    {#if inFlight}
      <div class="story-wrapper flex">
        <section class="story container">
          <span class="fake-img loading-animation round-8"></span>

          <div class="flex">
            <span
              class="loading-animation default-genres genres round-8 pad-8 pad-inline"
            ></span>

            <span class="buttons flex-row flex-wrap">
              <button disabled>PLAY NOW</button>
              <Share disabled={true} />
            </span>
          </div>
        </section>
      </div>
    {:else if activeTopic}
      {#if activeTopic === null}
        <div class="container">
          <h4 class="red-txt">Story not found...</h4>
          <p class="soft-white-txt">
            The story you are looking for does not exist.
          </p>
        </div>
      {:else}
        <div
          class="story-wrapper flex"
          style:cursor={game.loading ? 'progress' : ''}
        >
          <section class="story container">
            {#if activeTopic.video_file_url && !videoError}
              <video
                class="round-8 transparent-glowing"
                controls
                autoplay
                loop
                muted
                onerror={() => (videoError = true)}
              >
                <source
                  src={serveUrl(activeTopic.video_file_url)}
                  type="video/mp4"
                />
                <track kind="captions" />
              </video>
            {:else}
              <img
                class="round-8 transparent-glowing"
                src={descriptionImage}
                alt={activeTopic.name ?? 'Default image'}
                draggable="false"
                width="1024"
                onerror={() => {
                  imageError = true;
                  descriptionImage = blankImage;
                }}
              />
            {/if}
            <div class="flex">
              {#if activeTopic.genres && activeTopic.genres.length > 0}
                <span class="genres round-8 pad-8 transparent-glowing">
                  <p class="text-glowing">
                    {activeTopic.genres.join(', ').toUpperCase()}
                  </p>
                </span>
              {/if}

              <span class="buttons flex-row flex-wrap">
                {#if game.loading}
                  <span class="flex-row gap-8">
                    <LoadingSVG />
                    <button disabled>LOADING</button>
                  </span>
                {:else}
                  {#if !userID}
                    <DoorSVG
                      state="inside"
                      text="play now"
                      onclick={() => {
                        $showProfile = true;
                      }}
                      cta={true}
                    />
                  {:else}
                    <button class="cta" onclick={startGame}> PLAY NOW </button>
                  {/if}
                  <Share />
                  {#if userID}
                    <Bookmark user_id={userID} topic_id={activeTopic.id} />
                  {/if}
                {/if}
              </span>
            </div>
          </section>

          {#if unfinishedStories.length}
            <section
              class="unfinished-stories transparent-container vert-scrollbar"
            >
              <h5 class="text-glowing">
                Continue Shaping: {unfinishedStories.length}
              </h5>
              {#each unfinishedStories as continuable}
                <div class="small-tile" role="button" tabindex="0">
                  <DeleteSVG
                    disabled={game.loading}
                    onclick={() => {
                      openModal(
                        ensureMessage('delete this story'),
                        `Delete story: ${topic_name}`,
                        () => DeleteStory(continuable.story_id),
                      );
                    }}
                  />
                  <span class="flex">
                    <p>{convertDate(continuable.created_at)}</p>
                    <p class="story-id">
                      {continuable.story_id.split('-')[0]}
                    </p>
                  </span>
                  <PlaySVG
                    disabled={game.loading}
                    onclick={() => {
                      conexusGame.continue(
                        {
                          topic_id: activeTopic?.id!,
                          story_id: continuable.story_id,
                        },
                        handleSetMedia,
                      );
                    }}
                  />
                </div>
              {/each}
            </section>
          {/if}
        </div>

        {#if activeTopic.topic_gates && activeTopic.topic_gates.length > 0}
          <section
            class="flex gating blur pad-8 gap-8 mar-auto round-12 wavy-mask-left-right"
          >
            <div class="flex-row gap">
              <LockSVG />
              <h5>Only available to holders of:</h5>
            </div>
            <span class="flex-row pad-8 pad-inline round-8">
              {#each activeTopic.topic_gates as gate}
                {#if gate}
                  <a
                    href={gate.purchase_link || NAV_ROUTES.WIKI}
                    target="_blank"
                    class="gate-link nohover-link"
                    class:inactive-link={!gate.purchase_link}
                    use:tippy={{ content: 'Check details', animation: 'scale' }}
                  >
                    {#if gate.gate_kind === 'erc20_token'}
                      {gate.min_amount!}
                      ${gate.collection_name?.toUpperCase()}
                    {:else if gate.gate_kind === 'erc721_token'}
                      {gate.collection_name || gate.name}
                      (NFTs: #{gate.specific_token_ids?.join(', #')})
                    {:else if gate.gate_kind === 'erc721_class'}
                      {gate.collection_name} ({gate.name})
                    {/if}
                  </a>
                {/if}
              {/each}
            </span>
          </section>
        {/if}

        <p class="description transparent-container white-txt text-shad">
          {activeTopic.description}
        </p>
      {/if}
    {/if}
  {:else}
    {#if !detectIOS()}
      <BackgroundMusic />
    {/if}
    <Tts />

    <Step {topic_name} {restartGame} />
  {/if}
</PullToRefresh>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .story-wrapper {
    width: 100vw;
    padding-inline: 1.5rem;

    @include respond-up(full-hd) {
      flex-direction: row;
    }

    .story {
      width: 100%;
      max-width: 68rem;
      margin-inline: unset;

      img,
      .fake-img {
        width: 100%;
        height: 25rem;
        object-fit: cover;
        @include cyan(0.1);
      }

      video {
        max-width: 100%;
        max-height: 25rem;

        @include respond-up(tablet) {
          min-height: 20rem;
        }
      }

      div {
        width: 100%;

        .genres {
          width: 100%;
          @include cyan(0.1);

          p {
            padding: 0;
            font-size: inherit;
            line-height: inherit;
          }

          &.default-genres {
            width: 100%;
            min-height: 2.2rem;
          }
        }

        .buttons {
          width: 100%;

          button {
            width: 100%;
          }
        }

        @include respond-up(small-desktop) {
          flex-direction: row;
          justify-content: space-between;

          .genres {
            width: auto;

            &.default-genres {
              width: 10rem;
            }
          }

          .buttons {
            width: auto;
            flex-direction: row-reverse;
            flex: none;

            button {
              width: auto;
            }
          }
        }
      }
    }

    .unfinished-stories {
      width: 100%;
      max-width: 68rem;
      margin-inline: unset;
      overflow-x: hidden !important;
      flex: none;

      h5 {
        width: 100%;
        text-transform: uppercase;
        @include font(small);
      }

      div {
        width: 100%;
        justify-content: space-between;
        border-radius: 1rem;
        @include cyan(0.2);

        &:hover,
        &:active {
          @include cyan(1, text);
          @include light-blue(0.5);
        }

        span {
          gap: 0;

          .story-id {
            opacity: 0.5;
            @include font(caption);
          }
        }
      }

      @include respond-up(tablet) {
        flex-flow: row wrap;

        div {
          width: auto;
        }
      }

      @include respond-up(full-hd) {
        align-items: flex-start;
        width: 18rem;
        max-height: 30.5rem;
        overflow: auto;

        // @include respond-up(full-hd) {
        //   width: 36rem;
        // }

        // @include respond-up(quad-hd) {
        //   width: 52rem;
        // }
      }
    }
  }

  .gating {
    width: 100%;
    max-width: 50rem;
    stroke: $dark-red;
    @include orange(0.85);

    div {
      h5 {
        text-align: left;
        @include dark-red(1, text);
      }
    }

    span {
      width: 100%;
      flex-wrap: wrap;
      @include dark-red(0.5);
      @include white-txt(soft);
      @include box-shadow(soft, inset);

      a {
        text-decoration: underline dashed $transparent-white;
        @include white-txt;

        &:hover:not(&.inactive-link),
        &:active:not(&.inactive-link),
        &:focus-visible:not(&.inactive-link) {
          text-decoration: underline $orange;
          color: $bright-orange;
        }

        &.inactive-link {
          pointer-events: none;
        }
      }
    }
  }

  .description {
    width: calc(100% - 3rem);
    max-width: 68rem;

    @include respond-up(full-hd) {
      width: calc(100% - 200px);
      max-width: 87.5rem;
    }
  }
</style>
