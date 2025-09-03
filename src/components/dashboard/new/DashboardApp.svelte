<script lang="ts">
  import { onMount } from 'svelte';
  import Router, { location, type WrappedComponent } from 'svelte-spa-router';

  import { userState } from '@utils/route-guard';

  import { profileRoutes } from '@components/dashboard/new/Profile';
  import { dreamRoutes } from '@components/dashboard/new/dream';
  import { adminRoutes } from '@components/dashboard/new/admin';
  import { omnihubRoutes } from '@components/dashboard/new/omnihub';

  import {
    DASHBOARD_LINKS,
    buildRoutes,
  } from '@components/dashboard/new/routes';
  import Sidebar from '@components/dashboard/new/Sidebar.svelte';

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

  let sidebarOpen = $state(false);

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  // A mapping of path -> component
  const componentMap: Record<string, WrappedComponent> = {
    ...profileRoutes,
    ...dreamRoutes,
    ...adminRoutes,
    ...omnihubRoutes,
  };

  const routes = buildRoutes(DASHBOARD_LINKS, componentMap);
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
