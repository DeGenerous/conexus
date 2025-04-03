<script lang="ts">
  export let genres: Genre[];
  export let filteredCategories: CategoriesInSection[] = [];
  export let categories: CategoriesInSection[] = [];
  export let searchField: string = '';
  export let isSorting: boolean = false;
  export let handleSearch: () => void;
  export let getGenreTopics: (genre: string) => Promise<CategoriesInSection[]>;

  let sortedCategories: CategoriesInSection[] = [];

  const handleSorting = () => {
    sortedCategories = filteredCategories.map((cat: CategoriesInSection) => {
      // Clone the category and topics to avoid mutating the original
      return {
        ...cat,
        topics: [...cat.topics].sort((a, b) => {
          const firstTopic = (
            a.topic_name.charAt(0).toUpperCase() + a.topic_name.slice(1)
          ).trim();
          const secondTopic = (
            b.topic_name.charAt(0).toUpperCase() + b.topic_name.slice(1)
          ).trim();
          // Sorting all topics in the category alphabetically
          if (firstTopic < secondTopic) return -1;
          if (firstTopic > secondTopic) return 1;
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
    filteredCategories = await getGenreTopics(genre);
    if (isSorting) handleSorting();
  }

  const resetGenres = () => {
    if (!activeGenre) return;
    activeGenre = '';
    filteredCategories = categories.map((cat) => ({
      ...cat,
      topics: [...cat.topics], // Ensure a fresh copy of topics
    }));
    if (isSorting) handleSorting();
  };
</script>

<div class="sort-genres-filters">
  <div
    class="filter filter-wrapper blur"
    style={activeGenre
      ? 'background-color: rgba(56, 117, 250, 0.9); box-shadow: 0 0 0.5vw rgba(51, 226, 230, 0.5);'
      : ''}
  >
    {#if activeGenre}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-100 -100 200 200"
        class="reset-svg filter-image"
        fill="#dedede"
        stroke="#dedede"
        stroke-width="20"
        stroke-linecap="round"
        stroke-linejoin="round"
        on:click={resetGenres}
        on:keydown={(e) => e.key === 'Enter' && resetGenres()}
        role="button"
        tabindex="0"
      >
        <path
          d="
              M 70 -50
              A 85 85 0 1 0 85 0
            "
          fill="none"
        />
        <polygon
          points="
              70 -50 60 -90 30 -55
            "
        />
      </svg>
    {:else}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-100 -100 200 200"
        class="filter-svg filter-image"
        fill="#dedede"
        stroke="#dedede"
        stroke-width="6"
        stroke-linejoin="round"
      >
        <path
          d="
              M -25 60
              L -25 -15
              L -95 -85
              L -95 -95
              L 95 -95
              L 95 -85
              L 25 -15
              L 25 95
              L 20 95
              Z
            "
        />
      </svg>
    {/if}
    <select class="selector" bind:value={activeGenre}>
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
        getGenre(activeGenre);
        // if (activeGenre) {
        // } else {
        //   filteredCategories = categories.map((cat) => ({
        //     ...cat,
        //     topics: [...cat.topics], // Ensure a fresh copy of topics
        //   }));
        // }
      }
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

<style>
  .sort-genres-filters {
    display: flex;
    flex-flow: row nowrap;
    gap: 1vw;
  }
  .sort-genres-filters {
    gap: 1em;
    justify-content: space-between;
  }
</style>
