<script lang="ts">
  import type { DynSectionCategory } from '@lib/conexus';
  import StoryTile from '../components/StoryTile.svelte';

  export let category: DynSectionCategory;
  export let section: string;
</script>

<section>
  <p class="collection-header">{category.name}</p>
  <div class="tiles-collection blur">
    {#each category.topics as topic}
      <StoryTile {section} topicName={topic.name} />
    {/each}
  </div>
</section>

<style>
  section {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    gap: 1vw;
  }

  .tiles-collection {
    width: 100%;
    height: auto;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    overflow-x: scroll;
    gap: 1vw;
    padding: 2vw;
    background-image: radial-gradient(
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0),
      rgba(51, 226, 230, 0.1)
    );
    box-shadow: inset 0 0 0.5vw rgba(51, 226, 230, 0.25), 0 0 0.5vw #010020;
    overflow-y: hidden;
  }

  .tiles-collection::-webkit-scrollbar {
    height: 0.75vw;
  }

  .tiles-collection::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .tiles-collection::-webkit-scrollbar-thumb {
    background: linear-gradient(
      to right,
      rgba(51, 226, 230, 0.15),
      rgba(51, 226, 230, 0.3),
      rgba(51, 226, 230, 0.15)
    );
    border-radius: 1vw;
    cursor: pointer;
  }

  .tiles-collection::-webkit-scrollbar-thumb:hover,
  .tiles-collection::-webkit-scrollbar-thumb:active {
    background: rgba(51, 226, 230, 0.5);
  }

  .collection-header {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    padding-inline: 2.5vw;
    font-size: 3vw;
    line-height: 3vw;
    color: rgba(51, 226, 230, 0.85);
    -webkit-text-stroke: 0.03vw #33e2e6;
    text-shadow: 0 0.25vw 0.25vw #010020;
  }

  @media only screen and (max-width: 600px) {
    section {
      gap: 0.5em;
    }

    .collection-header {
      flex-flow: column-reverse nowrap;
      align-items: center;
      justify-content: center;
      padding: 0;
      gap: 0.5em;
      font-size: 1.5em;
      line-height: 1.5em;
    }

    .tiles-collection {
      border-radius: 0;
      border-left: none;
      border-right: none;
      gap: 1em;
      padding: 1em;
    }
  }
</style>
