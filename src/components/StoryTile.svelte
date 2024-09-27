<script lang="ts">
  import PopupTile from "./PopupTile.svelte";

  export let storyName: string;
  export let storyDescription: string;
  export let storyLink: string;
  export let primaryThumbnail: string;
  export let secondaryThumbnail: string | undefined;
  export let descriptionPicture: string;
  export let storyGenre: string[] | undefined = undefined;
  export let playButton: string;

  let isPrimary: boolean = true;
  function tileHover() {
    isPrimary = !isPrimary;
  }

  let showModal: boolean = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="tile"
  id={storyName}
  data-genre={storyGenre}
  on:mouseenter={tileHover}
  on:mouseleave={tileHover}
  on:click|stopPropagation={() => (showModal = true)}
  on:touchstart={tileHover}
  on:touchend={tileHover}
>
  <img
    class="tile-picture {secondaryThumbnail
      ? isPrimary
        ? 'visible'
        : ''
      : 'visible'}"
    src={primaryThumbnail}
    alt={storyName}
    draggable="false"
    height="1024"
    width="1024"
  />
  {#if secondaryThumbnail}
    <img
      class="tile-picture {!isPrimary ? 'visible' : ''}"
      src={secondaryThumbnail}
      alt={storyName}
      draggable="false"
      height="1024"
      width="1024"
    />
  {/if}
  <p class="title">{storyName}</p>
</div>

<PopupTile
  {storyLink}
  {storyDescription}
  {descriptionPicture}
  {playButton}
  bind:showModal
/>

<style>
  .tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 20vw;
    margin: 1vw;
    background-color: rgba(36, 65, 189, 0.75);
    color: rgba(255, 255, 255, 0.6);
    border: 0.05vw solid rgba(51, 226, 230, 0.75);
    border-radius: 1.5vw;
    filter: drop-shadow(0 0 0.1vw #010020);
    cursor: pointer;
    text-decoration: none;
    flex: none;
  }

  .tile:hover,
  .tile:active {
    background-color: rgba(45, 90, 216, 0.9);
    color: rgba(51, 226, 230, 0.9);
    filter: drop-shadow(0 0 0.5vw rgba(51, 226, 230, 0.5));
    transform: scale(1.01);
    transition: transform 0.15s ease-in-out;
  }

  .tile-picture {
    display: none;
    object-fit: cover;
    width: 95%;
    height: 19vw;
    margin: 2.5%;
    margin-bottom: 0;
    border: 0.05vw solid rgba(51, 226, 230, 0.75);
    border-radius: 1vw;
    flex: 1;
    background-color: rgba(0, 0, 0, 0.9);
  }

  .visible {
    display: block;
  }

  .title {
    text-align: center;
    padding: 1vw;
    font-size: 2vw;
    line-height: 3vw;
    text-shadow: 0 0 1vw rgba(1, 0, 32, 0.4);
  }

  @media only screen and (max-width: 600px) {
    .tile {
      width: 40vw;
    }

    .tile-picture {
      height: 38vw;
    }

    .title {
      font-size: 1em;
      line-height: 1.5em;
    }
  }
</style>
