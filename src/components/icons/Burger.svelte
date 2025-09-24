<script lang="ts">
  let { expanded = false }: { expanded?: boolean } = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  class:expanded
  aria-hidden="true"
>
  <line class="line top" x1="4" y1="7" x2="20" y2="7" />
  <line class="line middle" x1="4" y1="12" x2="20" y2="12" />
  <line class="line bottom" x1="4" y1="17" x2="20" y2="17" />
</svg>

<style lang="scss">
  @use "/src/styles/mixins" as *;

  svg {
    width: 2.5rem;
    fill: none;
    stroke: $cyan;
    stroke-width: 2;
    stroke-linecap: round;
  }

  .line {
    transition: transform 0.2s ease, opacity 0.2s ease;
    transform-origin: 12px 12px;
  }

  svg.expanded {
    .top {
      transform: translate(-4px, 3px) rotate(45deg);
    }

    .middle {
      opacity: 0;
    }

    .bottom {
      transform: translate(-4px, -4px) rotate(-45deg);
    }
  }
</style>
