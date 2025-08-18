<script lang="ts">
  import { onMount, type SvelteComponent } from 'svelte';
  import Router, { location, type WrappedComponent } from 'svelte-spa-router';
  import { wrap } from 'svelte-spa-router/wrap';

  import Sidebar from '@components/dashboard/new/Sidebar.svelte';
  import { userState, ensureCreator } from '@utils/route-guard';

  import Dashboard from './Dashboard.svelte';
  import { ProfileSettings, ProfileMetrics } from './Profile';
  import {
    DreamCreate,
    DreamDraft,
    DreamDemo,
    DreamCollections,
    DreamCategories,
    DreamNFTGates,
  } from './dreaming';
  import {
    AdminANalyticsDashboard,
    AdminANalyticsReport,
    AdminManagementUser,
    AdminManagementRole,
    AdminManagementSection,
    AdminWeb3Contract,
    AdminWeb3Gate,
  } from './admin';

  import OmniHub from './OmniHub.svelte';

  import { DASHBOARD_LINKS, buildRoutes } from './routes';

  let isAdmin = $state<boolean>(false);
  let isCreator = $state<boolean>(false);

  onMount(async () => {
    await ensureCreator();

    isAdmin = await userState('admin');
    isCreator = await userState('creator');
  });

  let sidebarOpen = $state(false);

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  // A mapping of path -> component
  const componentMap: Record<string, WrappedComponent> = {
    '/dashboard/profile/settings': wrap({ component: ProfileSettings }),
    '/dashboard/profile/metrics': wrap({ component: ProfileMetrics }),

    '/dashboard/dream/create': wrap({
      component: DreamCreate as unknown as typeof SvelteComponent,
    }),
    '/dashboard/dream/drafts': wrap({
      component: DreamDraft as unknown as typeof SvelteComponent,
    }),
    '/dashboard/dream/demo': wrap({
      component: DreamDemo as unknown as typeof SvelteComponent,
    }),

    '/dashboard/dream/manage/collections': wrap({
      component: DreamCollections as unknown as typeof SvelteComponent,
    }),
    '/dashboard/dream/manage/categories': wrap({
      component: DreamCategories as unknown as typeof SvelteComponent,
    }),
    '/dashboard/dream/manage/nft-gates': wrap({
      component: DreamNFTGates as unknown as typeof SvelteComponent,
    }),

    '/dashboard/web3/contracts': wrap({
      component: AdminWeb3Contract as unknown as typeof SvelteComponent,
    }),
    '/dashboard/web3/gates': wrap({
      component: AdminWeb3Gate as unknown as typeof SvelteComponent,
    }),
    '/dashboard/management/users': wrap({
      component: AdminManagementUser as unknown as typeof SvelteComponent,
    }),
    '/dashboard/management/roles': wrap({
      component: AdminManagementRole as unknown as typeof SvelteComponent,
    }),
    '/dashboard/management/sections': wrap({
      component: AdminManagementSection as unknown as typeof SvelteComponent,
    }),
    '/dashboard/analytics/dashboard': wrap({
      component: AdminANalyticsDashboard as unknown as typeof SvelteComponent,
    }),
    '/dashboard/analytics/reports': wrap({
      component: AdminANalyticsReport as unknown as typeof SvelteComponent,
    }),

    '/dashboard/omnihub': wrap({ component: OmniHub }),
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

<hr />
/#{$location}

<style>
  .dashboard-layout {
    display: flex;
    height: 100vh;
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
