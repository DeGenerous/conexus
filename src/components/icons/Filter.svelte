<button class="flex void-btn" aria-label="Filter" disabled>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-100 -100 200 200"
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
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    fill: $soft-white;
    stroke: $soft-white;

    svg {
      width: 1rem;
    }
  }
</style>
