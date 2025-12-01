<script lang="ts">
  import { NAV_ROUTES } from '@constants/routes';
  import { COOKIE_CONSENT_KEY, ClearCache } from '@constants/cache';

  let { legal = false }: { legal?: boolean } = $props();

  const resetCookies = () => {
    ClearCache(COOKIE_CONSENT_KEY);
    window.location.reload();
  };
</script>

<footer class="flex gap-8">
  {#if legal}
    <h5>Legal information and data</h5>
    <div class="flex-row flex-wrap gap">
      <a
        href="/"
        onclick={(event) => {
          event.preventDefault();
          resetCookies();
        }}
      >
        Cookie Settings
      </a>
      <span aria-hidden="true">|</span>
      <a href={NAV_ROUTES.TERMS}>Terms of Service</a>
      <span aria-hidden="true">|</span>
      <a href={NAV_ROUTES.PRIVACY_POLICY}>Privacy Policy</a>
      <span aria-hidden="true">|</span>
      <a href={NAV_ROUTES.COPYRIGHT_POLICY}>Copyright Policy</a>
    </div>
  {:else}
    <h5>Report bugs or seek help</h5>
    <div class="flex-row flex-wrap gap">
      <a href={NAV_ROUTES.SUPPORT}>Support</a>
      <span aria-hidden="true">|</span>
      <a href={NAV_ROUTES.DISCORD}>Discord</a>
      <span aria-hidden="true">|</span>
      <a href={NAV_ROUTES.FAQ}>FAQ</a>
      <span aria-hidden="true">|</span>
      <a href={NAV_ROUTES.BLOG}>Blog</a>
    </div>
  {/if}
</footer>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  footer {
    width: 100%;
    margin-top: auto;
    @include white-txt;

    h5 {
      @include font(body);
    }

    div {
      row-gap: 0.5rem;
    }
  }
</style>
