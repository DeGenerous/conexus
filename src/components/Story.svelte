<script lang="ts">
  import { writable } from 'svelte/store';

  import BackgroundMusic from '@components/music/BackgroundMusic.svelte';
  import Tts from '@components/music/Tts.svelte';
  import Step from '@components/Step.svelte';
  import { CoNexus } from '@lib/conexus';
  import type { DynTopic, ContinuableStory } from '@lib/conexus';
  import { loading, story } from '@stores/conexus';

  import Modal from './Modal.svelte';

  export let topic: DynTopic | null;
  export let continuables: ContinuableStory[] = [];

  let showDeleteModal = writable<boolean>(false);
  let selectedStory: any;

  function openModal(story: any) {
    selectedStory = story;
    showDeleteModal.set(true);
  }

  function DeleteStory(story_id: any) {
    CoNexus.delete(story_id);
    showDeleteModal.set(false);
  }

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
      <button class="blur" on:click={() => window.history.back()}>
        QUIT
      </button>
      <button class="blur" on:click={() => CoNexus.start(topic.name)}>
        PLAY NOW
      </button>
    </div>

    <section class="unfinished-stories">
      <p class="continue-shaping-label">Continue shaping:</p>
      <form class="continue-shaping-container">
        {#each continuables as continuable}
          <div>
            <button
              aria-label="Delete story"
              class="continue-shaping-delete"
              on:click|preventDefault={() => openModal(continuable)}
              disabled={$loading}
            ></button>
            <div id="continue-shaping">
              <p>
                {continuable.category} - {continuable.story_id.split('-')[0]}
              </p>
            </div>
            <button
              aria-label="Continue shaping"
              class="continue-shaping-play"
              on:click|preventDefault={() => CoNexus.continue(continuable)}
              disabled={$loading}
            ></button>
          </div>
        {/each}
      </form>
    </section>

    <!-- Delete Story Modal -->

    {#if selectedStory}
    <Modal bind:showModal={$showDeleteModal}>
      <h2 class="modal-text">
        Are you sure you want to delete this story?
      </h2>
      <hr />
      <p class="modal-text">
        This action is irreversible. You will lose all progress on this
        story.
      </p>
      <button
        class="modal-delete"
        on:click={() => DeleteStory(selectedStory.story_id)}
        >Delete story: {selectedStory.category}</button
      >
    </Modal>
  {/if}
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

  .continue-shaping-delete,
  .continue-shaping-play {
    padding: 0;
    margin: 0;
    border: none;
    border-radius: 0;
    background-color: rgba(0, 0, 0, 0);
    opacity: 0.75;
  }

  .continue-shaping-delete:hover,
  .continue-shaping-delete:active,
  .continue-shaping-play:hover,
  .continue-shaping-play:active {
    filter: none;
    background-color: rgba(0, 0, 0, 0);
    color: rgba(0, 0, 0, 0);
    opacity: 1;
  }

  .continue-shaping-label {
    color: rgba(51, 226, 230, 0.75);
    font-size: 2vw;
    text-align: center;
    padding: 2vw 0;
  }

  .continue-shaping-container {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    gap: 2vw;
  }

  .continue-shaping-container > div {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    background-color: rgba(22, 30, 95, 0.75);
    border: 0.05vw solid rgba(51, 226, 230, 0.75);
    border-radius: 1.5vw;
    color: rgba(51, 226, 230, 0.75);
    padding: 1vw 0;
  }

  #continue-shaping {
    text-align: center;
    padding: 1vw 1vw;
    font-size: 2vw;
    line-height: 3vw;
    outline: none;
    border-radius: 2vw;
    cursor: pointer;
    width: 25vw;
  }

  #continue-shaping p {
    text-align: center;
    cursor: pointer;
    font-size: 1em;
    line-height: 1.5em;
  }

  .continue-shaping-delete,
  .continue-shaping-play {
    width: 5vw;
    height: 5vw;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .continue-shaping-delete {
    background-image: url('/icons/delete.png');
    margin-left: 1vw;
  }

  .continue-shaping-play {
    background-image: url('/icons/play.png');
    margin-right: 1vw;
  }

  .modal-text {
    font-size: 2vw;
    line-height: 4vw;
    text-align: center;
    padding: 1vw 0;
  }

  .modal-delete {
    width: 70%;
    margin-inline: 15%;
    margin-block: 2vw 1vw;
    padding: 1vw 2vw;
    border: 0.05vw solid rgba(51, 226, 230, 0.75);
    border-radius: 2vw;
    font-size: 2.5vw;
    line-height: 5vw;
    color: rgba(51, 226, 230, 0.75);
    background-color: rgba(51, 226, 230, 0.1);
    filter: drop-shadow(0 0 0.1vw rgba(51, 226, 230, 0.4));
  }

  .modal-delete:hover,
  .modal-delete:active {
    color: rgba(51, 226, 230, 1);
    background-color: rgba(51, 226, 230, 0.5);
    filter: drop-shadow(0 0 1vw rgba(51, 226, 230, 0.4));
  }

  @media only screen and (max-width: 600px) {
    .continue-shaping-label {
      font-size: 1em;
    }

    .continue-shaping-container > div {
      margin-top: 0.5em;
    }

    #continue-shaping {
      font-size: 1.1em;
      line-height: 1.1em;
      padding: 0.5em 1em;
      margin: 0 0.5em;
    }

    .continue-shaping-delete,
    .continue-shaping-play {
      width: 3em;
      height: 3em;
    }

    .continue-shaping-delete {
      margin-left: 1em;
    }

    .continue-shaping-play {
      margin-right: 1em;
    }

    .modal-text {
      font-size: 1em;
      line-height: 1.5em;
      padding: 0.5em;
    }

    .modal-delete {
      font-size: 1.2em;
      line-height: 2em;
      margin-block: 1em 0;
    }
  }
</style>
