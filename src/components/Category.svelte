<script lang="ts">
  import type { DynSectionCategory } from '@lib/conexus';
  import StoryCollection from './StoryCollection.svelte';

  export let section: string;
  export let categories: DynSectionCategory[] | undefined;
</script>

<p class="title">{section}</p>
{#if categories}
  {#each categories as category}
    <StoryCollection {category} />
  {/each}
{:else}
  <p class="loading">Loading...</p>
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

  .loading {
    text-align: center;
    font-size: 2vw;
    line-height: 2vw;
    color: rgba(51, 226, 230, 0.5);
    padding-block: 2vw;
  }

  @media only screen and (max-width: 600px) {
    .title {
      position: absolute;
      width: 100vw;
      top: 1em;
      font-size: 1.5em;
      line-height: 1.5em;
      margin: 0 auto;
    }

    .loading {
      font-size: 1em;
      line-height: 1em;
    }
  }
</style>
