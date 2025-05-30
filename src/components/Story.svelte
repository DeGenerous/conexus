<script lang="ts">
  import { onMount } from 'svelte';

  import BackgroundMusic from '@components/music/BackgroundMusic.svelte';
  import Tts from '@components/music/Tts.svelte';
  import Step from '@components/Step.svelte';
  import DeleteSVG from '@components/icons/Delete.svelte';
  import PlaySVG from '@components/icons/Play.svelte';
  import LoadingSVG from '@components/icons/Loading.svelte';
  import LockSVG from '@components/icons/Lock.svelte';
  import Share from '@components/utils/Share.svelte';
  import { serveUrl } from '@constants/media';
  import { contractGetter } from '@constants/contracts';
  import MediaManager from '@lib/media';
  import { CoNexusGame } from '@lib/story';
  import { loading, story, background_image } from '@stores/conexus';
  import {
    showModal,
    secondButton,
    secondButtonClass,
    handleSecondButton,
    modalContent,
  } from '@stores/modal';
  import {
    prevStoryLink,
    prevStoryName,
    nextStoryLink,
    nextStoryName,
  } from '@stores/navigation';
  import { checkUserState } from '@utils/route-guard';
  import { GetCache, SECTION_CATEGORIES_KEY } from '@constants/cache';
  import detectIOS from '@utils/ios-device';
  import { iosDevice } from '@stores/ios';

  export let section: string;
  export let story_name: string;

  let scroll: number;

  const game: CoNexusGame = new CoNexusGame();
  const media: MediaManager = new MediaManager();

  let categoryTopics: TopicsInSection[] = [];
  let activeStoryIndex: number = 0;
  $: prevStoryIndex =
    activeStoryIndex <= 0 ? categoryTopics.length - 1 : activeStoryIndex - 1;

  onMount(async () => {
    await checkUserState('/story');

    detectIOS();

    const storedTopics = JSON.parse(
      GetCache(SECTION_CATEGORIES_KEY(section)) as string,
    )
      .map((category: CategoryInSection) => category.topics)
      .flat();
    if (storedTopics) {
      categoryTopics = storedTopics;
      const categoryTopicNames: string[] = categoryTopics!.map(
        (story) => story.topic_name,
      );
      activeStoryIndex = categoryTopicNames?.indexOf(story_name);
    }
  });

  let deletedStories: string[] = []; // temp storage before reload for immediate removal
  let noUnfinishedStoriesLeft: boolean = false;
  let backgroundImageUrl: string = '/defaultBG.avif';

  const handleSetMedia = async (topic_id: number) => {
    await media.setBackgroundImage(topic_id);
    await media.playBackgroundMusic(topic_id);
  };

  background_image.subscribe((value) => {
    if (value) {
      backgroundImageUrl = value;
    }
  });

  function openModal(story: any) {
    $secondButton = `Delete story: ${story.category}`;
    $secondButtonClass = 'red-button';
    $handleSecondButton = () => DeleteStory(story.story_id);
    $modalContent = `<h4>Are you sure you want to delete this story?</h4>
        <p>This action is irreversible. You will lose all progress on this story.</p>`;
    $showModal = true;
  }

  async function DeleteStory(story_id: any) {
    try {
      await game.delete(story_id);
      deletedStories[deletedStories.length] = story_id;
      $showModal = false;
      await game.storyContinuables(story_name!).then((continuables) => {
        if (continuables.length == 0) noUnfinishedStoriesLeft = true;
      });
    } catch (error) {
      console.error('Failed to delete story: ' + error);
    }
  }

  const convertDate = (date) => {
    if (!date) return 'CORRUPTED';
    date = new Date(date);

    let minutes = date.getMinutes();
    let hours = date.getHours();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (minutes < 10) minutes = '0' + minutes;
    if (hours < 10) hours = '0' + hours;
    if (day < 10) day = '0' + day;
    if (month < 10) month = '0' + month;

    return `${day}.${month}.${String(year).slice(2)} ${hours}:${minutes}`;
  };
</script>

