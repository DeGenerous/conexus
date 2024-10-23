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
    <h1 class="title">
      {topic.name.charAt(0).toUpperCase() + topic.name.slice(1)}
    </h1>

    <div class="story-info blur">
      <!-- <img class="picture" src={topic.descriptionPicture} alt={topic?.name} draggable="false" /> -->
      <img
        class="picture"
        src={tempImage}
        alt={topic?.name}
        draggable="false"
        width="1024"
        height="1024"
      />
          
      <p class="description">{topic.description}</p>
      <!-- <p class="description">{longTempDescription}</p> -->
    </div>

    {#if topic.genres !== ''}
      <p class="description">
        Genres: {topic.genres}
      </p>
    {/if}

    <div class="buttons-container">
      <button
        class="blur"
        on:click={() => window.history.back()}
      >
        QUIT
      </button>
      <button
        class="blur"
        on:click={() => CoNexus.start(topic.name)}
      >
        PLAY NOW
      </button>
    </div>
  {:else}
    <p class="error-message">Something went wrong...</p>
  {/if}
{:else}
  <BackgroundMusic />
  <Tts />

  <Step />
{/if}

<style>
  .title {
    font-size: 5vw;
    line-height: 5vw;
    text-align: center;
    margin: 3vw auto;
    color: rgba(51, 226, 230, 0.85);
    -webkit-text-stroke: 0.03vw #33e2e6;
    filter: drop-shadow(0 0 1vw rgba(51, 226, 230, 0.5));
  }

  .story-info {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 2vw;
    padding: 2vw;
    margin-inline: 5vw;
    background-color: rgba(1, 0, 32, 0.5);
    border: 0.05vw solid rgba(51, 226, 230, 0.5);
    border-radius: 2.5vw;
  }

  .picture {
    width: 30vw;
    filter: drop-shadow(0 0 0.5vw rgba(51, 226, 230, 0.25));
    border-radius: 1.5vw;
  }

  .description {
    text-align: center;
    font-size: 1.5vw;
    line-height: 3vw;
    text-shadow: 0 0 0.5vw rgb(1, 0, 32);
    margin-block: 2vw;
  }

  .buttons-container {
    width: 85vw;
    margin: 2vw auto;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
  }

  button {
    width: 25vw;
    padding: 1vw 2vw;
    font-size: 2vw;
    color: rgba(51, 226, 230, 0.75);
    background-color: rgba(51, 226, 230, 0.1);
    border: 0.05vw solid rgba(51, 226, 230, 0.5);
    border-radius: 1.5vw;
    transition: all 0.15s ease-out;
  }

  button:hover,
  button:active {
    text-shadow: 0 0 1vw rgba(1, 0, 32, 0.75);
    background-color: rgba(51, 226, 230, 0.3);
    color: rgb(51, 226, 230);
    border: 0.05vw solid rgb(51, 226, 230);
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
    :global(html) {
      padding-top: 0;
    }

    .title {
      font-size: 2em;
      line-height: 3em;
      margin: 0.25em auto;
    }

    .story-info {
      flex-direction: column;
      margin: 0;
      padding-block: 1.5em;
      gap: 1.5em;
      border-radius: 0;
      border-left: none;
      border-right: none;
    }

    .picture {
      width: 90vw;
      filter: drop-shadow(0 0 0.5em rgba(51, 226, 230, 0.25));
    }

    .description {
      font-size: 1em;
      line-height: 2em;
      width: 90vw;
    }

    .buttons-container {
      width: 100vw;
      flex-direction: column-reverse;
      align-items: center;
      gap: 1.5em;
      margin-top: 1.5em;
    }

    button {
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
