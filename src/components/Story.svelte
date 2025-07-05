<!-- LEGACY SVELTE 3/4 SYNTAX -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { tippy } from 'svelte-tippy';

  import { serveUrl } from '@constants/media';
  import { contractGetter } from '@constants/contracts';
  import MediaManager from '@lib/media';
  import CoNexusGame from '@lib/story';
  import { story, game } from '@stores/conexus.svelte';
  import { prevStory, nextStory } from '@stores/navigation.svelte';
  import { GetCache, SECTION_CATEGORIES_KEY } from '@constants/cache';
  import detectIOS from '@utils/ios-device';
  import openModal, { showProfile } from '@stores/modal.svelte';
  import { deleteUnfinishedModal, referralWarning } from '@constants/modal';
  import { userState } from '@utils/route-guard';

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
  export let story_name: string;

  let scroll: number;
  let isLogged: boolean = false;
  let isReferred: boolean = false;

  const conexusGame: CoNexusGame = new CoNexusGame();
  const media: MediaManager = new MediaManager();

  const handleSetMedia = async (topic_id: number) => {
    await media.setBackgroundImage(topic_id);
    await media.playBackgroundMusic(topic_id);
  };

  let activeTopic: Nullable<TopicThumbnail> = null;

  const restartGame = () => {
    game.background_image = null;
    game.background_music = null;
    $story = null;
    setTimeout(() => {
      activeTopic &&
        conexusGame.startGame(
          activeTopic.name,
          activeTopic.id,
          handleSetMedia,
        );
    })
  }

  // Switching between NEIGHBOUR stories
  let categoryTopics: TopicInSection[] = [];
  let activeStoryIndex: number = 0;
  $: prevStoryIndex =
    activeStoryIndex <= 0 ? categoryTopics.length - 1 : activeStoryIndex - 1;

  onMount(async () => {
    isLogged = await userState();
    isReferred = await userState('referred');
    // Get all topics in SECTION from the localStorage
    const storedTopics = GetCache<CategoryInSection[]>(
      SECTION_CATEGORIES_KEY(section),
    )
      ?.map((category: CategoryInSection) => category.topics)
      .flat();
    if (storedTopics) {
      categoryTopics = storedTopics;
      // Get array of STORY NAMES to display on button
      const categoryTopicNames: string[] = categoryTopics!.map(
        (story) => story.topic_name,
      );
      // Find index of selected story to get PREV & NEXT story index
      activeStoryIndex = categoryTopicNames?.indexOf(story_name);

      if (!categoryTopics.length) return;
      // Update index value during mount
      prevStoryIndex =
        activeStoryIndex <= 0
          ? categoryTopics.length - 1
          : activeStoryIndex - 1;
      // Set up routes for switching between stories
      prevStory.link = `/sections/${section}/${categoryTopics[prevStoryIndex].topic_name}?id=${
        categoryTopics[prevStoryIndex].topic_id
      }`;
      prevStory.name = categoryTopics[prevStoryIndex].topic_name;
      nextStory.link = `/sections/${section}/${
        categoryTopics[(activeStoryIndex + 1) % categoryTopics.length]
          .topic_name
      }?id=${categoryTopics[(activeStoryIndex + 1) % categoryTopics.length].topic_id}`;
      nextStory.name =
        categoryTopics[
          (activeStoryIndex + 1) % categoryTopics.length
        ].topic_name;
    }
  });

  // CONTINUE SHAPING section

  let deletedStories: string[] = []; // temp storage before reload for immediate removal
  let noUnfinishedStoriesLeft: boolean = false;

  async function DeleteStory(story_id: any) {
    try {
      await conexusGame.delete(story_id);
      deletedStories[deletedStories.length] = story_id; // hide deleted story from user
      await conexusGame.storyContinuables(story_name!).then((continuables) => {
        // Hide CINTINUE SHAPING section if no unfinished stories left
        if (continuables.length == 0) noUnfinishedStoriesLeft = true;
      });
    } catch (error) {
      console.error('Failed to delete story: ' + error);
    }
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
  {#await conexusGame.getTopic(section, story_name)}
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
  {:then topic: TopicThumbnail}
    <div
      class="story-wrapper flex"
      style:cursor={game.loading ? 'progress' : ''}
    >
      <section class="story container">
        {#if topic?.video_file_id}
          <video
            class="round-8 transparent-glowing"
            controls
            autoplay
            loop
            muted
          >
            <source src={serveUrl(topic?.video_file_id)} type="video/mp4" />
            <track kind="captions" />
          </video>
        {:else}
          <img
            class="round-8 transparent-glowing"
            src={serveUrl(topic?.description_file_id)}
            alt={topic?.name}
            draggable="false"
            width="1024"
          />
        {/if}
        <div class="flex">
          {#if topic.genres}
            <span class="genres round-8 pad-8 shad transparent-glowing">
              <p class="text-glowing">{topic.genres.toUpperCase()}</p>
            </span>
          {/if}

          <span class="buttons flex-row flex-wrap">
            {#if game.loading}
              <span class="flex-row gap-8">
                <LoadingSVG />
                <button disabled>LOADING</button>
              </span>
            {:else}
              {#if !isLogged}
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
                      conexusGame.startGame(
                        topic.name,
                        topic.id,
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

      {#if isLogged}
        {#await conexusGame.storyContinuables(story_name!) then continuables: ContinuableStory[]}
          {#if continuables.length > 0 && !noUnfinishedStoriesLeft}
            <section
              class="unfinished-stories transparent-container vert-scrollbar"
            >
              <h5 class="text-glowing">
                Continue Shaping: {continuables.length - deletedStories.length}
              </h5>
              {#each continuables as continuable}
                {#if !deletedStories.includes(continuable.story_id)}
                  <div class="small-tile" role="button" tabindex="0">
                    <DeleteSVG
                      disabled={game.loading}
                      onclick={() =>
                        openModal(
                          deleteUnfinishedModal,
                          `Delete story: ${continuable.category}`,
                          () => DeleteStory(continuable.story_id),
                        )}
                    />
                    <span class="flex">
                      <p>{convertDate(continuable.created!)}</p>
                      <p class="story-id">
                        {continuable.story_id.split('-')[0]}
                      </p>
                    </span>
                    <PlaySVG
                      disabled={game.loading}
                      onclick={() => {
                        activeTopic = topic;
                        conexusGame.continueGame(continuable, handleSetMedia);
                      }}
                    />
                  </div>
                {/if}
              {/each}
            </section>
          {/if}
        {:catch}
          <section class="unfinished-stories transparent-container">
            <p class="validation">Failed to fetch unfinished stories...</p>
          </section>
        {/await}
      {/if}
    </div>

    {#if topic.nft_gate && topic.nft_gate.length > 0}
      <section
        class="flex gating blur pad-8 gap-8 mar-auto round-12 shad wavy-mask-left-right"
      >
        <div class="flex-row">
          <LockSVG />
          <h5>Only available to holders of:</h5>
        </div>
        <span class="flex-row pad-8 pad-inline round-8">
          {#each topic.nft_gate as { contract_name, class_name, amount }}
            {#if contractGetter(contract_name)}
              {#await Promise.resolve(contractGetter(contract_name)) then contract}
                <a
                  href={contract.link ||
                    'https://degenerousdao.gitbook.io/wiki'}
                  class:inactive-link={!contract.link}
                  target="_blank"
                  on:click={(event) => {
                    if (contract.link) return;
                    if (
                      !confirm(
                        'This collection is no longer available. Would you like to explore the wiki for more details?',
                      )
                    )
                      event.preventDefault();
                  }}
                  use:tippy={{ content: 'Check details', animation: 'scale' }}
                >
                  {#if amount && amount > 0}
                    {amount} ${contract.name.toUpperCase()}
                  {:else if class_name}
                    {contract.name} ({class_name})
                  {:else}
                    {contract.name}
                  {/if}
                </a>
              {/await}
            {/if}
          {/each}
        </span>
      </section>
    {/if}

    <p class="description transparent-container white-txt text-shad">
      {topic.description}
    </p>
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

  <Step {story_name} {restartGame} />
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
