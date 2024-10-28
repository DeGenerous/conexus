<script lang="ts">
  import { CoNexus, type DynSectionCategory } from '@lib/conexus';
  import StoryCollection from './StoryCollection.svelte';
  import { onMount } from 'svelte';

  export let section: string;

  let categories: DynSectionCategory[] = [];

  let genres: string[] = [];

  onMount(async () => {
    try {
      categories = await CoNexus.sectionCategories(section!);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }

    try {
      genres = await CoNexus.getGenres();
    } catch (error) {
      console.error('Failed to fetch genres:', error);
    }
  });

  async function getGenre(genre_name: string) {
    categories = await CoNexus.getGenreTopics(genre_name);
  }
</script>

{#if categories}
  <!-- Genre selector -->
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
