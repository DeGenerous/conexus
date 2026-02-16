<script lang="ts">
  import { onMount } from 'svelte';

  import CoNexusApp from '@lib/view';

  import TopicTile from '@components/utils/TopicTile.svelte';
  import SortingSVG from '@components/icons/Sorting.svelte';

  let {
    name,
    intended,
    category,
  }: {
    name: string;
    intended: 's' | 'c'; // section or creator
    category: SectionCategoryTopics | null;
  } = $props();

  const view = new CoNexusApp();

  let topics = $state<CategoryTopic[]>([]);

  let isSorting = $state<boolean>(false);
  let sortedTopics = $state<CategoryTopic[]>([]);

  let pageSize = $state<number>(10);
  let total = $state<number>(0);
  let loading = $state<boolean>(false);
  let isEndReached = $state<boolean>(false);

  // load topics page-by-page and persist them so revisiting the category instantly restores the scroller
  const fetchTopics = async () => {
    if (!category || loading || isEndReached) return;

    loading = true;

    let page = Math.floor(topics.length / pageSize) + 1;

    const response = await view.getCategoryTopics(category.id, page, pageSize);

    // if topics add the topics to the array
    if (response && response.length > 0) {
      topics = [...topics, ...response];
      total += response.length;
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

  function applySorting(data: CategoryTopic[]) {
    return isSorting ? sortByName(data) : sortByOrder(data);
  }

  const handleSorting = () => {
    if (isSorting) sortedTopics = sortByName(topics);
    else sortedTopics = sortByOrder(topics);
  };

  function sortByName(data: CategoryTopic[]) {
    return data.sort((a: CategoryTopic, b: CategoryTopic) => {
      const firstTopic = a.name.toLowerCase().trim();
      const secondTopic = b.name.toLowerCase().trim();
      // Sorting all topics in the category alphabetically
      if (firstTopic < secondTopic) return -1;
      if (firstTopic > secondTopic) return 1;
      return 0;
    });
  }

  function sortByOrder(data: CategoryTopic[]) {
    return data.sort((a: CategoryTopic, b: CategoryTopic) => {
      if (a.sort_order < b.sort_order) return -1;
      if (a.sort_order > b.sort_order) return 1;
      return 0;
    });
  }

  // A.K.A. INTERSECTION OBSERVER

  const handleScroll = (event: Event) => {
    if (!category || !name || loading || isEndReached) return;

    const target = event.target as HTMLElement;
    // Load next page if user scrolls to the end of collection
    if (target.scrollLeft + target.clientWidth >= target.scrollWidth - 20) {
      fetchTopics();
    }
  };
</script>

<div class="collection-header fade-in">
  {#if !category || !name}
    <h2>Loading stories...</h2>
  {:else}
    <h2>{category.name}</h2>
  {/if}
  <SortingSVG
    sorting={isSorting}
    disabled={!category || !name}
    onclick={() => {
      isSorting = !isSorting;
      handleSorting();
    }}
    hideForMobiles={true}
  />
</div>

<div class="tiles-collection fade-in" onscroll={handleScroll}>
  {#if !category || !name}
    {#each Array(Math.floor(Math.random() * 3) + 3) as _}
      <div class="loading-tile">
        <div class="loading-animation"></div>
        <span class="loading-animation"></span>
      </div>
    {/each}
  {:else}
    {#key sortedTopics}
      {#each sortedTopics as topic, i}
        <TopicTile
          {name}
          {intended}
          category_id={category.id}
          bind:topic={sortedTopics[i]}
          bind:loading
        />
      {/each}
    {/key}
  {/if}
</div>
