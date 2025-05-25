<script lang="ts">
  export let onClick = () => {};

  let closeSvgFocus: boolean = false;
</script>

<button
  on:click|stopPropagation={onClick}
  on:pointerover={() => (closeSvgFocus = true)}
  on:pointerout={() => (closeSvgFocus = false)}
  class:focused={closeSvgFocus}
  aria-label="Close"
>
  <svg
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
</button>

<style lang="scss">
  @use "/src/styles/mixins" as *;

  button {
    stroke: $red;

    &.focused svg {
      @include scale(1.2);
      @include bright;
    }
  }
</style>
