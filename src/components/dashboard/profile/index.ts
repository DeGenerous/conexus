import type { SvelteComponent } from 'svelte';
import wrap from 'svelte-spa-router/wrap';

import ProfileOverview from './Overview.svelte';
import ProfileBookmarks from './Bookmarks.svelte';
import ProfileSettings from './Settings.svelte';

export const PROFILE_ROUTES = [
  {
    name: 'Overview',
    path: '/profile/overview',
    component: ProfileOverview,
  },
  {
    name: 'Bookmarks',
    path: '/profile/bookmarks',
    component: ProfileBookmarks,
  },
  {
    name: 'Settings',
    path: '/profile/settings',
    component: ProfileSettings,
  },
];

export const profileRoutes = Object.fromEntries(
  PROFILE_ROUTES.map((r) => [
    r.path,
    wrap({ component: r.component as unknown as typeof SvelteComponent }),
  ]),
);
