<script lang="ts">
  export let filteredCategories: CategoriesInSection[] = [];
  export let categories: CategoriesInSection[] = [];
  export let isSorting: boolean = false;
  export let handleSorting: () => void;
  export let resetGenres: () => void;
  export let searchSectionCategories: (
    searchField: string,
  ) => Promise<CategoriesInSection[]>;

  let debounceTimeout: NodeJS.Timeout;
  let sortedCategories: CategoryInSection[] = [];
  let searchField: string;
  let isSearching: boolean = false;

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
      filteredCategories = await searchSectionCategories(
        searchField.replace(/[^a-zA-Z ]/g, ''),
      );
      isSearching = false; // Stop searching after results are returned
      if (isSorting) handleSorting();
    }, 3750); // 3.75-second debounce delay
  };

  // SVG Icons
  let searchSvgFocus: boolean = false;
</script>

<div
  class="filter filter-wrapper blur"
  style={searchField
    ? 'background-color: rgba(56, 117, 250, 0.9); box-shadow: 0 0 0.5vw rgba(51, 226, 230, 0.5);'
    : ''}
>
  {#if isSearching}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      class="loading-svg filter-image"
      stroke="transparent"
      stroke-width="7.5"
      stroke-dasharray="288.5"
      stroke-linecap="round"
      fill="none"
    >
      <path
        d="
              M 50 96 a 46 46 0 0 1 0 -92 46 46 0 0 1 0 92
            "
        transform-origin="50 50"
      />
    </svg>
  {:else}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-100 -100 200 200"
      class="search-svg filter-image"
      stroke="#dedede"
      stroke-linecap="round"
      fill="none"
      on:click={handleSearchFocus}
      on:keydown={(e) => e.key === 'Enter' && handleSearchFocus()}
      role="button"
      tabindex="0"
      style="transform: {searchSvgFocus ? 'scale(1.05) rotate(90deg)' : 'none'}"
    >
      <circle cx="-20" cy="-20" r="70" stroke-width="15" />
      <line x1="34" y1="34" x2="85" y2="80" stroke-width="25" />
    </svg>
  {/if}
  <input
    bind:this={searchInput}
    bind:value={searchField}
    on:input={handleSearch}
    on:focus={() => (searchSvgFocus = true)}
    on:blur={() => (searchSvgFocus = false)}
    class="search-field"
    placeholder="Search story..."
  />
</div>

<style>
  .filter {
    padding: 0 1vw;
    color: #dedede;
  }

  .filter-image {
    height: 2vw !important;
    width: auto;
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

  @media only screen and (max-width: 600px) {
    .filter {
      border-radius: 0.5em;
      padding: 0.25em;
      width: 33%;
    }

    .filter-image {
      height: 1.5em !important;
      padding: 0.25em;
    }

    .filter-wrapper {
      padding: 0.25em;
      border-radius: 0.5em;
      gap: 0.25em;
      font-size: 1em;
      line-height: 1.5em;
      width: 100%;
    }

    .search-field {
      font-size: inherit;
      line-height: inherit;
      border-radius: 0.25em;
      padding: 0.25em 0.5em;
      width: 100% !important;
    }
  }
</style>
