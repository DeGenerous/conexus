<script lang="ts">
  import GenreSelect from '@components/utils/GenreSelect.svelte';
  import SearchSection from '@components/utils/SearchSection.svelte';
  import StoryTile from '@components/utils/StoryTile.svelte';

  export let section: string;
  export let genres: Genre[] = [];

  let filteredTopics: TopicInCategory[] = [];

  export let getTopics: (
    text: string,
    which: 'search' | 'genre',
    page?: number,
    pageSize?: number,
    sort_order?: TopicSortOrder,
  ) => Promise<TopicInCategory[]>;

  let debounceTimeout: NodeJS.Timeout;

  let searchField: string = '';
  let page: number = 1;
  let pageSize: number = 5;
  let search_sort_order: TopicSortOrder = 'name';
  let genre_sort_order: TopicSortOrder = 'category';

  let isSearching: boolean = false;
  let isEndReached: boolean = false;

  let activeGetTopics: 'genres' | 'search' = 'genres';

  // Genres
  let activeGenre: string;
  $: getGenre(activeGenre);

  async function getGenre(genre: string) {
    if (!genre || isEndReached) return;
    if (searchField) {
      searchField = '';
      handleSearch();
    }
    const newTopics = await getTopics(
      genre,
      'genre',
      page,
      pageSize,
      genre_sort_order,
    );

    if (newTopics.length === 0) {
      isEndReached = true; // Stop fetching when we've loaded all topics
      return;
    }

    filteredTopics = [...filteredTopics, ...newTopics];

    activeGetTopics = 'genres';
  }

  const handleSearch = async () => {
    clearTimeout(debounceTimeout);
    if (!searchField) {
      filteredTopics = [];
      isSearching = false;
      isEndReached = false; // Reset end reached when search field is cleared
      return;
    }

    if (isEndReached) return;

    resetGenres();

    isSearching = true; // Set isSearching to true when the debounce starts
    debounceTimeout = setTimeout(async () => {
      const newTopics = await getTopics(
        searchField.replace(/[^a-zA-Z ]/g, ''),
        'search',
        page,
        pageSize,
        search_sort_order,
      );

      if (newTopics.length === 0) {
        isEndReached = true; // Stop fetching when we've loaded all topics
        isSearching = false; // Stop searching if no results
        return;
      }

      filteredTopics = [...filteredTopics, ...newTopics];

      isSearching = false; // Stop searching after results are returned
    }, 3750); // 3.75-second debounce delay

    activeGetTopics = 'search';
  };

  const handleScroll = (event: Event) => {
    if (isSearching) return;

    const target = event.target as HTMLElement;
    if (target.scrollLeft + target.clientWidth >= target.scrollWidth - 20) {
      page++;
      // getGenre(activeGenre);
      switch (activeGetTopics) {
        case 'search':
          handleSearch();
          break;
        case 'genres':
          getGenre(activeGenre);
          break;
      }
    }
  };

  const resetGenres = () => {
    if (!activeGenre) return;
    activeGenre = '';
    isEndReached = false;
    filteredTopics = [];
  };
</script>

<section class="filters">
  <GenreSelect {genres} bind:activeGenre {resetGenres} />
  <SearchSection {handleSearch} bind:searchField bind:isSearching />
</section>

{#if filteredTopics.length > 0}
  <section>
    <div class="collection-header">
      <p>Filtered Stories</p>
    </div>
    <div class="tiles-collection blur" on:scroll={handleScroll}>
      {#each filteredTopics as topic}
        <StoryTile {section} bind:topic bind:loading={isSearching} />
      {/each}
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
