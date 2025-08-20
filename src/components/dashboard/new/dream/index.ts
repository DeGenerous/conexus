import type { SvelteComponent } from 'svelte';
import wrap from 'svelte-spa-router/wrap';

import DreamCreate from './new/Create.svelte';
import DreamDraft from './new/Draft.svelte';
import DreamDemo from './new/Demo.svelte';

import DreamCollections from './manage/Collection.svelte';
import DreamCategories from './manage/Category.svelte';
import DreamNFTGates from './manage/NFTGate.svelte';

export const dreamRoutes = {
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
};
