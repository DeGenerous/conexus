<script lang="ts">
  export let searchField: string;
  export let handleSearch: () => void;
  export let isSearching: boolean = false;
  export let disabled: boolean = false;

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

  // SVG Icons
  let searchSvgFocus: boolean = false;
</script>

<div class="flex-row blur pad-8 round-8 shad" class:active={searchField}>
  {#if isSearching}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      class="loading-svg"
      stroke="transparent"
      stroke-width="7.5"
      stroke-dasharray="288.5"
      stroke-linecap="round"
      fill="none"
    >
      <path
        d="M 50 96 a 46 46 0 0 1 0 -92 46 46 0 0 1 0 92"
        transform-origin="50 50"
      />
    </svg>
  {:else}
    <button
      class="flex void-btn"
      on:click={handleSearchFocus}
      aria-label="Search"
    >
      <svg
        class="search-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-100 -100 200 200"
        stroke="#dedede"
        stroke-linecap="round"
        fill="none"
        style="transform: {searchSvgFocus ? 'scale(1.05) rotate(90deg)' : 'none'}"
      >
        <circle cx="-20" cy="-20" r="70" stroke-width="15" />
        <line x1="34" y1="34" x2="85" y2="80" stroke-width="25" />
      </svg>
    </button>
  {/if}
  <input
    bind:this={searchInput}
    bind:value={searchField}
    on:input={handleSearch}
    on:focus={() => (searchSvgFocus = true)}
    on:blur={() => (searchSvgFocus = false)}
    class="search-field"
    placeholder="Search story..."
    {disabled}
  />
</div>

<style lang="scss">
  @use "/src/styles/mixins" as *;

  div {
    gap: 0.5rem;
    width: 100%;
    @include light-blue(0.5);

    button {
      width: 1.5rem;

      svg {
        width: 100%;
        max-width: 1.5rem;
      }

      &:hover svg {
        stroke: $cyan;
      }
    }

    input {
      text-align: left;
      width: 100%;
      @include dark-blue(0.75);
    }

    @include respond-up(tablet) {
      & {
        width: auto;
      }

      input:focus {
        width: 30rem;
      }
    }
  }
</style>
