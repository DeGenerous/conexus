<script lang="ts">
  let {
    onclick = () => {},
    disabled = false,
    text = '',
    voidBtn = true,
    cta = false,
    color = 'green',
  }: {
    onclick: () => void;
    disabled?: boolean;
    text?: string;
    voidBtn?: boolean;
    cta?: boolean;
    color?: string;
  } = $props();

  let svgFocus = $state<boolean>(false);
</script>

<button
  class="flex-row"
  class:void-btn={voidBtn}
  class:cta
  class:green={color === 'green'}
  class:white={color === 'white'}
  class:fixed-width={text === ''}
  {onclick}
  onpointerover={() => {
    if (!disabled) svgFocus = true;
  }}
  onpointerout={() => {
    if (!disabled) svgFocus = false;
  }}
  aria-label="Back"
  {disabled}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-100 -100 200 200"
    stroke-width="15"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <polygon
      points="-26 -36 -26 36 36 0"
      transform={svgFocus ? 'scale(1.5)' : ''}
    />
    <circle r={svgFocus ? '0' : '90'} opacity={svgFocus ? '0' : '1'} />
  </svg>
  {text}
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    width: auto;
    fill: none;

    &.fixed-width {
      width: 2rem;
    }

    &:hover:not(&:disabled),
    &:active:not(&:disabled),
    &:focus-visible:not(&:disabled) {
      @include scale;
      @include bright;
    }

    &:disabled {
      opacity: 0.5;
      stroke: $dark-blue !important;

      svg > polygon {
        fill: $dark-blue !important;
      }
    }

    &.green {
      stroke: $green;

      svg > polygon {
        fill: $green;
      }
    }

    &.white {
      stroke: $soft-white;

      svg > polygon {
        fill: $soft-white;
      }

      &:hover:not(&:disabled),
      &:active:not(&:disabled),
      &:focus-visible:not(&:disabled) {
        stroke: $cyan;

        svg > polygon {
          fill: $cyan;
        }
      }
    }
  }
</style>
