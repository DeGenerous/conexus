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
  class="void-btn flex-row"
  class:muted={disabled}
  {onclick}
  onpointerover={() => (svgFocus = true)}
  onpointerout={() => (svgFocus = false)}
  aria-label="Replay"
  {disabled}
>
  <p>REPLAY</p>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-100 -100 200 200"
    class="replay-svg"
    fill="#dedede"
    stroke="#dedede"
    stroke-width="20"
    stroke-linejoin="round"
    stroke-linecap="round"
  >
    <g style="transform: {svgFocus && !disabled ? 'rotate(-15deg)' : 'none'}">
      <path d="M -70 -40 A 80 80 0 1 1 -50 50" fill="none" />
      <polygon points="-70 -40 -70 -80 -30 -50" />
    </g>
    <line
      x1="0"
      y1="-5"
      x2="0"
      y2="-50"
      style="transform: {svgFocus && !disabled ? 'rotate(-360deg)' : 'none'}"
    />
    <line
      x1="2.5"
      y1="-2.5"
      x2="20"
      y2="10"
      style="transform: {svgFocus && !disabled ? 'rotate(-30deg)' : 'none'}"
    />
  </svg>
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    fill: $light-blue;
    stroke: $light-blue;
    color: $light-blue;
    gap: 0.5rem;
    width: 2rem;

    &:hover:not(&.muted),
    &:active:not(&.muted),
    &:focus-visible:not(&.muted) {
      fill: $cyan;
      stroke: $cyan;
      color: $cyan;
      @include scale;
    }

    &.muted {
      opacity: 0.5;
    }

    p {
      display: none;

      @include respond-up(tablet) {
        display: block;
      }
    }

    @include respond-up(tablet) {
      fill: $white;
      stroke: $white;
      color: $white;
      width: auto;
    }
  }
</style>
