import type { SvelteComponent } from 'svelte';
import { playerGuard } from '@components/dashboard/guard';

import DreamCreate from './new/Create.svelte';
import DreamDrafts from './new/Drafts.svelte';

import DreamCollections from './manage/Collections.svelte';
import DreamCategories from './manage/Categories.svelte';

export const DREAM_ROUTES = {
  NEW: [
    {
      name: 'Create',
      path: '/dream/create',
      component: DreamCreate,
    },
    {
      name: 'Drafts',
      path: '/dream/drafts',
      component: DreamDrafts,
    },
  ],
  MANAGE: [
    {
      name: 'Collections',
      path: '/dream/manage/collections',
      component: DreamCollections,
    },
    {
      name: 'Categories',
      path: '/dream/manage/categories',
      component: DreamCategories,
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
