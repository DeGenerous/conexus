<script lang="ts">
  import BackgroundMusic from '@components/music/BackgroundMusic.svelte';
  import Tts from '@components/music/Tts.svelte';
  import Step from '@components/Step.svelte';
  import { CoNexus } from '@lib/conexus';
  import type { DynTopic } from '@lib/conexus';
  import { story } from '@stores/conexus';

  export let topic: DynTopic | null;

  const tempDescription: string =
    'Play as a prisoner going through experiments in a guarded prison and try to escape the planet by defeating or fleeing from The Warden.';
  const longTempDescription: string = `In the heart of the vast azure ocean lies the Enchanted Private Island, a hidden paradise ruled by the majestic Lazy Lions, who possess wisdom and regal grace. This utopia, with its lush landscapes and ancient secrets, faces a dire threat from Glitch, a former lion of the pride who seeks to conquer the island. As Glitch gathers his ruthless generals, the peaceful Lazy Lions must defend their home, not with violence, but by uncovering the island's forgotten mysteries. Embarking on a journey of bravery and discovery, they strive to protect the island's soul and preserve the harmony that defines their enchanted sanctuary.`;
  const tempImage: string = '/descriptionPicture/DischordianSaga/Escape.avif';
  const squareTempImage: string = '/descriptionPicture/Collabs/GLMRApes.avif';
</script>

{#if $story === null}
  {#if topic !== null}
    <section class="story-container">
      <!-- <img class="picture" src={topic.descriptionPicture} alt={topic?.name} draggable="false" /> -->
      <img
        class="picture"
        src={tempImage}
        alt={topic?.name}
        draggable="false"
        width="1024"
        height="1024"
      />

      <div class="story-info">
        <h1 class="title">
          {topic.name.charAt(0).toUpperCase() + topic.name.slice(1)}
        </h1>

        <!-- <p class="story-description">{topic.description}</p> -->
        <p class="description">{tempDescription}</p>

        <button
          class="play-button blur"
          on:click={() => CoNexus.start(topic.name)}
        >
          PLAY NOW
        </button>
      </div>
    </section>
  {:else}
    <p class="error-message">Something went wrong...</p>
  {/if}
{:else}
  <BackgroundMusic />
  <Tts />

  <Step />
{/if}

<style>
  .story-container {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    max-width: 75vw;
    margin-inline: auto;
  }

  .picture {
    width: 30vw;
    filter: drop-shadow(0 0 0.5vw rgba(51, 226, 230, 0.25));
    border-radius: 2vw;
  }

  .story-info {
    min-height: 30vw;
    padding-left: 2vw;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    text-align: center;
    font-size: 3vw;
    line-height: 3vw;
    color: rgba(51, 226, 230, 0.75);
    text-shadow: 0 0 0.25vw rgba(51, 226, 230, 0.5);
  }

  .description {
    text-align: center;
    font-size: 1.5vw;
    line-height: 2.5vw;
    text-shadow: 0 0 0.5vw rgb(1, 0, 32);
    color: rgba(255, 255, 255, 0.75);
    margin-block: 2vw;
  }

  .play-button {
    width: 20vw;
    padding: 1vw 2vw;
    font-size: 2vw;
    color: rgba(51, 226, 230, 0.75);
    background-color: rgba(51, 226, 230, 0.1);
    border: 0.05vw solid rgba(51, 226, 230, 0.75);
    border-radius: 1.5vw;
    transition: all 0.15s ease-out;
  }

  .play-button:hover,
  .play-button:active {
    text-shadow: 0 0 1vw rgba(1, 0, 32, 0.75);
    background-color: rgba(51, 226, 230, 0.3);
    transform: matrix(1.05, 0, 0, 1.05, 0, 0);
    filter: drop-shadow(0 0 1vw rgba(51, 226, 230, 0.5));
  }

  .error-message {
    text-align: center;
    font-size: 2vw;
    line-height: 2vw;
    color: rgba(51, 226, 230, 0.5);
    padding-block: 2vw;
  }

  @media only screen and (max-width: 600px) {
    .story-container {
      flex-direction: column;
      width: 100vw;
    }

    .picture {
      width: 80vw;
    }

    .story-info {
      min-height: auto;
    }

    .title {
      position: fixed;
      top: 0;
      font-size: 2em;
      line-height: 2.5em;
    }

    .description {
      font-size: 1em;
      line-height: 1.6em;
      width: 95vw;
      margin-block: 1em;
    }

    .play-button {
      width: 80vw;
      font-size: 1.5em;
      line-height: 1.5em;
      padding: 0.25em 0.5em;
    }

    .error-message {
      font-size: 1em;
      line-height: 1em;
    }
  }
</style>
