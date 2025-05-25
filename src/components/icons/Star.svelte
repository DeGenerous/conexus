<script lang="ts">
  export let focused: boolean = false;
</script>

<svg class:focused xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path
    d="m12 3 2.23 6.88h7.23l-5.85 4.24L17.85 21 12 16.75 6.15 21l2.24-6.88-5.85-4.24h7.23L12 3z"
  >
  </path>
</svg>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  svg {
    fill: $dark-blue;
    stroke: $dark-blue;
    width: 2rem;

    &.focused {
      fill: $cyan;
      stroke: $cyan;
    }
  }
</style>
