import type { SvelteComponent } from 'svelte';
import { adminGuard } from '@components/dashboard/guard';

import AdminManagementUsers from './Users.svelte';
import AdminManagementStories from './Stories.svelte';
import AdminWeb3 from './Web3.svelte';

export const ADMIN_ROUTES = [
  {
    name: 'Users',
    path: '/admin/users',
    component: AdminManagementUsers,
  },
  {
    name: 'Stories',
    path: '/admin/stories',
    component: AdminManagementStories,
  },
  {
    name: 'Web3',
    path: '/admin/web3',
    component: AdminWeb3,
  },
];

export const adminRoutes = Object.fromEntries(
  ADMIN_ROUTES.map((r) => [
    r.path,
    adminGuard(r.component as unknown as typeof SvelteComponent),
  ]),
);
