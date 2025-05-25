<script>
  export let onClick = () => {};
</script>

<button class="flex void-btn" on:click={onClick} aria-label="Reset">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-100 -100 200 200"
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

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    width: 1.5rem;
    padding: 0;
    fill: $soft-white;
    stroke: $soft-white;

    &:hover,
    &:active,
    &:focus {
      fill: $cyan;
      stroke: $cyan;
      transform: rotate(300deg);
      @include bright;
    }
  }
</style>
