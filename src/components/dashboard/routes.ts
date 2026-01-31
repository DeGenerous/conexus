import { get } from 'svelte/store';

import { user } from '@stores/account.svelte';

const hasMainWallet = () =>
  Boolean(get(user)?.wallets?.filter((wallet) => !wallet.faux).length);

export const DASHBOARD_LINKS: Linking[] = [
  {
    name: 'Account',
    intended: 'all',
    children: [
      { name: 'Overview', path: '/dashboard/account' },
      { name: 'Bookmarks', path: '/dashboard/bookmarks' },
      { name: 'Settings', path: '/dashboard/settings' },
    ],
  },
  {
    name: 'Collections',
    intended: 'player',
    path: '/dashboard/collections',
  },
  {
    name: 'OmniHub',
    path: '/dashboard/omnihub',
    display: hasMainWallet,
  },
];
