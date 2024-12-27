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

  // Search and Filter
  let filteredCategories: DynSectionCategory[];
  let isSorting: boolean = false;
  let sortedCategories: DynSectionCategory[] = [];
  let searchField: string;
  let isSearching: boolean = false;

  $: filteredCategories = categories;

  const handleSearch = async () => {
    if (!searchField) {
      filteredCategories = categories;
      isSearching = false;
      return;
    }
    isSearching = true;
    setTimeout(async () => {
      filteredCategories = await CoNexus.searchCategories(searchField)
      isSearching = false
      if (isSorting) handleSorting();
    }, 3000)
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
    console.log(filteredCategories);
    sortedCategories = filteredCategories.map(
      (category: DynSectionCategory) => {
        category.topics = category.topics.sort((a, b) => {
        // Sorting all topics in the category
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        return category;
      },
    );
    filteredCategories = sortedCategories;
  };

  // Genres
  let showGenres: boolean = false;

  const showGenresFilter = () => (showGenres = true);
  const hideGenresFilter = () => {
    if (showGenres) showGenres = false;
  };

  async function getGenre(this: HTMLElement) {
    const genre_name: string = this.innerHTML;
    filteredCategories = await CoNexus.getGenreTopics(genre_name);
    if (isSorting) handleSorting();
  }
</script>

<svelte:window on:click={hideGenresFilter} />

{#if categories}
  <section class="filters">
    <div class="sort-genres-filters">
      <button
        class="filter blur"
        on:click={() => {
          isSorting = !isSorting;
          if (isSorting) handleSorting();
          else {
            searchField = '';
            handleSearch();
          }
        }}
        style="background-color: {isSorting
          ? 'rgba(56, 117, 250, 0.9)'
          : 'rgba(56, 117, 250, 0.5)'}"
      >
        <img class="filter-image" src="/icons/sort.png" alt="Sort" />
      </button>
      <button class="filter blur" on:click|stopPropagation={showGenresFilter}>
        <img class="filter-image" src="/icons/filter.png" alt="Filter" />
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions a11y_click_events_have_key_events -->
        <ul
          class="genres-list"
          style="display: {showGenres ? 'grid' : 'none'}"
          on:mouseleave={hideGenresFilter}
          on:blur={hideGenresFilter}
        >
          {#each genres as genre (genre.id)}
            <li class="genre" value={genre.name} on:click={getGenre}>
              {genre.name}
            </li>
          {/each}
        </ul>
      </button>
    </div>

    <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role a11y_click_events_have_key_events -->
    <div
      class="filter search-wrapper blur"
      style="background-color: {searchField
        ? 'rgba(56, 117, 250, 0.9)'
        : 'rgba(56, 117, 250, 0.5)'}"
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
    justify-content: flex-end;
    gap: 1vw;
  }

  .filter {
    padding: 0 1vw;
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

  .genres-list {
    z-index: 2;
    position: absolute;
    bottom: -0.2vw;
    right: -0.2vw;
    display: grid;
    grid-template-columns: 10vw 10vw 10vw;
    row-gap: 1vw;
    justify-items: center;
    padding: 1vw;
    border: 0.1vw solid rgba(51, 226, 230, 0.5);
    border-radius: 1vw;
    background-color: #010020;
    box-shadow: inset 0 0 0.5vw rgba(51, 226, 230, 0.5);
  }

  .genre {
    font-size: 1.5vw;
    line-height: 2vw;
    cursor: pointer;
    color: rgba(51, 226, 230, 0.75);
  }

  .genre:hover,
  .genre:active {
    color: rgb(51, 226, 230);
    text-shadow: 0 0 0.1vw rgb(51, 226, 230);
  }

  .search-wrapper {
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

  .search-field {
    font-size: 1.5vw;
    line-height: 3vw;
    padding-inline: 0.5vw;
    color: rgba(51, 226, 230, 0.9);
    background-color: rgba(1, 0, 32, 0.4);
    border: 0.1vw solid rgba(51, 226, 230, 0.5);
    border-radius: 0.5vw;
    outline: none;
    width: 20vw;
  }

  .search-field::placeholder {
    color: rgba(51, 226, 230, 0.5);
  }

  .search-field:focus {
    width: 30vw;
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
      justify-content: space-between;
      gap: 0.5em;
    }

    .filter {
      border-radius: 0.5em;
      padding: 0.25em;
    }

    .filter-image {
      height: 2em;
      padding: 0.25em;
    }

    .sort-genres-filters {
      flex-direction: row-reverse;
      gap: 0.5em;
    }

    .search-wrapper {
      padding: 0.25em;
      border-radius: 0.5em;
      gap: 0.25em;
      font-size: 1em;
      line-height: 1.5em;
    }

    .search-field {
      font-size: inherit;
      line-height: inherit;
      border-radius: 0.25em;
      padding: 0.25em 0.5em;
      width: 30vw;
    }

    .search-field:focus {
      width: 45vw;
    }

    .genres-list {
      left: -0.2vw;
      top: -0.2vw;
      bottom: auto;
      right: auto;
      grid-template-columns: 40vw;
      row-gap: 0.75em;
      padding: 0.5em;
      border-radius: 0.5em;
    }

    .genre {
      font-size: 0.9em;
      line-height: 1.5em;
    }

    .categories-wrapper {
      width: 100vw;
      gap: 1em;
    }
  }
</style>
