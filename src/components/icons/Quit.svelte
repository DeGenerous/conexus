<script lang="ts">
  export let quitSvgFocus: boolean = false;
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200">
  <defs>
    <mask id="quit-svg-mask">
      <circle r="95" fill="white" />
      <path
        class="quit-svg-mask"
        d="
            M 50 0
            L -50 0
            L 0 -50
            M -50 0
            L 0 50
          "
        fill="none"
        stroke="black"
        stroke-width="25"
        stroke-linecap="round"
        stroke-linejoin="round"
        transform={quitSvgFocus ? 'scale(1.2)' : ''}
      />
    </mask>
  </defs>

  <circle
    style="
        transition: all 0.3s ease-in-out;
        transform: {quitSvgFocus ? 'scale(1.05);' : 'none'}
        fill: {quitSvgFocus ? 'rgb(51, 226, 230)' : 'rgba(51, 226, 230, 0.75)'}
      "
    fill="rgba(51, 226, 230, 0.75)"
    r="95"
    mask="url(#quit-svg-mask)"
  />
</svg>
