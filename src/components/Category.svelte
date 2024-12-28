<script lang="ts">
  import { onMount } from 'svelte';
  import {
    CoNexus,
    type DynSectionCategory,
    type DynTopic,
  } from '@lib/conexus';
  import { checkUserState, checkWeb3LoginState } from '@utils/route-guard';
  import { web3LoggedIn } from '@stores/account';
  import StoryCollection from './StoryCollection.svelte';

  export let section: string;
  let isWeb3LoggedIn: boolean = false;

  let categories: DynSectionCategory[] = [];
  let genres: { id: number; name: string }[] = [];

  onMount(async () => {
    await checkUserState(`/${section}`);
    web3LoggedIn.subscribe((value) => {
      isWeb3LoggedIn = value;
    });
    checkWeb3LoginState(isWeb3LoggedIn, section);

    try {
      categories = await CoNexus.sectionCategories(section!);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
    try {
      genres = await CoNexus.getGenres();
    } catch (error) {
      console.error('Failed to fetch genres:', error);
    }
  });

  // Search and Sorting
  let filteredCategories: DynSectionCategory[];
  let isSorting: boolean = false;
  let sortedCategories: DynSectionCategory[] = [];
  let searchField: string;
  let isSearching: boolean = false;
  let debounceTimeout: NodeJS.Timeout;

  $: filteredCategories = categories;

  const handleSearch = async () => {
    clearTimeout(debounceTimeout);
    if (!searchField) {
      filteredCategories = categories;
      isSearching = false;
      return;
    }
    resetGenres();
    isSearching = true; // Set isSearching to true when the debounce starts
    debounceTimeout = setTimeout(async () => {
      filteredCategories = await CoNexus.searchCategories(searchField);
      isSearching = false; // Stop searching after results are returned
      if (isSorting) handleSorting();
    }, 3000); // 3-second debounce delay
  };

  let searchInput: HTMLInputElement | null;
  let searchFocus = false;
  const handleSearchFocus = () => {
    if (!searchInput) return;
    if (!searchFocus) {
      searchInput.focus();
      searchFocus = false;
    }
    if (searchFocus) {
      searchInput.blur();
      searchFocus = true;
    }
  };

  const handleSorting = () => {
    sortedCategories = filteredCategories.map((cat: DynSectionCategory) => {
      // Clone the category and topics to avoid mutating the original
      return {
        ...cat,
        topics: [...cat.topics].sort((a, b) => {
          // Sorting all topics in the category alphabetically
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        }),
      };
    });
    filteredCategories = sortedCategories;
  };

  // Genres
  let activeGenre: string;
  $: getGenre(activeGenre);

  async function getGenre(genre: string) {
    if (!genre) return;
    if (searchField) {
      searchField = '';
      handleSearch();
    }
    filteredCategories = await CoNexus.getGenreTopics(genre);
    if (isSorting) handleSorting();
  }

  const resetGenres = () => {
    if (!activeGenre) return;
    activeGenre = '';
    filteredCategories = categories;
    if (isSorting) handleSorting();
  };
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role a11y_click_events_have_key_events -->
{#if categories}
  <section class="filters">
    <div class="sort-genres-filters">
      <div
        class="filter filter-wrapper blur"
        style={activeGenre
          ? 'background-color: rgba(56, 117, 250, 0.9); box-shadow: 0 0 0.5vw rgba(51, 226, 230, 0.5);'
          : ''}
      >
        <img
          class="filter-image"
          src={activeGenre ? '/icons/reset.png' : '/icons/filter.png'}
          alt="Genres filter"
          on:click={resetGenres}
          role="button"
          tabindex="0"
        />
        <select class="genre-selector" bind:value={activeGenre}>
          <option value="" selected={true} disabled hidden>Select genre</option>
          {#each genres as genre (genre.id)}
            <option value={genre.name}>{genre.name}</option>
          {/each}
        </select>
      </div>
      <button
        class="filter blur"
        on:click={() => {
          isSorting = !isSorting;
          if (isSorting) {
            handleSorting();
          } else {
            filteredCategories = categories.map((cat) => ({
              ...cat,
              topics: [...cat.topics], // Ensure a fresh copy of topics
            }));
          }
        }}
        style={isSorting
          ? 'background-color: rgba(56, 117, 250, 0.9); box-shadow: 0 0 0.5vw rgba(51, 226, 230, 0.5);'
          : ''}
      >
        <img class="filter-image" src="/icons/sort.png" alt="Sort" />
        A-z
      </button>
    </div>

    <div
      class="filter filter-wrapper blur"
      style={searchField
        ? 'background-color: rgba(56, 117, 250, 0.9); box-shadow: 0 0 0.5vw rgba(51, 226, 230, 0.5);'
        : ''}
    >
      {#if isSearching}
        <img
          class="filter-image searching"
          src="/icons/searching.png"
          alt="Searching..."
        />
      {:else}
        <img
          class="filter-image"
          src="/icons/search.png"
          alt="Search"
          on:click={handleSearchFocus}
          role="button"
          tabindex="0"
        />
      {/if}
      <input
        bind:this={searchInput}
        bind:value={searchField}
        on:input={handleSearch}
        class="search-field"
        placeholder="Search story..."
      />
    </div>
  </section>

  {#key filteredCategories}
    <div class="categories-wrapper">
      {#each filteredCategories as category (category.name)}
        <StoryCollection {category} {section} />
      {/each}
    </div>
  {/key}
{:else}
  <p class="validation green">Loading data...</p>
{/if}

<style>
  img {
    cursor: pointer;
  }

  .filters {
    z-index: 100;
    width: 95vw;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    gap: 1vw;
  }

  .filter {
    padding: 0 1vw;
    color: #dedede;
  }

  .filter-image {
    height: 2vw;
    width: auto;
    opacity: 0.9;
  }

  .sort-genres-filters {
    display: flex;
    flex-flow: row nowrap;
    gap: 1vw;
  }

  .filter-wrapper {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 1vw;
    padding: 0.5vw;
    padding-left: 1vw;
    font-size: 1.5vw;
    background-color: rgba(56, 117, 250, 0.5);
    border: 0.1vw solid rgba(51, 226, 230, 0.5);
    border-radius: 1vw;
  }

  .searching {
    animation: searching 1s linear infinite;
  }

  @keyframes searching {
    from {
      transform: none;
    }
    to {
      transform: rotate(360deg);
    }
  }

  .genre-selector {
    font-size: 1.5vw;
    line-height: 3vw;
    padding-block: 0.75vw;
    width: 20vw;
    text-align: center;
    outline: none;
    border: 0.1vw solid rgba(51, 226, 230, 0.5);
    border-radius: 0.5vw;
    cursor: pointer;
    /* color: rgba(1, 0, 32, 0.9); */
    /* background-color: rgba(51, 226, 230, 0.5); */
    color: rgba(51, 226, 230, 0.9);
    background-color: rgba(22, 30, 95, 0.9);
  }

  .search-field {
    font-size: 1.5vw;
    line-height: 3vw;
    padding-inline: 0.5vw;
    color: rgba(51, 226, 230, 0.9);
    background-color: rgba(22, 30, 95, 0.9);
    border: 0.1vw solid rgba(51, 226, 230, 0.5);
    border-radius: 0.5vw;
    outline: none;
    width: 19vw;
  }

  .search-field::placeholder {
    color: rgba(51, 226, 230, 0.5);
  }

  .search-field:focus {
    width: 27.5vw;
  }

  .categories-wrapper {
    width: 100vw;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    gap: 2vw;
  }

  @media only screen and (max-width: 600px) {
    .filters {
      width: 90%;
      gap: 1em;
      flex-direction: column;
    }

    .filter {
      border-radius: 0.5em;
      padding: 0.25em;
      width: 33%;
    }

    .filter-image {
      height: 2em;
      padding: 0.25em;
    }

    .sort-genres-filters {
      gap: 1em;
      justify-content: space-between;
    }

    .filter-wrapper {
      padding: 0.25em;
      border-radius: 0.5em;
      gap: 0.25em;
      font-size: 1em;
      line-height: 1.5em;
      width: 100%;
    }

    .genre-selector {
      font-size: inherit;
      line-height: inherit;
      border-radius: 0.25em;
      padding-block: 0.25em;
      width: 100%;
    }

    .search-field {
      font-size: inherit;
      line-height: inherit;
      border-radius: 0.25em;
      padding: 0.25em 0.5em;
      width: 100% !important;
    }

    .categories-wrapper {
      width: 100vw;
      gap: 1em;
    }
  }
</style>
