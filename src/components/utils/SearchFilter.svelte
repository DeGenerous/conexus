<script lang="ts">
  import SearchSVG from '@components/icons/Search.svelte';
  import LoadingSVG from '@components/icons/Loading.svelte';

  let {
    handleSearch,
    searchField = $bindable(),
    isSearching = $bindable(false),
    disabled = false,
  }: {
    handleSearch: () => void;
    searchField: string;
    isSearching: boolean;
    disabled: boolean;
  } = $props();

  let searchInput: HTMLInputElement | null;
  let svgFocus = $state<boolean>(false);

  const handleSearchFocus = () => {
    if (!searchInput) return;
    searchInput.focus();
  };
</script>

<div class="flex-row blur pad-8 round-8 shad" class:active={searchField}>
  {#if isSearching}
    <LoadingSVG />
  {:else}
    <SearchSVG onclick={handleSearchFocus} {svgFocus} />
  {/if}
  <input
    bind:this={searchInput}
    bind:value={searchField}
    oninput={handleSearch}
    onfocus={() => (svgFocus = true)}
    onblur={() => (svgFocus = false)}
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
