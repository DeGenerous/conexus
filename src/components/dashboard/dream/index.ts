import type { SvelteComponent } from 'svelte';
import { playerGuard } from '@components/dashboard/guard';

import DreamCreate from './new/Create.svelte';

import DreamCollections from './manage/Collections.svelte';

export const DREAM_ROUTES = {
  NEW: [
    {
      name: 'Create',
      path: '/dream/create',
      component: DreamCreate,
    },
  ],
  MANAGE: [
    {
      name: 'Collections',
      path: '/dream/manage/collections',
      component: DreamCollections,
    },
  ],
};

export const dreamRoutes = Object.fromEntries(
  Object.entries(DREAM_ROUTES).flatMap(([, routes]) =>
    routes.map(({ path, component }) => [
      path,
      playerGuard(component as unknown as typeof SvelteComponent),
    ]),
  ),
);
