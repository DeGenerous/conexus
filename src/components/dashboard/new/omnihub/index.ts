import type { SvelteComponent } from 'svelte';
import wrap from 'svelte-spa-router/wrap';

import OmniHub from './OmniHub.svelte';
import Portrait from './Portrait.svelte';

export const OMNIHUB = [
  {
    name: 'OmniHub',
    path: '/omnihub',
    component: OmniHub,
  },
  {
    name: 'Portrait',
    path: '/omnihub/portrait',
    component: Portrait,
  },
];

export const omnihubRoutes = Object.fromEntries(
  OMNIHUB.map((r) => [
    r.path,
    wrap({ component: r.component as unknown as typeof SvelteComponent }),
  ]),
);
