<!-- LEGACY SVELTE 3/4 SYNTAX -->
<script lang="ts">
  import { toastStore } from '@stores/toast.svelte';

  import TopicTile from '@components/utils/TopicTile.svelte';
  import GenreSelect from '@components/utils/GenreFilter.svelte';
  import SearchSection from '@components/utils/SearchFilter.svelte';

  import SortingSVG from '@components/icons/Sorting.svelte';

  let {
    name,
    intended,
    categories,
    genres,
    getTopics,
  }: {
    name: string;
    intended: 's' | 'c';
    categories: SectionCategoryTopics[];
    genres: Genre[];
    getTopics: (
      text: string,
      which: 'search' | 'genre',
      page?: number,
      pageSize?: number,
      sort_order?: TopicSortOrder,
    ) => Promise<CategoryTopic[]>;
  } = $props();

  let filteredTopics = $state<CategoryTopic[]>([]);
  let sortedTopics = $state<CategoryTopic[]>([]);

  let searchField = $state<string>(''); // search INPUT value
  let activeGenre = $state<string>(''); // genres SELECT value

  let page = $state<number>(1);
  let pageSize = $state<number>(10);

  let isSearching = $state<boolean>(false);
  let isSorting = $state<boolean>(false);
  let isEndReached = $state<boolean>(false); // no more topics to load if TRUE

  let activeMode: 'genre' | 'search' | null = null;

  let search_sort_order = $state<TopicSortOrder>('name');
  let genre_sort_order = $state<TopicSortOrder>('category');

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

  let prevGenre = '';

  $effect(() => {
    if (activeGenre && activeGenre !== prevGenre) {
      prevGenre = activeGenre;
      searchField = '';
      resetAndFetch({ text: activeGenre, mode: 'genre' });
    }
  });

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

  function applySorting(data: CategoryTopic[]) {
    return isSorting ? sortByName(data) : sortByOrder(data);
  }

  const handleSorting = () => {
    if (isSorting) sortedTopics = sortByName([...filteredTopics]);
    else sortedTopics = sortByOrder([...filteredTopics]);
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
  <div class="collection-header fade-in">
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
  <div class="tiles-collection filtered-tiles fade-in" onscroll={handleScroll}>
    {#key sortedTopics}
      {#each sortedTopics as topic, i}
        <TopicTile
          {name}
          {intended}
          bind:topic={sortedTopics[i]}
          bind:loading={isSearching}
        />
      {/each}
      {#if !isEndReached && isSearching}
        <TopicTile {name} {intended} topic={null} loading={isSearching} />
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
