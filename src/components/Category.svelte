<script lang="ts">
  import { onMount } from 'svelte';

  import {
    CoNexus,
    type DynSectionCategory,
    type DynTopic,
  } from '@lib/conexus';
  import { checkUserState } from '@utils/route-guard';

  import StoryCollection from './StoryCollection.svelte';

  export let section: string;

  onMount(async () => {
    await checkUserState(`/${section}`);
  });

  let categories: DynSectionCategory[] = [];
  let genres: { id: number; name: string }[] = [];

  onMount(async () => {
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

  $: filteredCategories = categories;

  const handleSearch = () => {
    if (!searchField) {
      filteredCategories = categories;
      return;
    }

    filteredCategories = categories
      .map((category: DynSectionCategory) => {
        // Filter to get all topics in the category that match the search field
        const matchingTopics = category.topics.filter((topic: DynTopic) =>
          topic.name.toLowerCase().includes(searchField.toLowerCase()),
        );

        // If there are any matching topics, include them in the results
        return matchingTopics.length > 0
          ? { ...category, topics: matchingTopics }
          : null;
      })
      .filter((category) => category !== null); // Remove categories with no matches

    if (isSorting) handleSorting();
  };

  const handleSorting = () => {
    console.log(filteredCategories); // check before sorting
    sortedCategories = filteredCategories.map(
      (category: DynSectionCategory) => {
        category.topics = category.topics.sort((a: DynTopic, b: DynTopic) => {
          // Sorting all topics in the category
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        return category;
      },
    );
    console.log(sortedCategories); // check after sorting
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
  }
</script>

<svelte:window on:click={hideGenresFilter} />

{#if categories}
  <section class="filters">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="sort-genres-filters">
      <div
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
          ? 'rgba(45, 90, 216, 0.9)'
          : 'rgba(22, 30, 95, 0.75)'}"
        role="button"
        tabindex="0"
      >
        <img class="filter-image" src="/icons/sort.png" alt="Sort" />
      </div>

      <div
        class="filter blur"
        on:click|stopPropagation={showGenresFilter}
        role="button"
        tabindex="0"
      >
        <img class="filter-image" src="/icons/filter.png" alt="Filter" />
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
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
      </div>
    </div>

    <div
      class="filter blur"
      style="background-color: {searchField
        ? 'rgba(45, 90, 216, 0.9)'
        : 'rgba(22, 30, 95, 0.75)'}"
    >
      <img class="filter-image" src="/icons/search.png" alt="Search" />
      <input
        bind:value={searchField}
        on:input={handleSearch}
        class="search-field"
        placeholder="Search story..."
      />
    </div>
  </section>

  {#key filteredCategories}
    {#each filteredCategories as category (category.name)}
      <StoryCollection {category} />
    {/each}
  {/key}
{:else}
  <p class="loading">Loading...</p>
{/if}

<style>
  .loading {
    text-align: center;
    font-size: 2vw;
    line-height: 2vw;
    color: rgba(51, 226, 230, 0.5);
    padding-block: 2vw;
  }

  .filters {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    margin-right: 2vw;
  }

  .filter {
    z-index: 1;
    position: relative;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    padding: 0.5vw 1vw;
    margin-inline: 0.25rem;
    background-color: rgba(22, 30, 95, 0.75);
    border: 0.1vw solid rgba(51, 226, 230, 0.5);
    border-radius: 1vw;
    cursor: pointer;
  }

  .filter-image {
    height: 2vw;
    width: auto;
    opacity: 0.8;
  }

  .sort-genres-filters {
    display: flex;
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
  }

  .genre {
    font-size: 1.5vw;
    line-height: 2vw;
  }

  .genre:hover,
  .genre:active {
    color: rgb(51, 226, 230);
    filter: drop-shadow(0 0 1vw rgba(51, 226, 230, 0.25));
  }

  .search-field {
    margin-left: 1vw;
    font-size: 2vw;
    line-height: 2.5vw;
    color: rgba(51, 226, 230, 0.9);
    background-color: rgba(1, 0, 32, 0.4);
    border: 0.1vw solid rgba(51, 226, 230, 0.5);
    border-radius: 0.5vw;
    outline: none;
    width: 15vw;
    transition: all 0.15s ease-in-out;
  }

  .search-field::placeholder {
    color: rgba(51, 226, 230, 0.5);
  }

  .search-field:focus {
    width: 25vw;
  }

  @media only screen and (max-width: 600px) {
    .loading {
      font-size: 1em;
      line-height: 1em;
    }

    .filters {
      width: 95vw;
      margin: 0 2.5vw;
      justify-content: space-between;
    }

    .filter {
      padding: 0.5em;
    }

    .filter-image {
      height: 1.5em;
    }

    .sort-genres-filters {
      flex-direction: row-reverse;
    }

    .search-field {
      font-size: 1em;
      line-height: 1.5em;
      margin-left: 0.5em;
      width: 30vw;
    }

    .search-field:focus {
      width: 50vw;
    }

    .genres-list {
      left: -0.2vw;
      top: -0.2vw;
      bottom: auto;
      right: auto;
      grid-template-columns: 40vw;
      row-gap: 0.75em;
      padding: 0.5em;
    }

    .genre {
      font-size: 0.9em;
      line-height: 1.5em;
    }
  }
</style>
