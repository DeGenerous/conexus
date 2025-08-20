<!-- LEGACY SVELTE 3/4 SYNTAX -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { tippy } from 'svelte-tippy';

  import { blankImage, serveUrl } from '@constants/media';
  import CoNexusApp from '@lib/view';
  import CoNexusGame from '@lib/story';
  import { story, game } from '@stores/conexus.svelte';
  import { navContext } from '@stores/navigation.svelte';
  import { GetCache, SECTION_CATEGORIES_KEY } from '@constants/cache';
  import detectIOS from '@utils/ios-device';
  import openModal, { showProfile } from '@stores/modal.svelte';
  import { deleteUnfinishedModal, referralWarning } from '@constants/modal';
  import { userState, getCurrentUser } from '@utils/route-guard';

  import BackgroundMusic from '@components/music/BackgroundMusic.svelte';
  import Tts from '@components/music/Tts.svelte';
  import Step from '@components/Step.svelte';
  import DeleteSVG from '@components/icons/Delete.svelte';
  import PlaySVG from '@components/icons/Play.svelte';
  import LoadingSVG from '@components/icons/Loading.svelte';
  import LockSVG from '@components/icons/Lock.svelte';
  import DoorSVG from '@components/icons/Door.svelte';
  import Share from '@components/utils/Share.svelte';

  export let section: string;
  export let topic_id: string;
  export let topic_name: string;

  let scroll: number;
  let userID: string | undefined = undefined;
  let isReferred: boolean = false;

  const conexusGame: CoNexusGame = new CoNexusGame();
  const view: CoNexusApp = new CoNexusApp();

  const handleSetMedia = async (topic_id: string) => {
    const [image, audio] = await Promise.all([
      view.setBackgroundImage(topic_id),
      view.playBackgroundMusic(topic_id),
    ]);

    if (image) game.background_image = image;
    if (audio) game.background_music = audio;
  };

  let activeTopic: Nullable<TopicPage> = null;

  let videoError = false;
  let imageError = false;

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

    // Get all topics in SECTION from the localStorage
    const storedTopics = GetCache<CategoryInSection[]>(
      SECTION_CATEGORIES_KEY(section),
    )
      ?.map((category: CategoryInSection) => category.topics)
      .flat();
    if (storedTopics) {
      navContext.setContext({
        items: storedTopics.map(({ topic_name, topic_order }) => ({
          name: topic_name,
          link: `/sections/${section}/${topic_name}?id=${topic_order}`,
        })),
        index: storedTopics.findIndex(
          (topic) => topic.topic_name === topic_name,
        ),
      });
    }
  });

  // CONTINUE SHAPING section

  let deletedStories: string[] = []; // temp storage before reload for immediate removal
  let noUnfinishedStoriesLeft: boolean = false;

  async function DeleteStory(story_id: any) {
    await conexusGame.delete(story_id);
    deletedStories = deletedStories.filter((id) => id !== story_id);
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
  {#await view.getTopicPage(topic_id, userID)}
    <div class="story-wrapper flex">
      <section class="story container">
        <span class="fake-img loading-animation round-8"></span>

        <div class="flex">
          <span
            class="loading-animation default-genres genres round-8 pad-8 pad-inline shad"
          ></span>

          <span class="buttons flex-row flex-wrap">
            <button disabled>PLAY NOW</button>
            <Share disabled={true} />
          </span>
        </div>
      </section>
    </div>
  {:then topic: Nullable<TopicPage>}
    {#if topic === null}
      <div class="container">
        <h4 class="red-txt">Story not found...</h4>
        <p class="soft-white">The story you are looking for does not exist.</p>
      </div>
    {:else}
      <div
        class="story-wrapper flex"
        style:cursor={game.loading ? 'progress' : ''}
      >
        <section class="story container">
          {#if topic?.video_file_url && !videoError}
            <video
              class="round-8 transparent-glowing"
              controls
              autoplay
              loop
              muted
              on:error={() => (videoError = true)}
            >
              <source src={serveUrl(topic.video_file_url)} type="video/mp4" />
              <track kind="captions" />
            </video>
          {:else}
            <img
              class="round-8 transparent-glowing"
              src={imageError
                ? blankImage
                : serveUrl(topic?.description_file_url ?? blankImage)}
              alt={topic?.name ?? 'Default image'}
              draggable="false"
              width="1024"
              on:error={() => (imageError = true)}
            />
          {/if}
          <div class="flex">
            {#if topic.genres && topic.genres.length > 0}
              <span class="genres round-8 pad-8 shad transparent-glowing">
                <p class="text-glowing">
                  {topic.genres.join(', ').toUpperCase()}
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
                      activeTopic = topic;
                      topic &&
                        conexusGame.start(
                          topic.id,
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
              {/if}
            </span>
          </div>
        </section>

        {#if topic.unfinished_stories && topic.unfinished_stories.length > 0}
          <section
            class="unfinished-stories transparent-container vert-scrollbar"
          >
            <h5 class="text-glowing">
              Continue Shaping: {topic.unfinished_stories.length -
                deletedStories.length}
            </h5>
            {#each topic.unfinished_stories as continuable}
              {#if !deletedStories.includes(continuable.story_id)}
                <div class="small-tile" role="button" tabindex="0">
                  <DeleteSVG
                    disabled={game.loading}
                    onclick={() =>
                      openModal(
                        deleteUnfinishedModal,
                        `Delete story: ${topic_name}`,
                        () => DeleteStory(continuable.story_id),
                      )}
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
                      activeTopic = topic;
                      conexusGame.continue(
                        { topic_id: topic.id, story_id: continuable.story_id },
                        handleSetMedia,
                      );
                    }}
                  />
                </div>
              {/if}
            {/each}
          </section>
        {/if}
      </div>

      {#if topic.topic_gates && topic.topic_gates.length > 0}
        <section
          class="flex gating blur pad-8 gap-8 mar-auto round-12 shad wavy-mask-left-right"
        >
          <div class="flex-row">
            <LockSVG />
            <h5>Only available to holders of:</h5>
          </div>
          <span class="flex-row pad-8 pad-inline round-8">
            {#each topic.topic_gates as gate}
              {#if 'gate_type' in gate}
                <a
                  href={gate.purchase_link ||
                    'https://degenerousdao.gitbook.io/wiki'}
                  class:inactive-link={!gate.purchase_link}
                  target="_blank"
                  on:click={(event) => {
                    if (gate.purchase_link) return;
                    if (
                      !confirm(
                        'This collection is no longer available. Would you like to explore the wiki for more details?',
                      )
                    )
                      event.preventDefault();
                  }}
                  use:tippy={{ content: 'Check details', animation: 'scale' }}
                >
                  {#if gate.min_amount && gate.min_amount > 0}
                    {gate.min_amount} ${gate.contract_symbol.toUpperCase()}
                  {/if}
                </a>``
              {:else}
                {gate.class_name}
              {/if}
            {/each}
          </span>
        </section>
      {/if}

      <p class="description transparent-container white-txt text-shad">
        {topic.description}
      </p>
    {/if}
  {:catch}
    <div class="container">
      <h4 class="red-txt">Failed to fetch story...</h4>
      <p class="soft-white-txt">Please try again or contact support.</p>
    </div>
  {/await}
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
    margin-top: 1rem;

    .story {
      width: 90%;
      max-width: 50rem;
      min-width: 250px;

      img,
      .fake-img {
        width: 100%;
        height: 25rem;
        @include box-shadow;
        @include cyan(0.1);
      }

      video {
        max-width: 100%;
        max-height: 25rem;
        @include box-shadow;

        @include respond-up(tablet) {
          min-height: 20rem;
        }
      }

      div {
        width: 100%;

        span {
          width: 100%;
        }

        .genres {
          @include cyan(0.1);
          @include font(small);

          p {
            padding: 0;
            font-size: inherit;
            line-height: inherit;
          }

          &.default-genres {
            min-width: 20rem;
            min-height: 2.2rem;
          }
        }
      }

      @include respond-up(tablet) {
        div {
          flex-direction: row;
          justify-content: space-between;
          gap: 1rem;
          flex: none;

          span {
            max-width: 100%;
            width: auto;
          }

          .buttons {
            justify-content: flex-end;
            flex-direction: row-reverse;
            flex: none;
          }
        }
      }

      @include respond-up(small-desktop) {
        max-width: 68rem;
        width: auto;
      }
    }

    .unfinished-stories {
      overflow-x: hidden !important;

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
        width: 90%;
        max-width: 50rem;

        div {
          width: auto;
        }
      }

      @include respond-up(small-desktop) {
        max-width: 68rem;
      }
    }

    @include respond-up(large-desktop) {
      flex-direction: row;

      .story {
        margin-inline: unset;
      }

      .unfinished-stories {
        margin-inline: unset;
        align-items: flex-start;
        width: 18rem;
        max-height: 30.5rem;
        overflow: auto;

        @include respond-up(full-hd) {
          width: 36rem;
        }

        @include respond-up(quad-hd) {
          width: 52rem;
        }
      }
    }
  }

  .gating {
    margin-top: 1rem;
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
        &:focus:not(&.inactive-link) {
          text-decoration: underline $orange;
          color: $bright-orange;
        }

        &.inactive-link {
          cursor: help;

          &:hover,
          &:active,
          &:focus {
            text-decoration: underline $deep-orange;
            color: $deep-orange;
          }
        }
      }
    }
  }

  .description {
    margin-top: 1rem;
    width: clamp(250px, 95%, 90rem);
  }
</style>
