import type { SvelteComponent } from 'svelte';
import wrap from 'svelte-spa-router/wrap';

import AdminANalyticsDashboard from './analytics/Dashboard.svelte';
import AdminANalyticsReport from './analytics/Report.svelte';

import AdminManagementUser from './management/User.svelte';
import AdminManagementRole from './management/Role.svelte';
import AdminManagementSection from './management/Section.svelte';

import AdminWeb3Collection from './web3/Collection.svelte';
import AdminWeb3Gate from './web3/Gate.svelte';

export const ADMIN_ROUTES = {
  MANAGEMENT: [
    {
      name: 'Users',
      path: '/admin/management/users',
      component: AdminManagementUser,
    },
    {
      name: 'Roles',
      path: '/admin/management/roles',
      component: AdminManagementRole,
    },
    {
      name: 'Sections',
      path: '/admin/management/sections',
      component: AdminManagementSection,
    },
  ],
  WEB3: [
    {
      name: 'Collections',
      path: '/admin/web3/collections',
      component: AdminWeb3Collection,
    },
    {
      name: 'Gates',
      path: '/admin/web3/gates',
      component: AdminWeb3Gate,
    },
  ],
  ANALYTICS: [
    {
      name: 'Dashboard',
      path: '/admin/analytics',
      component: AdminANalyticsDashboard,
    },
    {
      name: 'Reports',
      path: '/admin/analytics/reports',
      component: AdminANalyticsReport,
    },
  ],
};

export const adminRoutes = Object.fromEntries(
  Object.entries(ADMIN_ROUTES).flatMap(([key, routes]) =>
    routes.map(({ path, component }) => [
      path,
      wrap({ component: component as unknown as typeof SvelteComponent }),
    ]),
  ),
);
