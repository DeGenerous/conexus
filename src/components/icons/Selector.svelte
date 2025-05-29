<script lang="ts">
  export let focused: any = false;
</script>

<svg
  class:focused
  xmlns="http://www.w3.org/2000/svg"
  viewBox="-100 -100 200 200"
  fill="rgb(51, 226, 2305)"
  stroke="rgb(51, 226, 230)"
  stroke-width="20"
  stroke-linecap="round"
  stroke-linejoin="round"
  >
  <polygon points="-40 -90 -40 90 50 0"/>
</svg>

<style lang="scss">
  @use "/src/styles/mixins" as *;

  svg {
    width: 1.5rem;
    flex: none;

    &.focused {
      polygon {
        transform: scaleX(1.5);
      }
    }
  }
</style>
