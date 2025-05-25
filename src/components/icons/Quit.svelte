<script lang="ts">
  export let onClick = () => {};

  let quitSvgFocus: boolean = false;
</script>

<button
  on:click|stopPropagation={onClick}
  on:pointerover={() => (quitSvgFocus = true)}
  on:pointerout={() => (quitSvgFocus = false)}
  class:focused={quitSvgFocus}
  aria-label="Back"
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200">
    <defs>
      <mask id="quit-svg-mask">
        <circle r="95" fill="white" />
        <path
          class="quit-svg-mask"
          d="
              M 50 0
              L -50 0
              L 0 -50
              M -50 0
              L 0 50
            "
          fill="none"
          stroke="black"
          stroke-width="25"
          stroke-linecap="round"
          stroke-linejoin="round"
          transform={quitSvgFocus ? 'scale(1.2)' : ''}
        />
      </mask>
    </defs>

    <circle r="95" mask="url(#quit-svg-mask)" />
  </svg>
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    fill: $soft-cyan;

    &.focused {
      fill: $cyan;

      svg circle {
        transform: scale(1.05);
      }
    }
  }
</style>
