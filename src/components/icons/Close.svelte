<script lang="ts">
  export let closeSvgFocus: boolean = false;
</script>

<svg
  class:focused={closeSvgFocus}
  xmlns="http://www.w3.org/2000/svg"
  viewBox="-100 -100 200 200"
  stroke-width="30"
  stroke-linecap="round"
>
  <path
    d="
        M -65 -65
        L 65 65
        M -65 65
        L 65 -65
      "
    fill="none"
  />
</svg>

<style lang="scss">
  @use "/src/styles/mixins" as *;

  svg {
    stroke: $red;

    &.focused {
      @include scale(1.2);
      @include bright;
    }
  }
</style>
