<script lang="ts">
  import { NAV_ROUTES } from '@constants/routes';
  import { user } from '@stores/account.svelte';

  import UnfinishedStories from '@components/dashboard/home/UnfinishedStories.svelte';
  import FinishedStories from '@components/dashboard/home/FinishedStories.svelte';
</script>

<p>
  Your command center for CoNexus. Return to ongoing stories, scan recent
  activity, and branch to resources and settings.
</p>

{#if $user?.username}
  <a
    class="button-anchor button-glowing"
    href="/c/{$user.username}"
    target="_self"
  >
    Go to your section
  </a>
{/if}

<UnfinishedStories />
<FinishedStories />

<footer class="flex">
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
