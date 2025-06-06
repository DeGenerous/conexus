<script lang="ts">
  let {
    onClick = () => {},
    text = '',
    active = false,
    control = true,
  }: {
    onClick: () => void;
    text: string;
    active: boolean;
    control?: boolean;
  } = $props();
</script>

<button
  id={control ? 'step-control' : ''}
  onclick={onClick}
  class="void-btn flex"
  class:active
  aria-label="Back"
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200">
    <circle r="100" />
  </svg>
  <h5 class="flex">{text}</h5>
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    fill: $light-blue;
    position: relative;
    font-family: inherit;

    h5 {
      height: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: inherit;
      z-index: 2;
      @include dark-blue(1, text);
    }

    svg {
      z-index: 1;
    }

    &.active {
      fill: $cyan !important;
    }

    &:hover,
    &:focus,
    &:active {
      fill: $cyan;
      @include scale;

      h5 {
        transform: translate(-50%, -50%) scale(1.1);
      }
    }
  }
</style>
