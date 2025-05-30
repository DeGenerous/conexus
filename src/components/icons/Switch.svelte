<script lang="ts">
  export let onClick = () => {};
  export let disabled: boolean = false;
  export let right: boolean = false;

  let switchSvgFocus: boolean = false;
</script>

<button
  class="void-btn flex"
  class:focused={switchSvgFocus}
  class:right
  on:click|stopPropagation={onClick}
  on:pointerover={() => (switchSvgFocus = true)}
  on:pointerout={() => (switchSvgFocus = false)}
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

    <circle r="100" mask="url(#back-step-arrow-svg-mask{right ? '-right' : ''})"/>
  </svg>
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    fill: $light-blue;

    &.focused:not(&:disabled) {
      fill: $cyan;

      svg {
        circle {
          transform: scale(1.05);
        }

        g {
          transform: scale(1.2);
        }
      }
    }

    &.right:not(&:disabled) {
      &.focused {
        svg {
          g {
            transform: scale(1.2) rotate(180deg) !important;
          }
        }
      }
    }

    &:disabled {
      opacity: 0.25;
    }
  }
</style>
