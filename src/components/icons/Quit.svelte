<script lang="ts">
  let {
    onclick = () => {},
    voidBtn = false,
  }: {
    onclick: () => void;
    voidBtn?: boolean;
  } = $props();
</script>

<button class="flex" class:void-btn={voidBtn} {onclick} aria-label="Back">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200">
    <defs>
      <mask id="quit-svg-mask">
        <circle r="100" fill="white" />
        <path
          d="M 50 0 L -50 0 L 0 -50 M -50 0 L 0 50"
          fill="none"
          stroke="black"
          stroke-width="25"
          stroke-linecap="round"
          stroke-linejoin="round"
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
      width: 2rem;
      fill: $light-blue;
    }

    &:hover,
    &:active,
    &:focus {
      fill: $cyan;

      svg {
        transform: scale(1.1);

        #quit-svg-mask path {
          transform: scale(1.2);
        }
      }
    }
  }
</style>
