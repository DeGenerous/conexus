<script lang="ts">
  import { onMount } from 'svelte';
  import StoryTile from '@components/utils/StoryTile.svelte';
  import { CoNexusApp } from '@lib/view';

  const view = new CoNexusApp();

  export let category: CategoriesInSection | null = null;
  export let section: string = '';

  let page: number = 1;
  let pageSize: number = 5;
  let total: number = 0;
  let loading: boolean = false;
  let isEndReached: boolean = false;

  let topics: TopicInCategory[] = [];

  const fetchTopics = async () => {
    if (!category || loading || isEndReached) return;

    loading = true;

    const response = await view.getCategoryTopics(category.id, page, pageSize);

    // if topics add the topics to the array
    if (response && response.length > 0) {
      topics = [...topics, ...response];
      total += response.length;
      page++; // Move to next page

      // Stop fetching when we've loaded all topics
      if (total >= category.topic_count) {
        isEndReached = true;
      }
    }

    loading = false;
  };

  // Debounce function to avoid rapid API calls
  let debounceTimer: NodeJS.Timeout;
  const debounceFetch = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fetchTopics();
    }, 1000); // 1 second debounce time
  };

  // Detect when user scrolls to the end of the StoryTile container
  const handleScroll = (event: Event) => {
    if (loading || isEndReached) return;

    const target = event.target as HTMLElement;
    if (target.scrollLeft + target.clientWidth >= target.scrollWidth - 20) {
      debounceFetch(); // Load next set of topics with debounce
    }
  };

  onMount(() => {
    fetchTopics();
  });
</script>

<section>
  {#if !category || !section}
    <p class="collection-header">Loading stories...</p>
    <div class="tiles-collection blur">
      {#each Array(7) as _}
        <div class="tile loading-tile" style="cursor: progress;">
          <div
            class="tile-picture loading-tile-picture loading-animation"
            style="cursor: inherit;"
          ></div>
          <p
            class="tile-title loading-tile-title loading-animation"
            style="cursor: inherit;"
          ></p>
        </div>
      {/each}
    </div>
  {:else}
    <p class="collection-header">{category.name}</p>
    <div class="tiles-collection blur" on:scroll={handleScroll}>
      {#each topics as topic}
        <StoryTile {section} bind:topic bind:loading />
      {/each}
    </div>
  {/if}
</section>

<style>
  section {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    gap: 1vw;
  }

  @media only screen and (max-width: 600px) {
    section {
      gap: 0.5em;
    }
  }
</style>
