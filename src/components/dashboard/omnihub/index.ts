import wrap from 'svelte-spa-router/wrap';
import type { SvelteComponent } from 'svelte';
import { get } from 'svelte/store';

import { user } from '@stores/account.svelte';

import OmniHub from './OmniHub.svelte';

const hasMainWallet = () =>
  Boolean(get(user)?.wallets?.filter((wallet) => !wallet.faux).length);

export const OMNIHUB = [
  {
    name: 'OmniHub',
    path: '/omnihub',
    component: OmniHub,
    display: hasMainWallet,
  },
];

export const omnihubRoutes = Object.fromEntries(
  OMNIHUB.map((r) => [
    r.path,
    wrap({ component: r.component as unknown as typeof SvelteComponent }),
  ]),
);
