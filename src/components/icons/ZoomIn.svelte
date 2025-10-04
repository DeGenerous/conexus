<script lang="ts">
  let {
    onclick = () => {},
    active = false,
    control = false,
  }: {
    onclick: () => void;
    active: boolean;
    control: boolean;
  } = $props();
</script>

<button
  id={control ? 'zoom-in-control' : ''}
  class="void-btn flex"
  class:active
  {onclick}
  aria-label="Zoom in"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-100 -100 200 200"
    stroke-width="15"
    stroke-linecap="round"
  >
    <circle cx="-20" cy="-20" r="70" />
    <line x1="34" y1="34" x2="85" y2="80" stroke-width="25" />
    <line x1="-55" y1="-20" x2="15" y2="-20" />
    <line x1="-20" y1="-55" x2="-20" y2="15" />
  </svg>
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    stroke: $light-blue;
    width: 1.75rem;

    &.active {
      stroke: $cyan !important;
    }

    &:hover,
    &:active,
    &:focus-visible {
      stroke: $cyan;
      @include scale;
    }
  }
</style>
