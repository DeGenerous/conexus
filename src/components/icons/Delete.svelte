<script lang="ts">
  let {
    onclick = () => {},
    disabled = false,
  }: {
    onclick: () => void;
    disabled: boolean;
  } = $props();

  let svgFocus = $state<boolean>(false);
</script>

<button
  class="void-btn flex"
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
    fill="none"
    stroke-width="15"
    stroke-linecap="round"
  >
    <path
      d="M -35 -35 L 35 35 M -35 35 L 35 -35"
      transform={svgFocus ? 'scale(1.5)' : ''}
    />
    <circle r={svgFocus ? '0' : '90'} opacity={svgFocus ? '0' : '1'} />
  </svg>
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    fill: none;
    stroke: $red;

    &:hover:not(&:disabled),
    &:active:not(&:disabled),
    &:focus:not(&:disabled) {
      @include scale;
      @include bright;
    }

    &:disabled {
      opacity: 0.5;
      stroke: $dark-blue;
    }
  }
</style>
