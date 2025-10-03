<script lang="ts">
  import { NAV_ROUTES } from '@constants/routes';
</script>

<h2>Welcome to the Dashboard</h2>

<h5>Your unfinished stories will be there</h5>

<footer class="flex">
  <hr />
  <h5>Report bugs or ask for help</h5>
  <div class="flex-row gap">
    <a href={NAV_ROUTES.SUPPORT}>Support</a>
    <span aria-hidden="true">|</span>
    <a href={NAV_ROUTES.DISCORD}>Discord</a>
    <span aria-hidden="true">|</span>
    <a href={NAV_ROUTES.FAQ}>FAQ</a>
    <span aria-hidden="true">|</span>
    <a href={NAV_ROUTES.BLOG}>Blog</a>
  </div>
</footer>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  footer {
    width: 100%;
    margin-top: auto;
    @include white-txt;
  }
</style>
