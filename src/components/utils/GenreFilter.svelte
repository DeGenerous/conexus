<script lang="ts">
  import ResetSVG from '@components/icons/Reset.svelte';
  import FilterSVG from '@components/icons/Filter.svelte';

  let {
    genres,
    activeGenre = $bindable(),
    resetGenres,
    disabled = false,
  }: {
    genres: Genre[];
    activeGenre: string;
    resetGenres: () => void;
    disabled?: boolean;
  } = $props();
</script>

<div class="flex-row blur pad-8" class:active={activeGenre}>
  {#if activeGenre}
    <ResetSVG onclick={resetGenres} />
  {:else}
    <FilterSVG />
  {/if}
  <select class:active={activeGenre} bind:value={activeGenre} {disabled}>
    <option value="" selected={true} disabled hidden>Select genre</option>
    {#each genres as genre (genre.id)}
      <option value={genre.name}>{genre.name}</option>
    {/each}
  </select>
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  div {
    gap: 0.5rem;
    width: 100%;
    transition: background-color 0.3s ease;
    @include blue(0.75);
    @include gray-border;

    &.active {
      @include deep-green;
    }

    select {
      width: 100%;
      min-height: 2.75rem !important;
    }

    @include respond-up(tablet) {
      border-radius: 0.5rem;

      &,
      select {
        width: auto;
      }
    }
  }
</style>
