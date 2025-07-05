<!-- LEGACY SVELTE 3/4 SYNTAX -->
<script lang="ts">
  import { onMount } from 'svelte';

  import CoNexusApp from '@lib/view';
  import {
    SetCache,
    GetCache,
    CATEGORY_TOPICS_KEY,
    CATEGORY_TOPICS_TTL,
  } from '@constants/cache';

  import StoryTile from '@components/utils/StoryTile.svelte';
  import SortingSVG from '@components/icons/Sorting.svelte';

  export let category: CategoryInSection | null = null;
  export let section: string = '';

  const view = new CoNexusApp();

  let topics: TopicInCategory[] = [];

  let isSorting: boolean = false;
  let sortedTopics: TopicInCategory[] = [];

  let pageSize: number = 10;
  let total: number = 0;
  let loading: boolean = false;
  let isEndReached: boolean = false;

  const fetchTopics = async () => {
    if (!category || loading || isEndReached) return;

    const cachedTopics = GetCache<TopicInCategory[]>(
      CATEGORY_TOPICS_KEY(category.name),
    );
    if (cachedTopics) {
      topics = cachedTopics;
      sortedTopics = applySorting(topics);
      if (topics.length === category.topic_count) {
        isEndReached = true;
        return;
      }
    }

    loading = true;

    const response = await view.getCategoryTopics(
      category.id,
      Math.floor(topics.length / pageSize) + 1,
      pageSize,
    );

    // if topics add the topics to the array
    if (response && response.length > 0) {
      topics = [...topics, ...response];
      total += response.length;
      SetCache(CATEGORY_TOPICS_KEY(category.name), topics, CATEGORY_TOPICS_TTL);
    }

    // Stop fetching when we've loaded all topics
    if (response.length == 0 || total >= category.topic_count) {
      isEndReached = true;
    }

    sortedTopics = applySorting(topics);

    loading = false;
  };

  onMount(() => {
    fetchTopics();
  });

  // SORTING

  function applySorting(data: TopicInCategory[]) {
    return isSorting ? sortByName(data) : sortByOrder(data);
  }

  const handleSorting = () => {
    if (isSorting) sortedTopics = sortByName(topics);
    else sortedTopics = sortByOrder(topics);
  };

  function sortByName(data: TopicInCategory[]) {
    return data.sort((a: TopicInCategory, b: TopicInCategory) => {
      const firstTopic = a.name.toLowerCase().trim();
      const secondTopic = b.name.toLowerCase().trim();
      // Sorting all topics in the category alphabetically
      if (firstTopic < secondTopic) return -1;
      if (firstTopic > secondTopic) return 1;
      return 0;
    });
  }

  function sortByOrder(data: TopicInCategory[]) {
    return data.sort((a: TopicInCategory, b: TopicInCategory) => {
      if (a.order < b.order) return -1;
      if (a.order > b.order) return 1;
      return 0;
    });
  }

  // A.K.A. INTERSECTION OBSERVER

  const handleScroll = (event: Event) => {
    if (!category || !section || loading || isEndReached) return;

    const target = event.target as HTMLElement;
    // Load next page if user scrolls to the end of collection
    if (target.scrollLeft + target.clientWidth >= target.scrollWidth - 20) {
      fetchTopics();
    }
  };
</script>

<div class="collection-header">
  {#if !category || !section}
    <h2>Loading stories...</h2>
  {:else}
    <h2>{category.name}</h2>
  {/if}
  <SortingSVG
    sorting={isSorting}
    disabled={!category || !section}
    onclick={() => {
      isSorting = !isSorting;
      handleSorting();
    }}
    hideForMobiles={true}
  />
</div>

<div class="tiles-collection" on:scroll={handleScroll}>
  {#if !category || !section}
    {#each Array(Math.floor(Math.random() * 3) + 3) as _}
      <div class="loading-tile">
        <div class="loading-animation"></div>
        <span class="loading-animation"></span>
      </div>
    {/each}
  {:else}
    {#key sortedTopics}
      {#each sortedTopics as topic}
        <StoryTile {section} bind:topic bind:loading />
      {/each}
    {/key}
  {/if}
</div>
