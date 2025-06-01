<script lang="ts">
  export let onClick = () => {};
  export let volumeMuted: boolean = false;
</script>

<button
  class="void-btn flex-row"
  class:muted={volumeMuted}
  on:click|stopPropagation={onClick}
  aria-label="Adjust music"
>
  <p>MUSIC</p>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-100 -100 200 200"
    stroke-linejoin="round"
    stroke-linecap="round"
  >
    <defs>
      <mask id="volume-svg-top-mask">
        <rect
          x="-100"
          y="-100"
          width="200"
          height="200"
          fill="white"
          style="transform: {volumeMuted ? 'translateX(-200px)' : 'none'}"
        />
      </mask>
      <mask id="volume-svg-bottom-mask">
        <rect
          x="100"
          y="-100"
          width="200"
          height="200"
          fill="white"
          style="transform: {volumeMuted ? 'translateX(-200px)' : 'none'}"
        />
      </mask>
      <mask id="volume-svg-crossed-out-mask">
        <g fill="white" stroke="white">
          <polygon points="-40 -50 85 -85 85 -55 -40 -20" stroke-width="15" />
          <line x1="-35" y1="-40" x2="-35" y2="68" stroke-width="25" />
          <line x1="80" y1="-60" x2="80" y2="44" stroke-width="25" />
          <ellipse cx="-58" cy="70" rx="35" ry="22" />
          <ellipse cx="57" cy="46" rx="35" ry="22" />
        </g>
        <line
          x1="75"
          y1="-95"
          x2="-95"
          y2="75"
          stroke="black"
          stroke-width="15"
        />
      </mask>
    </defs>

    <g mask="url(#volume-svg-top-mask)">
      <polygon points="-40 -50 85 -85 85 -55 -40 -20" stroke-width="15" />
      <line x1="-35" y1="-40" x2="-35" y2="68" stroke-width="25" />
      <line x1="80" y1="-60" x2="80" y2="44" stroke-width="25" />
      <ellipse cx="-58" cy="70" rx="35" ry="22" />
      <ellipse cx="57" cy="46" rx="35" ry="22" />
    </g>

    <g mask="url(#volume-svg-bottom-mask)">
      <g mask="url(#volume-svg-crossed-out-mask)">
        <polygon points="-40 -50 85 -85 85 -55 -40 -20" stroke-width="15" />
        <line x1="-35" y1="-40" x2="-35" y2="68" stroke-width="25" />
        <line x1="80" y1="-60" x2="80" y2="44" stroke-width="25" />
        <ellipse cx="-58" cy="70" rx="35" ry="22" />
        <ellipse cx="57" cy="46" rx="35" ry="22" />
      </g>
      <line x1="90" y1="-90" x2="-90" y2="90" stroke-width="15" />
    </g>
  </svg>
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    fill: $light-blue;
    stroke: $light-blue;
    color: $light-blue;
    gap: 0.5rem;

    &:hover:not(&.muted),
    &:active:not(&.muted),
    &:focus:not(&.muted) {
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
    }
  }
</style>
