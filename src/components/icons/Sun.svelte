<script lang="ts">
  let { onclick = () => {} }: { onclick: () => void } = $props();
</script>

<button class="void-btn flex" {onclick} aria-label="Zoom in">
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    stroke-linecap="round"
    stroke-width="1.5"
  >
    <path
      d="M5 12H1M23 12h-4M7.05 7.05 4.222 4.222M19.778 19.778 16.95 16.95M7.05 16.95l-2.828 2.828M19.778 4.222 16.95 7.05"
    />
    <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
    <path d="M12 19v4M12 1v4" />
  </svg>
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    stroke: $white;
    fill: $white;

    &:hover,
    &:active,
    &:focus {
      @include scale;
      @include bright;
    }
  }
</style>
