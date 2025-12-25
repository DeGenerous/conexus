<script lang="ts">
  let {
    onclick = () => {},
    text = '',
    active = false,
    control = true,
    accentColor = '',
  }: {
    onclick: () => void;
    text: string;
    active?: boolean;
    control?: boolean;
    accentColor?: string;
  } = $props();
</script>

<button
  id={control ? 'step-control' : ''}
  {onclick}
  class="void-btn flex"
  class:active
  aria-label="Back"
  style="--accent-color: {accentColor}"
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200">
    <circle r="100" />
  </svg>
  <h5 class="flex">{text}</h5>
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    width: 2rem;
    fill: currentColor;
    position: relative;
    font-family: inherit;

    h5 {
      height: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: inherit;
      color: var(--accent-color);
      z-index: 2;
      @include font(caption);

      @include respond-up(small-desktop) {
        @include font(body);
      }
    }

    &.active {
      fill: var(--accent-color);

      h5 {
        color: inherit;
      }
    }

    svg {
      z-index: 1;
    }

    &:hover,
    &:focus-visible,
    &:active {
      @include scale;

      h5 {
        transform: translate(-50%, -50%) scale(1.1);
      }
    }
  }
</style>
