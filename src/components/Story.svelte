<!-- LEGACY SVELTE 3/4 SYNTAX -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { tippy } from 'svelte-tippy';

  import {
    GetCache,
    SECTION_CATEGORIES_KEY,
    TERMS_KEY,
  } from '@constants/cache';
  import { blankImage, serveUrl } from '@constants/media';
  import { ensureMessage, referralWarning } from '@constants/modal';
  import { NAV_ROUTES } from '@constants/routes';
  import CoNexusGame from '@lib/story';
  import CoNexusApp from '@lib/view';
  import { story, game } from '@stores/conexus.svelte';
  import openModal, { showProfile } from '@stores/modal.svelte';
  import { navContext } from '@stores/navigation.svelte';
  import detectIOS from '@utils/ios-device';
  import { userState, getCurrentUser } from '@utils/route-guard';

  import Bookmark from '@components/utils/Bookmark.svelte';
  import BackgroundMusic from '@components/music/BackgroundMusic.svelte';
  import Tts from '@components/music/Tts.svelte';
  import Step from '@components/Step.svelte';
  import Share from '@components/utils/Share.svelte';

  import DeleteSVG from '@components/icons/Delete.svelte';
  import DoorSVG from '@components/icons/Door.svelte';
  import LoadingSVG from '@components/icons/Loading.svelte';
  import LockSVG from '@components/icons/Lock.svelte';
  import PlaySVG from '@components/icons/Play.svelte';
  import { toastStore } from '@stores/toast.svelte';

  export let section_name: string;
  export let topic_id: string;
  export let topic_name: string;

  let scroll: number;
  let userID: string | undefined = undefined;
  let isReferred: boolean = false;

  let termsAccepted: boolean = false; // temp for terms modal

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

  let inFlight = false;
  let activeTopic: Nullable<TopicPage> = null;
  let unfinishedStories: UnfinishedStory[] = [];

  let videoError = false;
  let imageError = false;

  // fetch the complete topic page payload plus unfinished stories for the current user
  const fetchTopicData = async (user_id: string | undefined): Promise<void> => {
    try {
      inFlight = true;
      const topic = await view.getTopicPage(topic_id, user_id);
      activeTopic = topic;
      unfinishedStories = topic?.unfinished_stories || [];
    } catch (error) {
      toastStore.show(
        'Failed to fetch story, please try again or contact support',
        'error',
      );
      activeTopic = null;
    } finally {
      inFlight = false;
    }
  };

  const restartGame = () => {
    game.background_image = null;
    game.background_music = null;
    $story = null;
    setTimeout(() => {
      activeTopic &&
        conexusGame.start(
          activeTopic.id,
          'topic',
          'play_limited',
          handleSetMedia,
        );
    });
  };

  onMount(async () => {
    const user = await getCurrentUser();
    userID = user?.id;
    isReferred = await userState('referred');

    await fetchTopicData(userID);

    // Get all topics in SECTION from the localStorage
    const storedTopics = GetCache<CategoryInSection[]>(
      SECTION_CATEGORIES_KEY(section_name),
    )
      ?.map((category: CategoryInSection) => category.topics)
      .flat();
    if (storedTopics) {
      // populate the global navigation rail so the section menu highlights this topic and siblings
      navContext.setContext({
        items: storedTopics.map(({ name, id }) => ({
          name: name,
          link: `/s/${section_name}/${id}?title=${name}`,
        })),
        index: storedTopics.findIndex((topic) => topic.name == topic_name),
      });
    }

    termsAccepted = GetCache<boolean>(TERMS_KEY) || false; // temp for terms modal
  });

  // CONTINUE SHAPING section
  async function DeleteStory(story_id: any) {
    await conexusGame.delete(story_id);
    unfinishedStories = unfinishedStories.filter(
      ({ story_id: id }) => id !== story_id,
    );
  }

  // Calculate story creation date to show on CONTINUE button
  const convertDate = (date: string | Date) => {
    if (!date) return 'CORRUPTED';
    date = new Date(date);

    let minutes = String(date.getMinutes());
    let hours = String(date.getHours());

    let day = String(date.getDate());
    let month = String(date.getMonth() + 1);
    let year = String(date.getFullYear());

    if (Number(minutes) < 10) minutes = '0' + minutes;
    if (Number(hours) < 10) hours = '0' + hours;
    if (Number(day) < 10) day = '0' + day;
    if (Number(month) < 10) month = '0' + month;

    return `${day}.${month}.${year.slice(2)} ${hours}:${minutes}`;
  };
