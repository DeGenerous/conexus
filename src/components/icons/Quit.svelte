<script lang="ts">
  export let onClick = () => {};
  export let voidBtn: boolean = false;

  let quitSvgFocus: boolean = false;
</script>

<button
  class="flex"
  class:focused={quitSvgFocus}
  class:void-btn={voidBtn}
  on:click|stopPropagation={onClick}
  on:pointerover={() => (quitSvgFocus = true)}
  on:pointerout={() => (quitSvgFocus = false)}
  aria-label="Back"
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200">
    <defs>
      <mask id="quit-svg-mask">
        <circle r="100" fill="white" />
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

    <circle r="100" mask="url(#quit-svg-mask)" />
  </svg>
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    fill: $soft-cyan;
    
    &.void-btn {
      fill: $light-blue;
    }

    &.focused {
      fill: $cyan;

      svg {
        transform: scale(1.05);
      }
    }
  }
</style>
