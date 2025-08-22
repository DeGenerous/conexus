import wrap from 'svelte-spa-router/wrap';

import ProfileOverview from './Overview.svelte';
import ProfileSettings from './Settings.svelte';
import ProfileMetrics from './Metrics.svelte';

export const PROFILE_ROUTES = [
  {
    name: 'Overview',
    path: '/dashboard/profile/overview',
    component: ProfileOverview,
  },
  {
    name: 'Settings',
    path: '/dashboard/profile/settings',
    component: ProfileSettings,
  },
  {
    name: 'Metrics',
    path: '/dashboard/profile/metrics',
    component: ProfileMetrics,
  },
];

export const profileRoutes = Object.fromEntries(
  PROFILE_ROUTES.map((r) => [r.path, wrap({ component: r.component })]),
);
