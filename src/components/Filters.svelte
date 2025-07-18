<!-- LEGACY SVELTE 3/4 SYNTAX -->
<script lang="ts">
  import { toastStore } from '@stores/toast.svelte';

  import StoryTile from '@components/utils/StoryTile.svelte';
  import GenreSelect from '@components/utils/GenreFilter.svelte';
  import SearchSection from '@components/utils/SearchFilter.svelte';

  import SortingSVG from '@components/icons/Sorting.svelte';

  export let categories: CategoryInSection[] = [];
  export let section: string;
  export let genres: Genre[] = [];
  export let getTopics: (
    text: string,
    which: 'search' | 'genre',
    page?: number,
    pageSize?: number,
    sort_order?: TopicSortOrder,
  ) => Promise<TopicInCategory[]>;

  let filteredTopics: TopicInCategory[] = [];
  let sortedTopics: TopicInCategory[] = [];

  let searchField: string = ''; // search INPUT value
  let activeGenre: string; // genres SELECT value

  let page: number = 1;
  let pageSize: number = 10;

  let isSearching = false;
  let isSorting = false;
  let isEndReached = false; // no more topics to load if TRUE

  let activeMode: 'genre' | 'search' | null = null;

  let search_sort_order: TopicSortOrder = 'name';
  let genre_sort_order: TopicSortOrder = 'category';

  let debounceTimeout: NodeJS.Timeout | null = null;

  async function resetAndFetch({
    text = '',
    mode,
  }: {
    text?: string;
    mode: 'genre' | 'search';
  }) {
    // Cancel ongoing debounce
    if (debounceTimeout) clearTimeout(debounceTimeout);

    // Reset state
    page = 1;
    isEndReached = false;
    filteredTopics = [];

    // Update active mode
    activeMode = mode;

    await fetchTopics({ text, mode });
  }

  async function fetchTopics({
    text = '',
    mode,
  }: {
    text?: string;
    mode: 'genre' | 'search';
  }) {
    if (isEndReached) return;

    const query = mode === 'search' ? text.replace(/[^a-zA-Z ]/g, '') : text;

    const sortOrder = mode === 'search' ? search_sort_order : genre_sort_order;

    const newTopics = await getTopics(query, mode, page, pageSize, sortOrder);

    if (newTopics.length === 0) {
      if (filteredTopics.length === 0) {
        toastStore.show(
          'Couldn’t find what you’re looking for. No matching stories in this realm.',
          'error',
        );
      }

      isEndReached = true;
      return;
    }

    filteredTopics = [...filteredTopics, ...newTopics];
    sortedTopics = applySorting(filteredTopics);
  }

  // GENRES

  const resetGenres = () => {
    activeGenre = '';
    filteredTopics = [];
    sortedTopics = [];
    isEndReached = false;
    activeMode = null;
    page = 1;
    isSorting = false;
  };

  $: if (activeGenre) {
    searchField = '';
    resetAndFetch({ text: activeGenre, mode: 'genre' });
  }

  // SEARCH

  function handleSearchDebounced() {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    isSearching = true;
    debounceTimeout = setTimeout(() => {
      if (!searchField.trim()) {
        // Clear state
        filteredTopics = [];
        sortedTopics = [];
        isEndReached = false;
        activeMode = null;
        isSearching = false;
        return;
      }

      activeGenre = '';

      resetAndFetch({ text: searchField, mode: 'search' });
      isSearching = false;
    }, 1000); // 1s delay before search
  }

  // SORTING

  function applySorting(data: TopicInCategory[]) {
    return isSorting ? sortByName(data) : sortByOrder(data);
  }

  const handleSorting = () => {
    if (isSorting) sortedTopics = sortByName([...filteredTopics]);
    else sortedTopics = sortByOrder([...filteredTopics]);
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

  function handleScroll(event: Event) {
    if (isSearching || isEndReached || !activeMode) return;

    const target = event.target as HTMLElement;
    // Load next page if user scrolls to the end of collection
    if (target.scrollLeft + target.clientWidth >= target.scrollWidth - 20) {
      page++;
      fetchTopics({
        text: activeMode === 'genre' ? activeGenre : searchField,
        mode: activeMode,
      });
    }
  }
</script>

<section class="filters flex">
  <GenreSelect
    {genres}
    bind:activeGenre
    {resetGenres}
    disabled={!categories || categories.length == 0}
  />
  <SearchSection
    handleSearch={handleSearchDebounced}
    bind:searchField
    bind:isSearching
    disabled={!categories || categories.length == 0}
  />
</section>

{#if filteredTopics.length > 0}
  <div class="collection-header">
    <h2 class="text-glowing">Filtered Stories</h2>
    <SortingSVG
      sorting={isSorting}
      onclick={() => {
        isSorting = !isSorting;
        handleSorting();
      }}
      hideForMobiles={true}
    />
  </div>
  <div class="tiles-collection filtered-tiles" on:scroll={handleScroll}>
    {#key sortedTopics}
      {#each sortedTopics as topic}
        <StoryTile {section} bind:topic bind:loading={isSearching} />
      {/each}
      {#if !isEndReached && isSearching}
        <StoryTile {section} topic={null} loading={isSearching} />
      {/if}
    {/key}
  </div>
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .filters {
    width: 100vw;

    @include respond-up(tablet) {
      flex-direction: row;
      padding-inline: 1.5rem;
    }
  }
</style>
