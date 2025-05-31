<script lang="ts">
  import { fullscreen } from '@stores/conexus';

  $effect(() => {
    document.onfullscreenchange = () => {
      if ($fullscreen !== !!document.fullscreenElement)
        fullscreen.set(!!document.fullscreenElement);
    };
  });

  $effect(() => {
    if ($fullscreen) document.documentElement.requestFullscreen();
    else if (document.fullscreenElement) document.exitFullscreen();
  });
</script>

<button
  class="void-btn flex"
  onclick={() => ($fullscreen = !$fullscreen)}
  aria-label="Fullscreen"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-100 -100 200 200"
    stroke-width="20"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <g opacity={$fullscreen ? 0 : 1}>
      <g id="fullscreen-arrow">
        <line x1="0" y1="0" x2="-55" y2="-55" />
        <polygon points="-85 -32 -85 -85 -32 -85" stroke-width="12" />
      </g>
      <use href="#fullscreen-arrow" transform="rotate(90)" />
      <use href="#fullscreen-arrow" transform="rotate(180)" />
      <use href="#fullscreen-arrow" transform="rotate(270)" />
    </g>

    <g opacity={$fullscreen ? 1 : 0}>
      <g id="windowed-arrow">
        <line x1="-90" y1="-90" x2="-50" y2="-50" />
        <polygon
          points="-85 -32 -32 -32 -32 -85"
          stroke-width="12"
          transform="translate(10 10)"
        />
      </g>
      <use href="#windowed-arrow" transform="rotate(90)" />
      <use href="#windowed-arrow" transform="rotate(180)" />
      <use href="#windowed-arrow" transform="rotate(270)" />
    </g>
  </svg>
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    fill: $light-blue;
    stroke: $light-blue;
    width: 1.75rem;

    &:hover,
    &:focus,
    &:active {
      fill: $cyan;
      stroke: $cyan;
      @include scale;

      #windowed-arrow {
        transition: transform 0.3s linear;
        transform: translate(2.5%, 2.5%);
      }

      #fullscreen-arrow {
        transition: transform 0.3s linear;
        transform: translate(-2.5%, -2.5%);
      }
    }
  }
</style>
