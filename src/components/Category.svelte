<script lang="ts">
  import { CoNexus, type DynSectionCategory } from '@lib/conexus';
  import StoryCollection from './StoryCollection.svelte';
  import { onMount } from 'svelte';

  export let section: string;

  let categories: DynSectionCategory[] = [];

  onMount(async () => {
    try {
      categories = await CoNexus.sectionCategories(section!);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  });
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