</script>

<svelte:window bind:scrollY={scroll} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
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
              on:error={() => (videoError = true)}
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
              src={imageError
                ? blankImage
                : serveUrl(activeTopic.description_file_url ?? blankImage)}
              alt={activeTopic.name ?? 'Default image'}
              draggable="false"
              width="1024"
              on:error={() => (imageError = true)}
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
                    glow={true}
                  />
                {:else}
                  <button
                    class="button-glowing"
                    on:click={() => {
                      if (!isReferred) {
                        openModal(
                          referralWarning,
                          'Proceed',
                          () => (window.location.href = '/referral'),
                        );
                        return;
                      }
                      activeTopic &&
                        conexusGame.start(
                          activeTopic.id,
                          'topic',
                          'play_limited',
                          handleSetMedia,
                        );
                    }}
                  >
                    PLAY NOW
                  </button>
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
                  disabled={game.loading || !termsAccepted}
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
          <div class="flex-row">
            <LockSVG />
            <h5>Only available to holders of:</h5>
          </div>
          <span class="flex-row pad-8 pad-inline round-8">
            {#each activeTopic.topic_gates as gate}
              {#if gate}
                <a
                  href={gate.purchase_link || NAV_ROUTES.WIKI}
                  target="_blank"
                  class="gate-link"
                  class:inactive-link={!gate.purchase_link}
                  on:click={(event) => {
                    if (gate.purchase_link) return;
                    if (
                      !confirm(
                        'This collection is no longer available. Would you like to explore the wiki for more details?',
                      )
                    ) {
                      event.preventDefault();
                    }
                  }}
                  use:tippy={{ content: 'Check details', animation: 'scale' }}
                >
                  {#if gate.gate_kind === 'erc20_token'}
                    {gate.min_amount ?? 0}
                    {gate.collection_name?.toUpperCase()}
                  {:else if gate.gate_kind === 'erc721_token'}
                    {#if gate.specific_token_ids?.length}
                      NFTs:
                      {#each gate.specific_token_ids as id, i}
                        <span class="nft-id"
                          >#{id}{i < gate.specific_token_ids.length - 1
                            ? ', '
                            : ''}</span
                        >
                      {/each}
                      <span class="erc721 glow">
                        ({gate.name || gate.collection_name})
                      </span>
                    {:else}
                      <span class="erc721 glow">
                        {gate.name || gate.collection_name}
                      </span>
                    {/if}
                  {:else if gate.gate_kind === 'erc1155_token'}
                    {gate.min_amount ?? 1} × {gate.name || gate.collection_name}
                  {:else if gate.gate_kind === 'erc721_class'}
                    <span class="erc721 glow">
                      {gate.name || gate.collection_name} (Class)
                    </span>
                  {:else if gate.gate_kind === 'erc1155_class'}
                    <span class="erc1155 glow">
                      {gate.name || gate.collection_name} (Class)
                    </span>
                  {:else}
                    {gate.name || gate.collection_name || 'Unknown Gate'}
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
          cursor: help;

          &:hover,
          &:active,
          &:focus-visible {
            text-decoration: underline $deep-orange;
            color: $deep-orange;
          }
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

  // TODO: Check all this styling
  .gate-link {
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
  }

  .erc721.glow,
  .erc1155.glow {
    border: 1px solid #7f5af0; /* purple for NFT */
    box-shadow: 0 0 6px #7f5af0;
    border-radius: 0.375rem;
    padding: 0.15rem 0.35rem;
    margin-inline: 0.15rem;
  }

  .nft-id {
    background: rgba(127, 90, 240, 0.15);
    border-radius: 0.25rem;
    padding: 0 0.25rem;
    margin-inline: 0.15rem;
    font-weight: 500;
  }
</style>
