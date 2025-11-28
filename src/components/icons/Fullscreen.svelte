<script lang="ts">
  import { game } from '@stores/conexus.svelte';
</script>

<button
  class="void-btn flex"
  onclick={() => (game.fullscreen = !game.fullscreen)}
  aria-label="Fullscreen"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-100 -100 200 200"
    stroke-width="20"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <g opacity={game.fullscreen ? 0 : 1}>
      <g id="fullscreen-arrow">
        <line x1="0" y1="0" x2="-55" y2="-55" />
        <polygon points="-85 -32 -85 -85 -32 -85" stroke-width="12" />
      </g>
      <use href="#fullscreen-arrow" transform="rotate(90)" />
      <use href="#fullscreen-arrow" transform="rotate(180)" />
      <use href="#fullscreen-arrow" transform="rotate(270)" />
    </g>

    <g opacity={game.fullscreen ? 1 : 0}>
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
    width: 2rem;
    fill: $light-blue;
    stroke: $light-blue;

    &:hover,
    &:focus-visible,
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
