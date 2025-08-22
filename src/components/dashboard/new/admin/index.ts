import type { SvelteComponent } from 'svelte';
import wrap from 'svelte-spa-router/wrap';

import AdminANalyticsDashboard from './analytics/Dashboard.svelte';
import AdminANalyticsReport from './analytics/Report.svelte';

import AdminManagementUser from './management/User.svelte';
import AdminManagementRole from './management/Role.svelte';
import AdminManagementSection from './management/Section.svelte';

import AdminWeb3Contract from './web3/Contract.svelte';
import AdminWeb3Gate from './web3/Gate.svelte';

export const ADMIN_ROUTES = {
  MANAGEMENT: [
    {
      name: 'Users',
      path: '/dashboard/management/users',
      component: AdminManagementUser,
    },
    {
      name: 'Roles',
      path: '/dashboard/management/roles',
      component: AdminManagementRole,
    },
    {
      name: 'Sections',
      path: '/dashboard/management/sections',
      component: AdminManagementSection,
    },
  ],
  WEB3: [
    {
      name: 'Contracts',
      path: '/dashboard/web3/contracts',
      component: AdminWeb3Contract,
    },
    {
      name: 'Gates',
      path: '/dashboard/web3/gates',
      component: AdminWeb3Gate,
    },
  ],
  ANALYTICS: [
    {
      name: 'Dashboard',
      path: '/dashboard/analytics/dashboard',
      component: AdminANalyticsDashboard,
    },
    {
      name: 'Reports',
      path: '/dashboard/analytics/reports',
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
