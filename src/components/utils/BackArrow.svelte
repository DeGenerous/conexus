<script lang="ts">
  export let href: string = './';

  let backArrowSvgFocus: boolean = false;
</script>

<a
  class="top-left-icon flex fade-in"
  href={href === 'back' ? 'javascript:window.history.back()' : href}
  aria-label="Back arrow"
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200">
    <defs>
      <mask id="back-arrow-svg-mask">
        <circle r="95" fill="white" />
        <path
          d="
            M -14 -30
            L -14 -64
            L -76 -9
            L -14 48
            L -14 12
            Q 36 14 60 52
            Q 60 -26 -12 -30
            Z
          "
          transform={backArrowSvgFocus ? 'scale(1.1)' : ''}
          fill="black"
          stroke="black"
          stroke-width="4"
          stroke-linejoin="round"
        />
      </mask>
    </defs>
    <circle
      r="95"
      mask="url(#back-arrow-svg-mask)"
      on:pointerover={() => (backArrowSvgFocus = true)}
      on:pointerout={() => (backArrowSvgFocus = false)}
    />
  </svg>
</a>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  a {
    fill: $light-blue;

    &:hover,
    &:active,
    &:focus {
      fill: $cyan;
    }

    svg {
      width: inherit;
      border-radius: inherit;
    }
  }
</style>
