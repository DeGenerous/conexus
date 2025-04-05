<script lang="ts">
  import GenreSelect from '@components/utils/GenreSelect.svelte';
  import SearchSection from '@components/utils/SearchSection.svelte';
  import StoryTile from '@components/utils/StoryTile.svelte';

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

  let searchField: string = '';
  let activeGenre: string;

  let page: number = 1;
  let pageSize: number = 5;

  let isSearching = false;
  let isSorting = false;
  let isEndReached = false;

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
      isEndReached = true;
      return;
    }

    filteredTopics = [...filteredTopics, ...newTopics];
    sortedTopics = applySorting(filteredTopics);
  }

  // Genres
  const resetGenres = () => {
    activeGenre = '';
    activeGenre = '';
    filteredTopics = [];
    sortedTopics = [];
    isEndReached = false;
    activeMode = null;
    page = 1;
    isSorting = false;
  };

  // Search
  function handleSearchDebounced() {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      if (!searchField.trim()) {
        // Clear state
        filteredTopics = [];
        sortedTopics = [];
        isEndReached = false;
        activeMode = null;
        return;
      }

      activeGenre = '';

      resetAndFetch({ text: searchField, mode: 'search' });
    }, 600);
  }

  $: if (activeGenre) {
    searchField = '';
    resetAndFetch({ text: activeGenre, mode: 'genre' });
  }

  function handleScroll(event: Event) {
    if (isSearching || isEndReached || !activeMode) return;

    const target = event.target as HTMLElement;
    if (target.scrollLeft + target.clientWidth >= target.scrollWidth - 20) {
      page++;
      fetchTopics({
        text: activeMode === 'genre' ? activeGenre : searchField,
        mode: activeMode,
      });
    }
  }

  // Sorting
  function applySorting(data: TopicInCategory[]) {
    return isSorting ? sortByName(data) : sortByOrder(data);
  }

  const handleSorting = () => {
    if (isSorting) sortedTopics = sortByName(filteredTopics);
    else sortedTopics = sortByOrder(filteredTopics);
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

<section class="filters">
  <GenreSelect {genres} bind:activeGenre {resetGenres} />
  <SearchSection
    handleSearch={handleSearchDebounced}
    bind:searchField
    bind:isSearching
  />
</section>

{#if filteredTopics.length > 0}
  <section>
    <div class="collection-header">
      <p>Filtered Stories</p>
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
    <div class="tiles-collection blur" on:scroll={handleScroll}>
      {#key sortedTopics}
        {#each filteredTopics as topic}
          <StoryTile {section} bind:topic bind:loading={isSearching} />
        {/each}
        {#if !isEndReached && isSearching}
          <StoryTile {section} topic={null} loading={isSearching} />
        {/if}
      {/key}
    </div>
  </section>
{/if}

<style>
  section {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    gap: 1vw;
  }

  .collection-header p {
    color: rgb(0, 185, 55);
    -webkit-text-stroke: 0;
  }

  .tiles-collection {
    background-image: none;
    background-color: rgba(0, 185, 55, 0.25);
    box-shadow:
      inset 0 0 0.5vw rgba(0, 185, 55, 0.25),
      0 0 0.5vw #010020;
  }

  .tiles-collection::-webkit-scrollbar-thumb {
    background: linear-gradient(
      to right,
      rgba(0, 185, 55, 0.15),
      rgba(0, 185, 55, 0.3),
      rgba(0, 185, 55, 0.15)
    );
    border-radius: 1vw;
    cursor: pointer;
  }

  .tiles-collection::-webkit-scrollbar-thumb:hover,
  .tiles-collection::-webkit-scrollbar-thumb:active {
    background: rgba(0, 185, 55, 0.5);
  }

  .filters {
    z-index: 100;
    width: 95vw;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    gap: 1vw;
  }

  @media only screen and (max-width: 600px) {
    section {
      gap: 0.5em;
    }

    .filters {
      width: 90%;
      gap: 1em;
      flex-direction: column;
    }
  }
</style>
