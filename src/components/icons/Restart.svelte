<script lang="ts">
  export let onClick = () => {};
  export let voiceMuted: boolean = false;

  let replaySvgFocuse: boolean = false;
</script>

<button
  class="void-btn flex"
  class:muted={voiceMuted}
  on:click|stopPropagation={onClick}
  on:pointerover={() => (replaySvgFocuse = true)}
  on:pointerout={() => (replaySvgFocuse = false)}
  aria-label="Replay"
  disabled={voiceMuted}
>
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
    <g
      style="transform: {replaySvgFocuse && !voiceMuted
        ? 'rotate(-15deg)'
        : 'none'}"
    >
      <path
        d="M -70 -40 A 80 80 0 1 1 -50 50"
        fill="none"
      />
      <polygon
        points="-70 -40 -70 -80 -30 -50"
      />
    </g>
    <line
      x1="0"
      y1="-5"
      x2="0"
      y2="-50"
      style="transform: {replaySvgFocuse && !voiceMuted
        ? 'rotate(-360deg)'
        : 'none'}"
    />
    <line
      x1="2.5"
      y1="-2.5"
      x2="20"
      y2="10"
      style="transform: {replaySvgFocuse && !voiceMuted
        ? 'rotate(-30deg)'
        : 'none'}"
    />
  </svg>
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    fill: $light-blue;
    stroke: $light-blue;

    &:hover:not(&.muted),
    &:active:not(&.muted),
    &:focus:not(&.muted) {
      fill: $cyan;
      stroke: $cyan;
      @include scale;
      @include bright;
    }

    &.muted {
      opacity: 0.5;
    }

    @include respond-up(small-desktop) {
      width: 1.5rem;
      fill: $white;
      stroke: $white;
    }
  }
</style>