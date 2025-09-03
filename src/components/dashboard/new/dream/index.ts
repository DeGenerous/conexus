import type { SvelteComponent } from 'svelte';
import wrap from 'svelte-spa-router/wrap';

import DreamCreate from './new/Create.svelte';
import DreamDraft from './new/Draft.svelte';
import DreamDemo from './new/Demo.svelte';

import DreamCollections from './manage/Collection.svelte';
import DreamCategories from './manage/Category.svelte';
import DreamNFTGates from './manage/NFTGate.svelte';

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
      component: DreamDraft,
    },
    {
      name: 'Demo',
      path: '/dream/demo',
      component: DreamDemo,
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
    {
      name: 'NFT Gates',
      path: '/dream/manage/nft-gates',
      component: DreamNFTGates,
      intended: 'admin',
    },
  ],
};

export const dreamRoutes = Object.fromEntries(
  Object.entries(DREAM_ROUTES).flatMap(([key, routes]) =>
    routes.map(({ path, component }) => [
      path,
      wrap({ component: component as unknown as typeof SvelteComponent }),
    ]),
  ),
);
