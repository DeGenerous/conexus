<script lang="ts">
  import { onMount } from 'svelte';
  import Router, { type WrappedComponent } from 'svelte-spa-router';

  import { userState } from '@utils/route-guard';

  import { profileRoutes } from '@components/dashboard/profile';
  import { dreamRoutes } from '@components/dashboard/dream';
  import { adminRoutes } from '@components/dashboard/admin';
  import { omnihubRoutes } from '@components/dashboard/omnihub';

  import { DASHBOARD_LINKS, buildRoutes } from '@components/dashboard/routes';
  import Sidebar from '@components/dashboard/Sidebar.svelte';

  let signedIn = $state(false);
  let isAdmin = $state<boolean>(false);
  let isCreator = $state<boolean>(false);

  onMount(async () => {
    signedIn = await userState('signed');
    if (!signedIn) {
      window.location.href =
        '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }

    isAdmin = await userState('admin');
    isCreator = await userState('creator');
  });

  const componentMap: Record<string, WrappedComponent> = {
    ...profileRoutes,
    ...dreamRoutes,
    ...adminRoutes,
    ...omnihubRoutes,
  };

  const routes = buildRoutes(DASHBOARD_LINKS, componentMap);
</script>

<Sidebar {isAdmin} {isCreator} />

<div class="dashboard-content pad-24 blur fade-in">
  <span class="placeholder"></span>
  <div class="flex">
    <Router {routes} />
  </div>
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .dashboard-content {
    display: grid;
    grid-template-columns: 1fr;
    width: 100vw;
    min-height: 100dvh;
    background-color: rgba(0, 0, 0, 0.25);

    .placeholder {
      width: 100%;
      height: 100%;
      display: none;
    }

    div {
      justify-content: flex-start;
    }

    @include respond-up(small-desktop) {
      grid-template-columns: 320px minmax(0, 1fr);
      padding-top: 6rem;

      .placeholder {
        display: block;
      }
    }
  }
</style>
