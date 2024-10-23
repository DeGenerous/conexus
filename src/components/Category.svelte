<script lang="ts">
  import type { DynSectionCategory } from '@lib/conexus';
  import StoryCollection from './StoryCollection.svelte';

  export let categories: DynSectionCategory[] | undefined;
</script>

{#if categories}
  {#each categories as category}
    <StoryCollection {category} />
  {/each}
{:else}
  <p class="loading">Loading...</p>
{/if}

<style>
  .loading {
    text-align: center;
    font-size: 2vw;
    line-height: 2vw;
    color: rgba(51, 226, 230, 0.5);
    padding-block: 2vw;
  }

  @media only screen and (max-width: 600px) {
    .loading {
      font-size: 1em;
      line-height: 1em;
    }
  }
</style>
