<script lang="ts">
  let {
    onclick = () => {},
    disabled = false,
    sorting = false,
    hideForMobiles = false,
  }: {
    onclick: () => void;
    disabled?: boolean;
    sorting: boolean;
    hideForMobiles?: boolean;
  } = $props();
</script>

<button
  class="filter blur"
  class:sorting
  class:active-btn={sorting}
  {onclick}
  {disabled}
  aria-label="Sort from A to z"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-100 -100 200 200"
    stroke-linejoin="round"
  >
    <path
      d="
          M -80 -95
          L -80 34
          L -96 34
          L -72 72
          L -48 34
          L -64 34
          L -64 -95
          Z
        "
      stroke-width="6"
    />
    <rect x="-30" y="-98" width="130" height="20" rx="4" />
    <rect x="-30" y="-48" width="105" height="20" rx="4" />
    <rect x="-30" y="2" width="80" height="20" rx="4" />
    <rect x="-30" y="52" width="55" height="20" rx="4" />
  </svg>
  <span class:pc-only={hideForMobiles}>A-Z</span>
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    fill: $soft-white;
    stroke: $soft-white;
    color: $soft-white !important;

    &.sorting {
      fill: $white;
      stroke: $white;

      svg {
        transform: scale(1.1);

        path {
          transform: scale(0.9) translateY(10%);
        }
      }
    }
  }
</style>
