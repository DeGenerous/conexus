<script lang="ts">
  import { onMount } from 'svelte';
  import StoryTile from '@components/utils/StoryTile.svelte';
  import { CoNexusApp } from '@lib/view';

  const view = new CoNexusApp();

  export let category: CategoriesInSection | null = null;
  export let section: string = '';

  let topics: TopicInCategory[] = [];

  let isSorting: boolean = false;
  let sortedTopics: TopicInCategory[] = [];

  let page: number = 1;
  let pageSize: number = 5;
  let total: number = 0;
  let loading: boolean = false;
  let isEndReached: boolean = false;

  const fetchTopics = async () => {
    if (!category || loading || isEndReached) return;

    loading = true;

    const response = await view.getCategoryTopics(category.id, page, pageSize);

    // if topics add the topics to the array
    if (response && response.length > 0) {
      topics = [...topics, ...response];
      total += response.length;
      page++; // Move to next page
    }

    // Stop fetching when we've loaded all topics
    if (response.length == 0 || total >= category.topic_count) {
      isEndReached = true;
    }

    sortedTopics = applySorting(topics);

    loading = false;
  };

  // Debounce function to avoid rapid API calls
  let debounceTimer: NodeJS.Timeout;
  const debounceFetch = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fetchTopics();
    }, 600); // 0.6 second debounce time
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

  function applySorting(data: TopicInCategory[]) {
    return isSorting ? sortByName(data) : sortByOrder(data);
  }

  const handleSorting = () => {
    if (isSorting) sortedTopics = sortByName(topics);
    else sortedTopics = sortByOrder(topics);
  };

  function sortByName(data: TopicInCategory[]) {
    return data.sort((a: TopicInCategory, b: TopicInCategory) => {
      const firstTopic = (
        a.name.charAt(0).toUpperCase() + a.name.slice(1)
      ).trim();
      const secondTopic = (
        b.name.charAt(0).toUpperCase() + b.name.slice(1)
      ).trim();
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
</script>

<section>
  {#if !category || !section}
    <div class="collection-header">
      <p>Loading stories...</p>
      <button
        class="filter blur disabled-btn-styling"
        style:cursor="not-allowed"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-100 -100 200 200"
          class="sort-svg filter-image"
          fill="#dedede"
          stroke="#dedede"
          stroke-linejoin="round"
        >
          <path
            d="
                M -80 -95
                L -80 34
                L -96 34
                L -72 72
                L -48 34
                L -64 34
                L -64 -95
                Z
              "
            stroke-width="6"
          />
          <rect x="-30" y="-98" width="130" height="20" rx="4" />
          <rect x="-30" y="-48" width="105" height="20" rx="4" />
          <rect x="-30" y="2" width="80" height="20" rx="4" />
          <rect x="-30" y="52" width="55" height="20" rx="4" />
        </svg>
        A-Z
      </button>
    </div>
    <div class="tiles-collection blur">
      {#each Array(5) as _}
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
    <div class="collection-header">
      <p>{category.name}</p>
      <button
        class="filter blur"
        on:click={() => {
          isSorting = !isSorting;
          handleSorting();
        }}
        style={isSorting
          ? 'background-color: rgba(56, 117, 250, 0.9); box-shadow: 0 0 0.5vw rgba(51, 226, 230, 0.5); color: rgb(51, 226, 230); text-shadow: none;'
          : ''}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-100 -100 200 200"
          class="sort-svg filter-image"
          fill={isSorting ? 'rgb(51, 226, 230)' : '#dedede'}
          stroke={isSorting ? 'rgb(51, 226, 230)' : '#dedede'}
          stroke-linejoin="round"
          style="transform: {isSorting ? 'scale(1.1)' : ''}"
        >
          <path
            style="transform: {isSorting ? 'scale(0.9) translateY(10%)' : ''}"
            d="
                M -80 -95
                L -80 34
                L -96 34
                L -72 72
                L -48 34
                L -64 34
                L -64 -95
                Z
              "
            stroke-width="6"
          />
          <rect x="-30" y="-98" width="130" height="20" rx="4" />
          <rect x="-30" y="-48" width="105" height="20" rx="4" />
          <rect x="-30" y="2" width="80" height="20" rx="4" />
          <rect x="-30" y="52" width="55" height="20" rx="4" />
        </svg>
        A-Z
      </button>
    </div>
    {#key sortedTopics}
      <div class="tiles-collection blur" on:scroll={handleScroll}>
        {#each sortedTopics as topic}
          <StoryTile {section} bind:topic bind:loading />
        {/each}
        {#if !isEndReached}
          <StoryTile {section} topic={null} loading={true} />
        {/if}
      </div>
    {/key}
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
