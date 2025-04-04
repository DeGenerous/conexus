<script lang="ts">
  import { onMount } from 'svelte';

  import GenreSelect from '@components/utils/GenreSelect.svelte';
  import SearchSection from '@components/utils/SearchSection.svelte';

  export let filteredTopics: TopicInCategory[] = [];

  export let getGenres: () => Promise<Genre[]>;
  export let getGenreTopics: (genre: string) => Promise<TopicInCategory[]>;
  export let searchSectionTopics: (
    search_field: string,
  ) => Promise<TopicInCategory[]>;

  let genres: Genre[] = [];

  let debounceTimeout: NodeJS.Timeout;

  let searchField: string = '';
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
    filteredTopics = await getGenreTopics(genre);
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
    console.log('Searching for:', searchField);
    isSearching = true; // Set isSearching to true when the debounce starts
    debounceTimeout = setTimeout(async () => {
      filteredTopics = await searchSectionTopics(
        searchField.replace(/[^a-zA-Z ]/g, ''),
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

  onMount(async () => {
    genres = await getGenres();
  });
</script>

<section class="filters">
  <GenreSelect
    {genres}
    {activeGenre}
    {isSorting}
    {getGenre}
    {handleSorting}
    {resetGenres}
  />
  <SearchSection {handleSearch} bind:searchField />
</section>

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
