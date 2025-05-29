<script lang="ts">
  export let disabled: boolean = false;
  export let onClick = () => {};

  let playSvgFocus: boolean = false;
</script>

<button
  class="void-btn flex"
  on:click|stopPropagation={onClick}
  on:pointerover={() => {
    if (!disabled) playSvgFocus = true;
  }}
  on:pointerout={() => {
    if (!disabled) playSvgFocus = false;
  }}
  aria-label="Back"
  {disabled}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-100 -100 200 200"
    class="play-svg continue-shaping-btn"
    fill="none"
    stroke-width="15"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <polygon
      points="-26 -36 -26 36 36 0"
      transform={playSvgFocus ? 'scale(1.5)' : ''}
    />
    <circle r={playSvgFocus ? '0' : '90'} opacity={playSvgFocus ? '0' : '1'} />
  </svg>
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    fill: none;
    stroke: $green;

    svg > polygon {
      fill: $green;
    }

    &:hover:not(&:disabled),
    &:active:not(&:disabled),
    &:focus:not(&:disabled) {
      @include scale;
      @include bright;
    }

    &:disabled {
      opacity: 0.5;
      stroke: $dark-blue;

      svg > polygon {
        fill: $dark-blue;
      }
    }
  }
</style>
