<script lang="ts">
  import SearchSVG from '@components/icons/Search.svelte';
  import LoadingSVG from '@components/icons/Loading.svelte';

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
    <LoadingSVG />
  {:else}
    <SearchSVG onClick={handleSearchFocus} {searchSvgFocus} />
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
  @use '/src/styles/mixins' as *;

  div {
    gap: 0.5rem;
    width: 100%;
    @include light-blue(0.5);

    input {
      text-align: left;
      width: 100%;
      @include dark-blue(0.75);

      &:focus {
        @include box-glow;
      }
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
