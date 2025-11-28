import type { SvelteComponent } from 'svelte';
import wrap from 'svelte-spa-router/wrap';

import OmniHub from './OmniHub.svelte';

export const OMNIHUB = [
  {
    name: 'OmniHub',
    path: '/omnihub',
    component: OmniHub,
  },
];

export const omnihubRoutes = Object.fromEntries(
  OMNIHUB.map((r) => [
    r.path,
    wrap({ component: r.component as unknown as typeof SvelteComponent }),
  ]),
);
