<script lang="ts">
  export let onClick = () => {};
</script>

<button class="void-btn flex" on:click={onClick} aria-label="Zoom out">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-100 -100 200 200"
    class="search-svg filter-image"
    stroke-width="15"
    stroke-linecap="round"
  >
    <circle cx="-20" cy="-20" r="70" />
    <line x1="34" y1="34" x2="85" y2="80" stroke-width="25" />
    <line x1="-55" y1="-20" x2="15" y2="-20" />
  </svg>
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    stroke: $light-blue;
    width: 1.75rem;

    &:hover,
    &:active,
    &:focus {
      stroke: $cyan;
      @include scale;
    }
  }
</style>
