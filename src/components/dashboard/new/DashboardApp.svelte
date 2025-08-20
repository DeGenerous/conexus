<script lang="ts">
  import { onMount, type SvelteComponent } from 'svelte';
  import Router, { location, type WrappedComponent } from 'svelte-spa-router';
  import { wrap } from 'svelte-spa-router/wrap';

  import { userState, ensureCreator } from '@utils/route-guard';

  import Dashboard from '@components/dashboard/new/Dashboard.svelte';
  import { profileRoutes } from '@components/dashboard/new/Profile';
  import { dreamRoutes } from '@components/dashboard/new/dream';
  import { adminRoutes } from '@components/dashboard/new/admin';
  import OmniHub from '@components/dashboard/new/OmniHub.svelte';

  import {
    DASHBOARD_LINKS,
    buildRoutes,
  } from '@components/dashboard/new/routes';
  import Sidebar from '@components/dashboard/new/Sidebar.svelte';

  let isAdmin = $state<boolean>(false);
  let isCreator = $state<boolean>(false);

  onMount(async () => {
    // await ensureCreator();

    isAdmin = await userState('admin');
    isCreator = await userState('creator');
  });

  let sidebarOpen = $state(false);

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  // A mapping of path -> component
  const componentMap: Record<string, WrappedComponent> = {
    ...profileRoutes,
    ...dreamRoutes,
    ...adminRoutes,

    '/dashboard/omnihub': wrap({
      component: OmniHub as unknown as typeof SvelteComponent,
    }),
  };

  const routes = buildRoutes(DASHBOARD_LINKS, componentMap);

  // fallback
  routes['*'] = wrap({ component: Dashboard });
</script>

<div class="dashboard-layout">
  <button class="hamburger" onclick={toggleSidebar} aria-label="Toggle sidebar">
    ☰
  </button>

  <Sidebar
    {isAdmin}
    {isCreator}
    open={sidebarOpen}
    close={() => (sidebarOpen = false)}
  />

  <main class="dashboard-main">
    <Router {routes} />
  </main>
</div>

<!-- <hr />
/#{$location} -->

<style>
  .dashboard-layout {
    display: flex;
    height: 100%;
    width: 100%;
  }
  .dashboard-main {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
  }

  .hamburger {
    display: none;
    position: fixed;
    top: 1rem;
    left: 1rem;
    background: transparent;
    border: none;
    font-size: 2rem;
    color: white;
    cursor: pointer;
    z-index: 2000;
  }

  @media (max-width: 768px) {
    .hamburger {
      display: block;
    }
  }
</style>
