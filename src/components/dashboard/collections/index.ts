import type { SvelteComponent } from 'svelte';
import { playerGuard } from '@components/dashboard/guard';

import Collections from './Collections.svelte';

export const COLLECTIONS_ROUTES = [
  {
    name: 'Collections',
    path: '/collections',
    component: Collections,
  },
];

export const collectionsRoutes = Object.fromEntries(
  COLLECTIONS_ROUTES.map(({ path, component }) => [
    path,
    playerGuard(component as unknown as typeof SvelteComponent),
  ]),
);
