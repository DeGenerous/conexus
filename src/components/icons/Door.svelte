<script lang="ts">
  export let state: 'inside' | 'outside';
  export let signOutSvgFocus: boolean = false;
  export let signInSvgFocus: boolean = false;

  export let bigIcon: boolean = false;
  let width: number;
</script>

<svelte:window bind:innerWidth={width} />

{#if state === 'outside'}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-100 -100 200 200"
    class="door-svg"
    class:big-icon={bigIcon}
    fill="none"
    stroke="#dedede"
    stroke-width="12"
    stroke-linecap="round"
    stroke-linejoin="round"
    style="stroke: {signOutSvgFocus ? 'rgb(51, 226, 230)' : '#dedede'};"
    >
    <defs>
      <mask id="door-svg-mask">
        <rect
          x="-25"
          y="-75"
          width="100"
          height="150"
          rx="15"
          fill="none"
          stroke="white"
        />
        <line
          x1="-25"
          y1="-35"
          x2="-25"
          y2="35"
          stroke="black"
          stroke-width="14"
          stroke-linecap="square"
        />
      </mask>
    </defs>

    <path
      style="transform: {signOutSvgFocus ? 'translateX(-7.5%)' : 'none'}"
      d="
        M 30 0
        L -80 0
        L -55 -25
        M -80 0
        L -55 25
      "
      fill="none"
    />
    <rect
      x="-25"
      y="-75"
      width="100"
      height="150"
      rx="15"
      mask="url(#door-svg-mask)"
    />
  </svg>
{:else if state === 'inside'}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-100 -100 200 200"
    class="door-svg"
    fill="none"
    stroke="#dedede"
    stroke-width="12"
    stroke-linecap="round"
    stroke-linejoin="round"
    style="stroke: {signInSvgFocus
      ? 'rgb(51, 226, 230)'
      : '#dedede'}"
    >
    <defs>
      <mask id="door-svg-mask">
        <rect
          x="-25"
          y="-75"
          width="100"
          height="150"
          rx="15"
          fill="none"
          stroke="white"
        />
        <line
          x1="-25"
          y1="-35"
          x2="-25"
          y2="35"
          stroke="black"
          stroke-width="14"
          stroke-linecap="square"
        />
      </mask>
    </defs>

    <path
      style="transform: {signInSvgFocus
        ? 'translateX(10%)'
        : 'none'}"
      d="
        M -80 0
        L 30 0
        L 5 -25
        M 30 0
        L 5 25
      "
      fill="none"
    />
    <rect
      x="-25"
      y="-75"
      width="100"
      height="150"
      rx="15"
      mask="url(#door-svg-mask)"
    />
  </svg>
{/if}