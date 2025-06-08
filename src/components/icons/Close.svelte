<script lang="ts">
  let {
    onclick = () => {},
    voidBtn = false,
  }: {
    onclick: () => void;
    voidBtn?: boolean;
  } = $props();
</script>

<button class="flex" class:void-btn={voidBtn} {onclick} aria-label="Close">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-100 -100 200 200"
    stroke-width="30"
    stroke-linecap="round"
    style:width={voidBtn ? '1.75rem' : ''}
  >
    <path d="M -65 -65 L 65 65 M -65 65 L 65 -65" fill="none" />
  </svg>
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    stroke: $red;

    &:active,
    &:hover,
    &:focus {
      svg {
        @include scale(1.2);
        @include bright;
      }
    }
  }
</style>
