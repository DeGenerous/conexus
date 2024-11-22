<script lang="ts">
  import type { DynSection } from '@lib/conexus';

  export let section: DynSection;

  let isPrimary: boolean = true;
  function tileHover() {
    isPrimary = !isPrimary;
  }

  // sectionImage is the name of the section but remove the spaces
  const imageName: string = section.name.replace(/\s/g, '');

  const sectionImage: string = `https://media.degenerousdao.com/conexus-sections/${imageName.toLocaleLowerCase()}.avif`;

  const blankPicture: string = '/blank.avif'; // temp
</script>

<a
  class="tile"
  id={section.name}
  href="/{section.name}"
  on:mouseenter={tileHover}
  on:mouseleave={tileHover}
  on:touchstart={tileHover}
  on:touchend={tileHover}
>
  <img
    class="tile-picture {isPrimary ? 'visible' : ''}"
    src={sectionImage ?? blankPicture}
    alt={section.name}
    draggable="false"
  />
  <img
    class="tile-picture {!isPrimary ? 'visible' : ''}"
    src={sectionImage ?? blankPicture}
    alt={section.name}
    draggable="false"
  />
  <p class="title">{section.name}</p>
</a>

<style>
  .tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 28vw;
    margin: 1vw;
    background-color: rgba(22, 30, 95, 0.75);
    color: rgba(51, 226, 230, 0.75);
    border: 0.05vw solid rgba(51, 226, 230, 0.75);
    border-radius: 1.5vw;
    filter: drop-shadow(0 0 0.1vw #010020);
    cursor: pointer;
    text-decoration: none;
    transition: all 0.15s ease-in-out;
  }

  .tile:hover,
  .tile:active {
    background-color: rgba(51, 226, 230, 0.3);
    color: #010020;
    filter: drop-shadow(0 0 0.5vw #33e2e6);
    transform: scale(1.01);
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
    background-color: black;
  }

  .visible {
    display: block;
  }

  .title {
    font-size: 2.3vw;
    line-height: 3vw;
    padding-block: 1vw;
    white-space: nowrap;
    text-shadow: 0 0 1vw #010020;
  }

  @media only screen and (max-width: 600px) {
    .tile {
      width: 80vw;
      flex: none;
      margin-bottom: 3vw;
      border-radius: 5vw;
    }

    .tile-picture {
      width: 95%;
      aspect-ratio: 3/2;
      border-radius: 4vw;
    }

    .title {
      font-size: 1.3em;
      line-height: 2em;
      padding-block: 0.25em;
    }
  }
</style>
