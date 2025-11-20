<script lang="ts">
  import { onMount } from 'svelte';
  import Router, { type WrappedComponent } from 'svelte-spa-router';

  import { checkUserRoles } from '@utils/route-guard';
  import { ensureSigned } from '@utils/route-guard';
  import { profileRoutes } from '@components/dashboard/profile';
  import { dreamRoutes } from '@components/dashboard/dream';
  import { adminRoutes } from '@components/dashboard/admin';
  import { omnihubRoutes } from '@components/dashboard/omnihub';
  import { DASHBOARD_LINKS, buildRoutes } from '@components/dashboard/routes';

  import PullToRefresh from '@components/utils/PullToRefresh.svelte';
  import { initPullRefreshContext } from '@utils/pull-refresh';
  import Sidebar from '@components/dashboard/Sidebar.svelte';

  onMount(ensureSigned);
  onMount(checkUserRoles);

  const componentMap: Record<string, WrappedComponent> = {
    ...profileRoutes,
    ...dreamRoutes,
    ...adminRoutes,
    ...omnihubRoutes,
  };

  const routes = buildRoutes(DASHBOARD_LINKS, componentMap);

  const pullRefresh = initPullRefreshContext();
  let hasRefreshHandler = $state<boolean>(false);

  const triggerRefresh = async () => {
    await pullRefresh.refresh();
  };

  onMount(() => {
    const unsubscribe = pullRefresh.hasHandlers.subscribe(
      (value) => (hasRefreshHandler = value),
    );

    return () => {
      unsubscribe();
    };
  });
</script>

<Sidebar />

<div class="dashboard-content blur fade-in">
  <span class="placeholder"></span>
  <PullToRefresh refresh={hasRefreshHandler ? triggerRefresh : undefined}>
    <Router {routes} />
  </PullToRefresh>
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .dashboard-content {
    display: grid;
    grid-template-columns: 1fr;
    width: 100vw;
    min-height: 100dvh;
    padding-block: 0 5rem;
    background-color: rgba(0, 0, 0, 0.25);

    .placeholder {
      width: 100%;
      height: 100%;
      display: none;
    }

    @include respond-up(small-desktop) {
      grid-template-columns: 320px minmax(0, 1fr);
      padding-block: 4.5rem 0;

      .placeholder {
        display: block;
      }
    }
  }

  :global(html) {
    padding-block: 0;
  }
</style>
