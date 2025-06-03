<script lang="ts">
  export let focused: Nullable<number | boolean> = null;
  export let disabled: boolean = false;
  export let hideForMobiles: boolean = false;
  export let glowing: boolean = false;
  export let color: string = '#33e2e6';
  export let selectorSize: number = 1.5;
</script>

<svg
  class:focused
  class:disabled={disabled && !focused}
  class:pc-only={hideForMobiles}
  xmlns="http://www.w3.org/2000/svg"
  viewBox="-100 -100 200 200"
  stroke-width="20"
  stroke-linecap="round"
  stroke-linejoin="round"
  style:fill={color}
  style:stroke={color}
  style:width="{selectorSize}rem"
  style:height="{selectorSize}rem"
>
  <polygon points="-40 -90 -40 90 50 0" />
  {#if glowing}
    <animate
      attributeName="fill"
      values="rgb(51,226,230);rgb(160,120,255);rgb(56,117,250);rgb(51,226,230)"
      dur="15s"
      repeatCount="indefinite"
      begin="-1.5s"
    />
    <animate
      attributeName="stroke"
      values="rgb(51,226,230);rgb(160,120,255);rgb(56,117,250);rgb(51,226,230)"
      dur="15s"
      repeatCount="indefinite"
      begin="-1.5s"
    />
  {/if}
</svg>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  svg {
    flex: none;

    &.focused {
      polygon {
        transform: scaleX(1.5);
      }
    }
  }
</style>
