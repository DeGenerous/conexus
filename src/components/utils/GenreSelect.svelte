<script lang="ts">
  export let genres: Genre[];
  export let activeGenre: string;
  export let resetGenres: () => void;
</script>

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
