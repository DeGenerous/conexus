import type { SvelteComponent } from 'svelte';
import wrap from 'svelte-spa-router/wrap';

import ProfileOverview from './Overview.svelte';
import ProfileBookmarks from './Bookmark.svelte';
import ProfileMetrics from './Metrics.svelte';

export const PROFILE_ROUTES = [
  {
    name: 'Overview',
    path: '/dashboard/profile/overview',
    component: ProfileOverview,
  },
  {
    name: 'Bookmarks',
    path: '/dashboard/profile/bookmarks',
    component: ProfileBookmarks,
  },
  {
    name: 'Metrics',
    path: '/dashboard/profile/metrics',
    component: ProfileMetrics,
  },
];

export const profileRoutes = Object.fromEntries(
  PROFILE_ROUTES.map((r) => [
    r.path,
    wrap({ component: r.component as unknown as typeof SvelteComponent }),
  ]),
);
