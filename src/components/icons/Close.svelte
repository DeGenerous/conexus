<script lang="ts">
  export let closeSvgFocus: boolean = false;
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="-100 -100 200 200"
  stroke="rgba(255, 60, 64, 0.85)"
  stroke-width="30"
  stroke-linecap="round"
  style="
      transform: {closeSvgFocus ? 'scale(1.2);' : 'none'}
      stroke: {closeSvgFocus ? 'rgb(255, 60, 64)' : 'rgba(255, 60, 64, 0.85)'}
    "
>
  <path
    d="
        M -65 -65
        L 65 65
        M -65 65
        L 65 -65
      "
    fill="none"
  />
</svg>
