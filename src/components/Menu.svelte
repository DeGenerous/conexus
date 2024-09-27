<script lang="ts">
  import { writable } from "svelte/store";

  import Intro from "./Intro.svelte";
  import Modal from "./Modal.svelte";
  import BackgroundMusic from "./music/BackgroundMusic.svelte";
  import Tts from "./music/Tts.svelte";
  import Step from "./Step.svelte";
  import { CoNexus } from "../lib/conexus";
  import { story, loading } from "../stores/conexus";
  import { authenticated, web3LoggedIn } from "../stores/account";

  let isLogged: boolean;

  authenticated.subscribe((value) => {
    isLogged = value.loggedIn;
  });

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
</script>

<!-- Logged In -->

{#if isLogged}
  <BackgroundMusic />
  <Tts />

  {#if $story === null}
    <!-- We3b3 -->

    {#if $web3LoggedIn}
      {#await CoNexus.available()}
        <p class="continue-shaping-label">Loading unfinished stories...</p>
      {:then available}
        <section class="unfinished-stories">
          <p class="continue-shaping-label">Continue shaping:</p>
          <form class="continue-shaping-container">
            {#each available.continuable as continuable}
              <div>
                <button
                  class="continue-shaping-delete"
                  on:click|preventDefault={() => openModal(continuable)}
                  disabled={$loading}
                />
                <div id="continue-shaping">
                  <p>
                    {continuable.category} - {continuable.story_id.split(
                      "-"
                    )[0]}
                  </p>
                </div>
                <button
                  class="continue-shaping-play"
                  on:click|preventDefault={() => CoNexus.continue(continuable)}
                  disabled={$loading}
                />
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
      {/await}
    {/if}

    <!-- Intro -->
    <Intro />
  {:else}
    <!-- Story -->

    <Step />
  {/if}
{:else}
  <!-- Intro -->

  <Intro />
{/if}

<style>
  hr {
    margin: 2vw 0;
    border: 0.1vw solid rgba(51, 226, 230, 0.5);
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
    background-image: url("/icons/delete.png");
    margin-left: 1vw;
  }

  .continue-shaping-play {
    background-image: url("/icons/play.png");
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
