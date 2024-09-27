<script lang="ts">
  export let showModal: boolean;
  let dialog: HTMLDialogElement;

  $: if (dialog && showModal) dialog.showModal();

  export let storyDescription: string;
  export let descriptionPicture: string;
  export let playButton: string;
  export let storyLink: string;

  function openGame() {
    window.open(storyLink, "_blank");
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
  class="description-tile blur"
  bind:this={dialog}
  on:close={() => (showModal = false)}
  on:click|self={() => dialog.close()}
>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div on:click|stopPropagation>
    <img class="description-image" src={descriptionPicture} alt="Description" />

    <div>
      <p class="description-text">{storyDescription}</p>
      <!-- svelte-ignore a11y-autofocus -->
      <div class="buttons-container">
        <button
          class="close-button"
          on:click|stopPropagation={() => dialog.close()}>CLOSE</button
        >
        <button class="play-button" on:click={openGame}>{playButton}</button>
      </div>
    </div>
  </div>
</dialog>

<style>
  .description-tile {
    padding: 1.5vw;
    width: 80vw;
    height: 40vw;
    background-color: rgba(1, 0, 32, 0.75);
    border: 0.05vw solid rgba(51, 226, 230, 0.75);
    border-radius: 2.5vw;
  }

  .description-tile::backdrop {
    background: rgba(0, 0, 0, 0.75);
  }

  .description-tile[open] {
    animation: zoom 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .description-tile[open]::backdrop {
    animation: fade 0.25s ease-out;
  }

  .description-tile > div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .description-tile > div > div {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: flex-end;
    padding-left: 2.5vw;
    height: 40vw;
  }

  .description-image {
    width: 50%;
    height: auto;
    border-radius: 1.75vw;
    filter: drop-shadow(0 0 0.5vw rgba(51, 226, 230, 0.75));
  }

  .description-text {
    font-size: 2vw;
    line-height: 3.5vw;
    height: 80%;
    overflow-y: scroll;
    color: rgba(51, 226, 230, 0.9);
  }

  .description-tile::-webkit-scrollbar {
    width: 0;
  }

  .description-text::-webkit-scrollbar {
    width: 0.25vw;
  }

  .description-text::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0);
  }

  .description-text::-webkit-scrollbar-thumb {
    background: rgba(51, 226, 230, 0.25);
    border-radius: 1vw;
  }

  .buttons-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    min-width: 37.5vw;
  }

  .play-button,
  .close-button {
    padding: 0.5vw 3vw;
    border: 0.05vw solid rgba(51, 226, 230, 0.75);
    border-radius: 1.75vw;
    outline: none;
    font-size: 2.4vw;
    line-height: 5vw;
    color: rgba(51, 226, 230, 0.75);
    background-color: rgba(51, 226, 230, 0.1);
    filter: drop-shadow(0 0 0.1vw rgba(51, 226, 230, 0.4));
  }

  .play-button:hover,
  .close-button:hover,
  .play-button:active,
  .close-button:active {
    color: rgba(51, 226, 230, 1);
    background-color: rgba(51, 226, 230, 0.5);
    filter: drop-shadow(0 0 1vw rgba(51, 226, 230, 0.4));
  }

  @media only screen and (max-width: 600px) {
    .description-tile {
      padding: 1em;
      padding-bottom: 0;
      width: 85vw;
      height: 80%;
      border-radius: 1em;
      overflow-y: scroll;
    }

    .description-tile > div {
      height: 100%;
      flex-direction: column;
    }

    .description-image {
      width: 100%;
      border-radius: 0.5em;
    }

    .description-tile > div > div {
      height: auto;
      padding-left: 0;
      padding-top: 1.5em;
      padding-bottom: 1em;
    }

    .description-text {
      height: auto;
      font-size: 1.1em;
      line-height: 1.8em;
      padding-bottom: 1.5em;
    }

    .buttons-container {
      width: 100%;
    }

    .play-button,
    .close-button {
      padding: 0.25em 1em;
      font-size: 1.3em;
      line-height: 2em;
      border-radius: 0.5em;
    }
  }

  @keyframes zoom {
    from {
      transform: scale(1.5);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
