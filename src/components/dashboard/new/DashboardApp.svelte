<script>
  import Router, { location } from 'svelte-spa-router';

  import Sidebar from '@components/dashboard/new/Sidebar.svelte';

  import { DASHBOARD_LINKS, buildRoutes } from '../routes';

  const routes = buildRoutes(DASHBOARD_LINKS);
</script>

<div class="dashboard-layout">
  <Sidebar />

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
</style>
