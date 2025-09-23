<script lang="ts">
  import { onMount } from 'svelte';
  import Router, { type WrappedComponent } from 'svelte-spa-router';

  import { userState } from '@utils/route-guard';

  import { profileRoutes } from '@components/dashboard/profile';
  import { dreamRoutes } from '@components/dashboard/dream';
  import { adminRoutes } from '@components/dashboard/admin';
  import { omnihubRoutes } from '@components/dashboard/omnihub';

  import {
    DASHBOARD_LINKS,
    buildRoutes,
  } from '@components/dashboard/routes';
  import Sidebar from '@components/dashboard/Sidebar.svelte';

  let signedIn = $state(false);
  let isAdmin = $state<boolean>(false);
  let isCreator = $state<boolean>(false);
  let sidebarOpen = $state<boolean>(false);

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

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  function closeSidebar() {
    sidebarOpen = false;
  }
</script>

<section class="fade-in">
  <button
    aria-label="Toggle navigation"
    aria-controls="dashboard-sidebar"
    aria-expanded={sidebarOpen}
    onclick={toggleSidebar}
  >
    ☰
  </button>

  <Sidebar
    {isAdmin}
    {isCreator}
    open={sidebarOpen}
    close={closeSidebar}
  />

  <div class="dashboard-content">
    <Router {routes} />
  </div>
</section>

<style lang="scss">
  @use "/src/styles/mixins" as *;

  section {
    display: grid;
    grid-template-columns: 1fr;
    width: 100vw;
    min-height: 100dvh;
    background: radial-gradient(
      circle at 0 0,
      rgba(20, 20, 40, 0.85),
      rgba(5, 5, 15, 0.95)
    );

    button {
      position: fixed;
      top: 1rem;
      left: 1rem;
    }

    .dashboard-content {
      padding: 1rem;
      overflow-y: auto;
    }

    @include respond-up(small-desktop) {
      grid-template-columns: 280px minmax(0, 1fr);

      button {
        display: none;
      }

      .dashboard-content {
        padding: 2rem;
      }
    }
  }
</style>
