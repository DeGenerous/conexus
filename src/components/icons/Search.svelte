<script lang="ts">
  let {
    onClick = () => {},
    svgFocus = false,
  }: {
    onClick: () => void;
    svgFocus: boolean;
  } = $props();
</script>

<button
  class="flex void-btn"
  onclick={onClick}
  class:focused={svgFocus}
  aria-label="Search"
>
  <svg
    class="search-svg"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-100 -100 200 200"
    stroke-linecap="round"
    fill="none"
  >
    <circle cx="-20" cy="-20" r="70" stroke-width="15" />
    <line x1="34" y1="34" x2="85" y2="80" stroke-width="25" />
  </svg>
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    fill: none;
    stroke: $soft-white;

    svg {
      width: 1.75rem;
    }

    &:hover,
    &:active,
    &:focus {
      stroke: $cyan;
    }

    &.focused {
      stroke: $cyan;
      transform: scale(1.05) rotate(90deg);
    }
  }
</style>
