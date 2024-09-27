<script lang="ts">
  export let sectionName: string;
  let sectionLink = sectionName.replace(/\s+/g, "");

  const primaryThumbnail = `/titlePicture/${sectionLink}1.avif`;
  const secondaryThumbnail = `/titlePicture/${sectionLink}2.avif`;

  let isPrimary: boolean = true;
  function tileHover() {
    isPrimary = !isPrimary;
  }
</script>

<a
  class="tile"
  id={sectionName}
  href="/{sectionLink}"
  on:mouseenter={tileHover}
  on:mouseleave={tileHover}
  on:touchstart={tileHover}
  on:touchend={tileHover}
>
  <img
    class="tile-picture {isPrimary ? 'visible' : ''}"
    src={primaryThumbnail}
    alt={sectionName}
    draggable="false"
  />
  <img
    class="tile-picture {!isPrimary ? 'visible' : ''}"
    src={secondaryThumbnail}
    alt={sectionName}
    draggable="false"
  />
  <p class="title">{sectionName}</p>
</a>

<style>
  .tile {
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

  .tile:hover,
  .tile:active {
    background-color: rgba(51, 226, 230, 0.3);
    color: #010020;
    filter: drop-shadow(0 0 0.5vw #33e2e6);
    transform: scale(1.01);
    transition: transform 0.15s ease-in-out;
  }

  .tile-picture {
    display: none;
    object-fit: cover;
    width: 95%;
    height: 80%;
    margin: 2.5%;
    margin-bottom: 0;
    border: 0.05vw solid rgba(51, 226, 230, 0.75);
    border-radius: 1vw;
  }

  .visible {
    display: block;
  }

  .title {
    font-size: 2.3vw;
    line-height: 3vw;
    white-space: nowrap;
    text-shadow: 0 0 1vw #010020;
  }

  @media only screen and (max-width: 600px) {
    .tile {
      width: 80vw;
      height: 60vw;
      flex: none;
      margin-bottom: 3vw;
      padding-bottom: 0;
      border-radius: 5vw;
    }

    .tile-picture {
      width: 90%;
      border-radius: 4vw;
    }

    .title {
      font-size: 1.3em;
      line-height: 2em;
    }
  }
</style>
