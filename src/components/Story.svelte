<script lang="ts">
  import { onMount } from 'svelte';

  import BackgroundMusic from '@components/music/BackgroundMusic.svelte';
  import Tts from '@components/music/Tts.svelte';
  import Step from '@components/Step.svelte';
  import { CoNexus } from '@lib/conexus';
  import type { DynTopic, ContinuableStory } from '@lib/conexus';
  import { loading, story } from '@stores/conexus';
  import { checkUserState } from '@utils/route-guard';

  import {
    showModal,
    secondButton,
    handleSecondButton,
    modalContent,
  } from '@stores/modal';
  import Share from './Share.svelte';
  import Profile from './Profile.svelte';

  export let story_name: string;

  onMount(async () => {
    await checkUserState('/story');
  });

  let topic: DynTopic | null = null;
  let continuables: ContinuableStory[] = [];

  // Fetch the topic
  async function fetchTopic() {
    try {
      topic = await CoNexus.getTopic(story_name!);
    } catch (error) {
      console.error('Failed to fetch topic:', error);
      topic = null;
    }
  }

  // Fetch continuable stories
  async function fetchContinuables() {
    try {
      continuables = await CoNexus.storyContinuable(story_name!);
    } catch (error) {
      console.error('Failed to fetch continuables:', error);
      continuables = [];
    }
  }

  onMount(async () => {
    await fetchTopic();
    await fetchContinuables();
  });

  let selectedStory: any;

  function openModal(story: any) {
    $secondButton = `Delete story: ${
      selectedStory?.category.charAt(0).toUpperCase() +
      selectedStory?.category.slice(1)
    }`;
    $handleSecondButton = () => DeleteStory(selectedStory.story_id);
    $modalContent = `<h2>Are you sure you want to delete this story?</h2>
      <h3>This action is irreversible. You will lose all progress on this story.</h3>`;
    selectedStory = story;
    $showModal = true;
  }

  async function DeleteStory(story_id: any) {
    await CoNexus.delete(story_id);
    await fetchContinuableStories();
    $showModal = false;
  }

  async function fetchContinuableStories() {
    continuables = await CoNexus.storyContinuable(story_name!);
  }

  let storyImage: string | null = null;
  onMount(async () => {
    storyImage = await CoNexus.fetch_story_image(story_name!, 'description');
  });

  const blankPicture: string = '/blank.avif'; // temp
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
{#if $story === null}
  {#if topic !== null}
    <header>
      <a
        class="arrow"
        aria-label="Back arrow"
        href="./"
      ></a>
      <h1>{(topic.name.charAt(0).toUpperCase() + topic.name.slice(1)).trim()}</h1>
      <Profile />
    </header>

    <div class="story-container blur">
      <img
        class="picture"
        src={storyImage ?? blankPicture}
        alt={topic?.name}
        draggable="false"
        width="1024"
        height="1024"
      />

      <section class="story-info">
        <article>
          {#if topic.genres !== ''}
            <div class="genres">
              <p>Genres:</p>
              <p class="genres-list">{topic.genres}</p>
            </div>
          {/if}

          <p class="description">{topic.description}</p>
        </article>
        <div class="buttons-container">
          <Share />
          <button on:click={() => topic && CoNexus.start(topic.name)} disabled={$loading}>
            {#if $loading}
              <img
                class="searching"
                src="/icons/searching.png"
                alt="Searching..."
              />
              Loading...
            {:else}
              PLAY NOW
            {/if}
          </button>
        </div>
      </section>
    </div>

    {#if continuables.length > 0}
      <section class="unfinished-stories blur">
        <h3>Continue Shaping:</h3>
        <div class="continue-shaping-container">
          {#each continuables as continuable}
            <div class="unfinished-story">
              <button
                aria-label="Delete story"
                class="continue-shaping-btn delete-button"
                on:click|preventDefault={() => openModal(continuable)}
                disabled={$loading}
              ></button>
              <h3>
                {continuable.story_id.split('-')[0]} - {new Date(
                  continuable.created ?? '',
                ).toLocaleDateString()}
              </h3>
              <button
                aria-label="Continue shaping"
                class="continue-shaping-btn continue-button"
                on:click|preventDefault={() => CoNexus.continue(continuable)}
                disabled={$loading}
              ></button>
            </div>
          {/each}
        </div>
      </section>
    {/if}

  {:else}
    <header>
      <a
        class="arrow"
        aria-label="Back arrow"
        href="./"
      ></a>
      <h1>...</h1>
      <Profile />
    </header>
  {/if}
{:else}
  <BackgroundMusic />
  <Tts />

  <Step />
{/if}

<style>
  header {
    width: 100vw;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 2vw;
  }

  h1 {
    font-size: 5vw;
    line-height: 5vw;
    text-align: center;
    color: rgba(51, 226, 230, 0.85);
    text-shadow: 0 0.5vw 0.5vw #010020;
  }

  .arrow {
    height: 7vw;
    width: 7vw;
    z-index: 1;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    flex: none;
    background-image: url('/icons/backArrow.avif');
    opacity: 0.4;
    cursor: pointer;
  }

  .arrow:hover,
  .arrow:active {
    filter: drop-shadow(0 0 0.5vw rgba(51, 226, 230, 0.5));
    opacity: 0.75;
  }

  .story-container {
    max-width: 95%;
    min-width: 75%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    gap: 2vw;
    padding: 2vw;
    background-color: rgba(1, 0, 32, 0.5);
    box-shadow:
      inset 0 0 0.5vw rgba(51, 226, 230, 0.25),
      0 0 0.5vw #010020;
    border-radius: 1.5vw;
  }

  .story-info {
    min-height: 25vw;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    gap: 2vw;
  }

  .picture {
    width: 25vw;
    filter: drop-shadow(0 0.5vw rgba(51, 226, 230, 0.5));
    border-radius: 1vw;
  }

  article {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: flex-start;
    gap: 2vw;
  }

  .genres {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 1vw;
    font-size: 1.5vw;
    line-height: 2vw;
    color: rgba(51, 226, 230, 0.75);
  }

  .genres-list {
    text-align: center;
    padding: 1vw;
    border-radius: 1vw;
    color: rgba(51, 226, 230, 0.75);
    font-size: 1.5vw;
    line-height: 2vw;
    box-shadow: inset 0 0 0.5vw rgba(51, 226, 230, 0.25);
    background-color: rgba(51, 226, 230, 0.1);
  }

  .description {
    font-size: 1.5vw;
    line-height: 3vw;
    text-shadow: 0 0.25vw 0.25vw #010020;
  }

  .buttons-container {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 2vw;
  }

  .unfinished-stories {
    max-width: 95%;
    background-color: rgba(51, 226, 230, 0.1);
    box-shadow:
      inset 0 0 0.5vw rgba(51, 226, 230, 0.25),
      0 0 0.5vw #010020;
    border-radius: 1.5vw;
    padding: 1vw;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    gap: 1vw;
  }

  .continue-shaping-container {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    gap: 1vw;
  }

  .unfinished-story {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: 1vw;
    color: rgba(255, 255, 255, 0.5);
    background-color: rgba(36, 65, 189, 0.75);
    border: 0.05vw solid rgba(51, 226, 230, 0.5);
    box-shadow: 0 0 0.5vw #010020;
    border-radius: 1.5vw;
    padding: 0.5vw;
  }

  h3 {
    color: inherit;
  }

  .unfinished-story:hover,
  .unfinished-story:active {
    background-color: rgba(45, 90, 216, 0.9);
    color: rgba(51, 226, 230, 0.9);
    box-shadow: 0 0.5vw 0.5vw #010020;
    transform: scale(1.025) translateY(-0.25vw);
  }

  .continue-shaping-btn {
    padding: 0;
    margin: 0;
    border: none;
    border-radius: 0;
    background-color: rgba(0, 0, 0, 0);
    opacity: 0.9;
    width: 3vw;
    height: 3vw;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .continue-shaping-btn:hover,
  .continue-shaping-btn:active {
    background-color: rgba(0, 0, 0, 0);
    color: rgba(0, 0, 0, 0);
    opacity: 1;
  }

  .delete-button {
    background-image: url('/icons/delete.png');
  }

  .continue-button {
    background-image: url('/icons/play.png');
  }

  .buttons-container button {
    gap: 1vw;
  }

  .searching {
    height: 1.5vw;
    animation: searching 1s linear infinite;
  }

  @keyframes searching {
    from {
      transform: none;
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media only screen and (max-width: 600px) {
    :global(html) {
      padding-top: 0;
    }

    .buttons-container button {
      gap: 0.5em;
    }

    .searching {
      height: 1em;
    }

    header {
      position: fixed;
      top: 0;
      background-color: rgba(1, 0, 32, 0.75);
      box-shadow: 0 0.5vw 0.5vw #010020;
      -webkit-backdrop-filter: blur(2vw);
      backdrop-filter: blur(2vw);
      z-index: 2;
    }

    h1 {
      font-size: 1.5em;
    }

    .arrow {
      width: 3em;
      height: 3em;
    }

    .story-container {
      margin-top: 25%;
      max-width: 100%;
      flex-direction: column;
      gap: 1.5em;
      padding-top: 1.5em;
      border-radius: 0;
      border-left: none;
      border-right: none;
    }

    .picture {
      width: 90vw;
      border-radius: 0.5em;
    }

    article {
      flex-direction: column-reverse;
      min-height: none;
      align-items: center;
    }

    .genres {
      flex-direction: column;
      gap: 0.25em;
      font-size: 1.2em;
      line-height: 2em;
      width: 90vw;
    }

    .genres-list {
      padding: 0.5em;
      font-size: 1em;
      line-height: 1.5em;
      text-shadow: 0 0 0.1em #010020;
      border-radius: 0.5em;
    }

    .description {
      text-align: center;
      font-size: 1em;
      line-height: 2em;
      width: 90vw;
    }

    .buttons-container {
      width: 100vw;
      flex-direction: column-reverse;
      align-items: center;
      gap: 1.5em;
      margin-block: 1.5em;
    }

    button {
      width: 80vw;
      font-size: 1.5em;
      line-height: 1.5em;
      padding: 0.25em 0.5em;
    }

    .unfinished-stories {
      max-width: 100%;
      border-radius: 0;
      border-left: none;
      border-right: none;
      padding: 1em;
      gap: 1em;
    }

    .continue-shaping-container {
      gap: 1em;
    }

    .unfinished-story {
      gap: 1em;
      padding: 0.25em;
      width: 90vw;
      justify-content: space-between;
      border-radius: 1em;
    }

    .continue-shaping-btn {
      width: 2em;
      height: 2em;
    }
  }
</style>
