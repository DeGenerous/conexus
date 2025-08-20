import wrap from 'svelte-spa-router/wrap';

import ProfileOverview from './Overview.svelte';
import ProfileSettings from './Settings.svelte';
import ProfileMetrics from './Metrics.svelte';

export const profileRoutes = {
  '/dashboard/profile/overview': wrap({ component: ProfileOverview }),
  '/dashboard/profile/settings': wrap({ component: ProfileSettings }),
  '/dashboard/profile/metrics': wrap({ component: ProfileMetrics }),
};
