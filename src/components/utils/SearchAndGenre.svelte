<script lang="ts">
  import GenreSelect from '@components/utils/GenreSelect.svelte';
  import SearchSection from '@components/utils/SearchSection.svelte';
  import StoryTile from '@components/utils/StoryTile.svelte';

  export let section: string;
  export let filteredTopics: TopicInCategory[] = [];
  export let genres: Genre[] = [];

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
  let pageSize: number = 3;
  let search_sort_order: TopicSortOrder = 'name';
  let genre_sort_order: TopicSortOrder = 'category';
  let isSearching: boolean = false;

  let isSorting: boolean = false;

  // Genres
  let activeGenre: string;
  $: getGenre(activeGenre);

  async function getGenre(genre: string) {
    if (!genre) return;
    if (searchField) {
      searchField = '';
      handleSearch();
    }
    filteredTopics = await getTopics(
      genre,
      'genre',
      page,
      pageSize,
      genre_sort_order,
    );
    if (isSorting) handleSorting();
  }

  const handleSearch = async () => {
    clearTimeout(debounceTimeout);
    if (!searchField) {
      filteredTopics = [];
      isSearching = false;
      return;
    }
    resetGenres();

    isSearching = true; // Set isSearching to true when the debounce starts
    debounceTimeout = setTimeout(async () => {
      filteredTopics = await getTopics(
        searchField.replace(/[^a-zA-Z ]/g, ''),
        'search',
        page,
        pageSize,
        search_sort_order,
      );
      isSearching = false; // Stop searching after results are returned
      if (isSorting) handleSorting();
    }, 3750); // 3.75-second debounce delay
  };

  const resetGenres = () => {
    if (!activeGenre) return;
    activeGenre = '';
    filteredTopics = [];

    if (isSorting) handleSorting();
  };

  const handleSorting = () => {};
</script>

<section class="filters">
  <GenreSelect
    {genres}
    bind:activeGenre
    {isSorting}
    {getGenre}
    {handleSorting}
    {resetGenres}
  />
  <SearchSection {handleSearch} bind:searchField />
</section>

<div>
  {#each filteredTopics as topic}
    <StoryTile {section} bind:topic bind:loading={isSearching} />
  {/each}
</div>

<style>
  .filters {
    z-index: 100;
    width: 95vw;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    gap: 1vw;
  }

  @media only screen and (max-width: 600px) {
    .filters {
      width: 90%;
      gap: 1em;
      flex-direction: column;
    }
  }
</style>
