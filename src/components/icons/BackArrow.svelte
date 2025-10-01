<script lang="ts">
  let {
    href,
    hideForMobiles = false,
    hideForPCs = false,
  }: {
    href: string;
    hideForMobiles?: boolean;
    hideForPCs?: boolean;
  } = $props();
</script>

<a
  class="navigation-tab"
  class:inactive={!href}
  class:pc-only={hideForMobiles}
  class:mobile-only={hideForPCs}
  href={href === 'back' ? 'javascript:window.history.back()' : href}
  aria-label="Back arrow"
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-80 -80 160 160">
    <path
      d="
        M -14 -30 L -14 -64 L -76 -9 L -14 48 L -14 12 Q 36 14 60 52 Q 60 -26 -12 -30 Z
      "
      stroke-width="4"
      stroke-linejoin="round"
    />
  </svg>
  <p>Back</p>
</a>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  a {
    &.mobile-only {
      display: flex;

      @include respond-up('small-desktop') {
        display: none;
      }
    }

    &.pc-only {
      display: none;

      @include respond-up('small-desktop') {
        display: flex;
      }
    }
  }
  // a {
  //   fill: $light-blue;

  //   &:hover,
  //   &:active,
  //   &:focus {
  //     fill: $cyan;

  //     #back-arrow-svg-mask path {
  //       transform: scale(1.1);
  //     }
  //   }
  // }
</style>
