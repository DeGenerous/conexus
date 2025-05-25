<script lang="ts">
  import ResetSVG from '@components/icons/Reset.svelte';
  import FilterSVG from '@components/icons/Filter.svelte';

  export let genres: Genre[];
  export let activeGenre: string;
  export let resetGenres: () => void;
  export let disabled: boolean = false;
</script>

<div class="flex-row blur pad-8 round-8 shad" class:active={activeGenre}>
  {#if activeGenre}
    <ResetSVG onClick={resetGenres} />
  {:else}
    <FilterSVG />
  {/if}
  <select bind:value={activeGenre} {disabled}>
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
    @include light-blue(0.5);

    select {
      width: 100%;
    }

    @include respond-up(tablet) {
      &,
      select {
        width: auto;
      }
    }
  }
</style>
