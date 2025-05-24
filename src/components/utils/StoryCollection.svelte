<script lang="ts">
  import { onMount } from 'svelte';
  import StoryTile from '@components/utils/StoryTile.svelte';
  import { CoNexusApp } from '@lib/view';
  import {
    SetCache,
    GetCache,
    CATEGORY_TOPICS_KEY,
    CATEGORY_TOPICS_TTL,
  } from '@constants/cache';
  import SortingSVG from '@components/icons/Sorting.svelte';

  const view = new CoNexusApp();

  export let category: CategoriesInSection | null = null;
  export let section: string = '';

  let topics: TopicInCategory[] = [];

  let isSorting: boolean = false;
  let sortedTopics: TopicInCategory[] = [];

  let pageSize: number = 10;
  let total: number = 0;
  let loading: boolean = false;
  let isEndReached: boolean = false;

  const fetchTopics = async () => {
    if (!category || loading || isEndReached) return;

    const cachedTopics: Nullable<string> = GetCache(
      CATEGORY_TOPICS_KEY(category.name),
    );
    if (cachedTopics) {
      topics = JSON.parse(cachedTopics);
      sortedTopics = applySorting(topics);
      if (topics.length === category.topic_count) {
        isEndReached = true;
        return;
      }
    }

    loading = true;

    const response = await view.getCategoryTopics(
      category.id,
      Math.floor(topics.length / 10) + 1,
      pageSize,
    );

    // if topics add the topics to the array
    if (response && response.length > 0) {
      topics = [...topics, ...response];
      total += response.length;
      SetCache(
        CATEGORY_TOPICS_KEY(category.name),
        JSON.stringify(topics),
        CATEGORY_TOPICS_TTL,
      );
    }

    // Stop fetching when we've loaded all topics
    if (response.length == 0 || total >= category.topic_count) {
      isEndReached = true;
    }

    sortedTopics = applySorting(topics);

    loading = false;
  };

  // Detect when user scrolls to the end of the StoryTile container
  const handleScroll = (event: Event) => {
    if (!category || !section || loading || isEndReached) return;

    const target = event.target as HTMLElement;
    if (target.scrollLeft + target.clientWidth >= target.scrollWidth - 20) {
      fetchTopics(); // Load next set of topics with debounce
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
</script>

<section>
  <div class="collection-header">
    <h3>
      {#if !category || !section}
        Loading stories...
      {:else}
        {category.name}
      {/if}
    </h3>
    <button
      class="filter blur"
      class:sorting={isSorting}
      on:click={() => {
        isSorting = !isSorting;
        handleSorting();
      }}
    >
      <SortingSVG {isSorting} />
      A-Z
    </button>
  </div>
  
  <div class="tiles-collection" on:scroll={handleScroll}>
    {#if !category || !section}
      {#each Array(5) as _}
        <div class="loading-tile">
          <div
            class="loading-animation"
          ></div>
          <span
            class="loading-animation"
          ></span>
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
</section>

<style lang="scss">
  @use "/src/styles/mixins" as *;

  section {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    gap: 1vw;

    h3 {
      @include white-txt;
    }

    .filter {
      &:hover:not(&:disabled, &.sorting),
      &:active:not(&:disabled, &.sorting),
      &:focus:not(&:disabled, &.sorting) {
        @include white-txt;
      }

      &.sorting {
        background-color: $deep-green !important;
        @include cyan(1, text);
      }
    }
  }

  @media only screen and (max-width: 600px) {
    section {
      gap: 0.5em;
    }
  }
</style>
