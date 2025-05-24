<script lang="ts">
  export let copySvgFocus: Nullable<string> = null;
  export let data: string = '';
</script>

<svg
  class:copy-hover={copySvgFocus === data}
  xmlns="http://www.w3.org/2000/svg"
  viewBox="-100 -100 200 200"
  fill="rgba(255, 255, 255, 0)"
  stroke="rgba(255, 255, 255, 0.75)"
  stroke-width="15"
  stroke-linejoin="round"
  stroke-linecap="round"
>
  <defs>
    <mask id="copy-checkmark">
      <rect
        x="-45"
        y="-60"
        width="130"
        height="150"
        fill="white"
        stroke="white"
      />
      <path
        d="
            M -10 10
            L 10 40
            L 50 -20
          "
        fill="none"
        stroke="black"
      />
    </mask>
  </defs>
  <path
    d="
        M 40 -67
        L 40 -90
        L -90 -90
        L -90 60
        L -52 60
      "
    fill="none"
  />
  <rect x="-45" y="-60" width="130" height="150" mask="url(#copy-checkmark)" />
</svg>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  svg {
    width: 1.25rem;

    &.copy-hover {
      fill: $dark-green;
      stroke: $dark-green;
      @include bright(50%);
    }
  }
</style>
