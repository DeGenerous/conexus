<script lang="ts">
  let {
    onclick = () => {},
    muted = false,
  }: {
    onclick: () => void;
    muted: boolean;
  } = $props();

  let svgFocus = $state<boolean>(false);
</script>

<button
  class="void-btn flex-row"
  class:muted
  {onclick}
  onpointerover={() => {
    if (!muted) svgFocus = true;
  }}
  onpointerout={() => {
    if (!muted) svgFocus = false;
  }}
  aria-label="Adjust voice"
>
  <p>VOICE</p>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-100 -100 200 200"
    stroke-width="15"
    stroke-linecap="round"
  >
    <defs>
      <mask id="voice-svg-top-mask">
        <rect
          x="-100"
          y="-100"
          width="200"
          height="200"
          fill="white"
          style="transform: {muted ? 'translateX(-200px)' : 'none'}"
        />
      </mask>
      <mask id="voice-svg-bottom-mask">
        <rect
          x="100"
          y="-100"
          width="200"
          height="200"
          fill="white"
          style="transform: {muted ? 'translateX(-200px)' : 'none'}"
        />
      </mask>
      <mask id="voice-svg-crossed-out-mask">
        <g fill="white" stroke="white">
          <rect
            x="-35"
            y="-90"
            width="70"
            height="125"
            rx="100"
            ry="40"
            stroke="none"
          />
          <path d=" M -55 -10 C -60 74 60 74 55 -10" fill="none" />
          <path d="M 0 55 L 0 85 M 25 85 L -25 85" fill="none" />
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

    <g mask="url(#voice-svg-top-mask)">
      <rect
        x="-35"
        y="-90"
        width="70"
        height="125"
        rx="100"
        ry="40"
        stroke="none"
      />
      <path
        d="M -55 -10 C -60 74 60 74 55 -10"
        fill="none"
        style="transform: {svgFocus ? 'scaleX(-1)' : 'none'}"
      />
      <path d="M 0 55 L 0 85 M 25 85 L -25 85" fill="none" />
    </g>

    <g mask="url(#voice-svg-bottom-mask)">
      <g mask="url(#voice-svg-crossed-out-mask)">
        <rect
          x="-35"
          y="-90"
          width="70"
          height="125"
          rx="100"
          ry="40"
          stroke="none"
        />
        <path d="M -55 -10 C -60 74 60 74 55 -10" fill="none" />
        <path d="M 0 55 L 0 85 M 25 85 L -25 85" fill="none" />
      </g>
      <line x1="85" y1="-85" x2="-85" y2="85" stroke-width="15" />
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
