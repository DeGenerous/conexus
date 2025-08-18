<script lang="ts">
  import { onMount, type SvelteComponent } from 'svelte';
  import Router, { location, type WrappedComponent } from 'svelte-spa-router';
  import { wrap } from 'svelte-spa-router/wrap';

  import Sidebar from '@components/dashboard/new/Sidebar.svelte';
  import { userState, ensureCreator } from '@utils/route-guard';

  import Dashboard from '../Dashboard.svelte';

  import ProfileSettings from '../Profile/Settings.svelte';
  import ProfileMetrics from '../Profile/Metrics.svelte';

  import DreamCreate from '../dreaming/new/Create.svelte';
  import DreamDraft from '../dreaming/new/Draft.svelte';
  import DreamDemo from '../dreaming/new/Demo.svelte';

  import DreamCollections from '../dreaming/manage/Collection.svelte';
  import DreamCategories from '../dreaming/manage/Category.svelte';
  import DreamNFTGates from '../dreaming/manage/NFTGate.svelte';

  // import OmniHub from '../OmniHub.svelte';

  import { DASHBOARD_LINKS, buildRoutes } from '../routes';

  let isAdmin = $state<boolean>(false);
  let isCreator = $state<boolean>(false);

  onMount(async () => {
    await ensureCreator();

    isAdmin = await userState('admin');
    isCreator = await userState('creator');
  });

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

    //   '/dashboard/omnihub': wrap({ component: OmniHub }),
  };

  const routes = buildRoutes(DASHBOARD_LINKS, componentMap);

  // fallback
  routes['*'] = wrap({ component: Dashboard });
</script>

<div class="dashboard-layout">
  <Sidebar {isAdmin} {isCreator} />

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
