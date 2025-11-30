<script lang="ts">
  let { href, hidden = false }: { href: string; hidden?: boolean } = $props();
</script>

<a
  class="nohover-link"
  class:hidden
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
      fill="CurrentColor"
    />
  </svg>
</a>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  a {
    @include cyan(1, text);

    svg {
      width: 2rem;
    }

    @include respond-up('small-desktop') {
      svg {
        width: 3rem;
      }
    }

    &:hover,
    &:active,
    &:focus-visible {
      @include light-blue(1, text);
    }

    &.hidden {
      visibility: hidden;
    }
  }
</style>
