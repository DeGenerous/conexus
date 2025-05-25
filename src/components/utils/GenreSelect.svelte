<script lang="ts">
  export let genres: Genre[];
  export let activeGenre: string;
  export let resetGenres: () => void;
  export let disabled: boolean = false;
</script>

<div class="flex-row blur pad-8 round-8 shad" class:active={activeGenre}>
  {#if activeGenre}
    <button
      class="flex void-btn"
      on:click={resetGenres}
      aria-label="Reset"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-100 -100 200 200"
        class="reset-svg"
        fill="#dedede"
        stroke="#dedede"
        stroke-width="20"
        stroke-linecap="round"
        stroke-linejoin="round"
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
    </button>
  {:else}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-100 -100 200 200"
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
  <select bind:value={activeGenre} {disabled}>
    <option value="" selected={true} disabled hidden>Select genre</option>
    {#each genres as genre (genre.id)}
      <option value={genre.name}>{genre.name}</option>
    {/each}
  </select>
</div>

<style lang="scss">
  @use "/src/styles/mixins" as *;

  div {
    gap: 0.5rem;
    width: 100%;
    @include light-blue(0.5);

    svg {
      width: 100%;
      max-width: 1.5rem;
    }

    button {
      width: 1.5rem;

      &:hover svg {
        stroke: $cyan;
      }
    }

    select {
      width: 100%;
    }

    @include respond-up(tablet) {
      &, select {
        width: auto;
      }
    }
  }
</style>
