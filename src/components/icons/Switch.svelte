<script lang="ts">
  let {
    onclick = () => {},
    disabled = false,
    right = false,
  }: {
    onclick: () => void;
    disabled: boolean;
    right?: boolean;
  } = $props();
</script>

<button
  class="void-btn flex"
  class:right
  {onclick}
  aria-label="Switch"
  {disabled}
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200">
    <defs>
      <mask id="back-step-arrow-svg-mask{right ? '-right' : ''}">
        <circle r="100" fill="white" />
        <g fill="black" stroke="black" transform={right ? 'rotate(180)' : ''}>
          <polygon
            points="-50 0 -5 -45 -5 45"
            stroke-width="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <rect x="-5" y="-18" width="56" height="36" rx="5" />
        </g>
      </mask>
    </defs>

    <circle
      r="100"
      mask="url(#back-step-arrow-svg-mask{right ? '-right' : ''})"
    />
  </svg>
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    width: 2rem;
    fill: $light-blue;

    &:hover:not(&:disabled),
    &:active:not(&:disabled),
    &:focus:not(&:disabled) {
      fill: $cyan;
      @include scale;

      svg g {
        transform: scale(1.2);
      }
    }

    &.right:not(&:disabled) {
      &:hover,
      &:active,
      &:focus {
        svg g {
          transform: scale(1.2) rotate(180deg) !important;
        }
      }
    }

    &:disabled {
      opacity: 0.25;
    }
  }
</style>
