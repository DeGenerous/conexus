<script lang="ts">
  import Step from '@components/Step.svelte';
  import { CoNexus } from '@lib/conexus';
  import type { DynStory } from '@lib/conexus';
  import { fullscreen, story, background_image } from '@stores/conexus';

  export let topic: DynStory;

  let isPrimary: boolean = true;
  function tileHover() {
    isPrimary = !isPrimary;
  }
</script>

{#if $story === null}
  <div class="story-container">
    <!-- name -->
    <h1 class="story-title">{topic.name}</h1>
    <!-- description -->
    <p class="story-description">{topic.description}</p>

    <!-- Start button -->

    <!-- image -->
    <!-- <img
  class="story-picture {isPrimary ? 'visible' : ''}"
  src={story.images[0].src ?? ''}
  alt={story.images[0].alt ?? ''}
  draggable="false"
  /> -->
    <button
      class="start-button"
      on:click={() => CoNexus.start(topic.name)}
    >
      Start
    </button>
  </div>
{:else}
  <Step />
{/if}

<style>
  .story-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 28vw;
    height: 32vw;
    margin: 1vw;
    padding-bottom: 3%;
    background-color: rgba(22, 30, 95, 0.75);
    color: rgba(51, 226, 230, 0.75);
    border: 0.05vw solid rgba(51, 226, 230, 0.75);
    border-radius: 1.5vw;
    filter: drop-shadow(0 0 0.1vw #010020);
    cursor: pointer;
    text-decoration: none;
  }

  .story-title {
    text-align: center;
    font-size: 2vw;
    line-height: 2.5vw;
    color: rgba(255, 255, 255, 0.75);
  }

  .story-description {
    text-align: center;
    font-size: 1.5vw;
    line-height: 2vw;
    color: rgba(255, 255, 255, 0.75);
  }

  .start-button {
    width: 20vw;
    padding: 1vw 2vw;
    margin-top: 1vw;
    color: rgba(51, 226, 230, 0.75);
    background-color: rgba(51, 226, 230, 0.1);
    border: 0.05vw solid rgba(51, 226, 230, 0.75);
    border-radius: 1.5vw;
    cursor: pointer;
  }

  .start-button:hover {
    background-color: rgba(51, 226, 230, 0.3);
  }

  /* .story-picture {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 1.5vw;
  }

  .visible {
    display: block;
  }

  .invisible {
    display: none;
  }

  .story:hover,
  .story:active {
    background-color: rgba(51, 226, 230, 0.3);
  } */
</style>
