<script lang="ts">
  export let topicName: string;
  const storyName: string = topicName.charAt(0).toUpperCase() + topicName.slice(1);
  export let primaryThumbnail: string;
  export let secondaryThumbnail: string | null = null;

  let isPrimary: boolean = true;
  function tileHover() {
    isPrimary = !isPrimary;
  }
</script>

  <a
    class="tile"
    on:mouseenter={tileHover}
    on:mouseleave={tileHover}
    on:touchstart={tileHover}
    on:touchend={tileHover}
    href="/story/{topicName}"
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
  </a>

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
