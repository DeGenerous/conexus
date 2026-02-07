<script lang="ts">
  import { approvedTester } from '@stores/account.svelte';

  import LogoSVG from './Logo.svelte';
  import QuillSVG from './Quill.svelte';
</script>

<a
  class="home-pc nohover-link"
  class:inactive={!$approvedTester}
  href="/"
  target="_self"
  draggable="false"
  aria-label="CoNexus logo"
>
  <LogoSVG />
</a>

<a
  class="home-mobile nohover-link"
  class:inactive={!$approvedTester}
  href="/"
  target="_self"
  draggable="false"
  aria-label="CoNexus logo"
>
  <QuillSVG />
</a>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  a {
    fill: $cyan;

    &.home-mobile {
      display: flex;

      @include respond-up('small-desktop') {
        display: none;
      }
    }

    &.home-pc {
      display: none;
      padding: 0.5rem;

      @include respond-up('small-desktop') {
        display: flex;
      }
    }
  }
</style>