<svelte:window bind:scrollY={scroll} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
{#if $story === null}
  {#await game.getTopic(section, story_name)}
    <div class="story-wrapper flex">
      <section class="story container">
        <span class="fake-img loading-animation round-8"></span>

        <div class="flex">
          <span
            class="loading-animation default-genres genres round-8 pad-8 pad-inline shad"
          ></span>

          <span class="buttons flex-row">
            <Share disabled={true} />
            <button disabled>PLAY NOW</button>
          </span>
        </div>
      </section>
    </div>
  {:then topic: TopicThumbnail}
    {@html (() => {
      if (!categoryTopics.length) return;
      $prevStoryLink = `/sections/${section}/${categoryTopics[prevStoryIndex].topic_name}?id=${
        categoryTopics[prevStoryIndex].topic_id
      }`;
      $prevStoryName = categoryTopics[prevStoryIndex].topic_name;
      $nextStoryLink = `/sections/${section}/${
        categoryTopics[(activeStoryIndex + 1) % categoryTopics.length]
          .topic_name
      }?id=${categoryTopics[(activeStoryIndex + 1) % categoryTopics.length].topic_id}`;
      $nextStoryName =
        categoryTopics[(activeStoryIndex + 1) % categoryTopics.length]
          .topic_name;
    })()}

    <div class="story-wrapper flex" style:cursor={$loading ? 'progress' : ''}>
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

          <span class="buttons flex-row">
            {#if $loading}
              <span class="flex-row gap-8">
                <LoadingSVG />
                <h5 class="transparent-white-txt">Loading...</h5>
              </span>
            {:else}
              <Share />
              <button
                class="button-glowing"
                on:click={() =>
                  topic && game.startGame(topic.name, topic.id, handleSetMedia)}
              >
                PLAY NOW
              </button>
            {/if}
          </span>
        </div>
      </section>

      {#await game.storyContinuables(story_name!) then continuables: ContinuableStory[]}
        {#if continuables.length > 0 && !noUnfinishedStoriesLeft}
          <section
            class="unfinished-stories transparent-container vert-scrollbar"
          >
            <h5 class="text-glowing">
              Continue Shaping: {continuables.length - deletedStories.length}
            </h5>
            {#each continuables as continuable}
              {#if !deletedStories.includes(continuable.story_id)}
                <div class="flex-row pad-8 round" role="button" tabindex="0">
                  <DeleteSVG
                    disabled={$loading}
                    onClick={() => openModal(continuable)}
                  />
                  <span class="flex">
                    <p>{convertDate(continuable.created)}</p>
                    <p class="story-id">{continuable.story_id.split('-')[0]}</p>
                  </span>
                  <PlaySVG
                    disabled={$loading}
                    onClick={() =>
                      game.continueGame(continuable, handleSetMedia)}
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
    </div>

    {#if topic.nft_gate && topic.nft_gate.length > 0}
      <section class="flex gating blur pad-8 gap-8 mar-auto round-12 shad">
        <div class="flex-row">
          <LockSVG />
          <h5>Only available to holders of:</h5>
        </div>
        <span class="flex-row pad-8 pad-inline round-8">
          {#each topic.nft_gate as { contract_name, class_name, amount }}
            {#if contractGetter(contract_name)}
              {#await Promise.resolve(contractGetter(contract_name)) then contract}
                <a
                  href={contract.link || 'https://degenerousdao.gitbook.io/wiki'}
                  class:inactive-link={!contract.link}
                  target="_blank"
                  on:click={(event) => {
                    if (contract.link) return;
                    if (!confirm(
                      "This collection is no longer available. Would you like to explore the wiki for more details?"
                    )) event.preventDefault();
                  }}
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

    <p class="description pad mar-auto soft-white-txt text-shad">
      {topic.description}
    </p>
  {:catch}
    <div class="container">
      <h4 class="red-txt">Failed to fetch story...</h4>
      <p class="soft-white-txt">Please try again or contact support.</p>
    </div>
  {/await}
{:else}
  {#if !$iosDevice}
    <BackgroundMusic />
  {/if}
  <Tts />

  <Step {story_name} />
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .story-wrapper {
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

        .buttons {
          justify-content: space-between;
        }
      }

      @include respond-up(tablet) {
        div {
          width: auto;
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

            * {
              flex: none;
            }
          }
        }
      }

      @include respond-up(small-desktop) {
        max-width: 68rem;
        width: auto;
      }
    }

    .unfinished-stories {
      h5 {
        width: 100%;
        text-transform: uppercase;
        @include font(small);
      }

      div {
        width: 100%;
        justify-content: space-between;
        flex: none;
        @include white-txt(soft);
        @include cyan(0.2);
        @include box-shadow;

        &:hover,
        &:active {
          @include cyan(1, text);
          @include light-blue(0.5);
          @include scale-up(soft);
          @include box-shadow(deep);
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
    width: 90%;
    max-width: min(90%, 50rem);
    stroke: $dark-red;
    @include orange(0.85);

    h5 {
      @include dark-red(1, text);
    }

    span {
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
          @include orange(1, text, bright);
        }

        &.inactive-link {
          cursor: help;

          &:hover,
          &:active,
          &:focus {
            text-decoration: underline $red;
            @include red(1, text);
          }
        }
      }
    }

    @include respond-up(tablet) {
      flex-flow: row wrap;
      justify-content: space-between;
      width: auto;
    }
  }

  .description {
    width: clamp(250px, 95%, 90rem);
  }
</style>
