import type { WrappedComponent } from 'svelte-spa-router';

import { PROFILE_ROUTES } from './Profile';
import { DREAM_ROUTES } from './dream';
import { ADMIN_ROUTES } from './admin';

export const DASHBOARD_PATH = '/dashboard';

export const DASHBOARD_LINKS: Linking[] = [
  {
    name: 'Profile',
    intended: 'all',
    children: PROFILE_ROUTES.map((route) => ({
      name: route.name,
      path: route.path,
    })),
  },
  {
    name: 'Dream',
    intended: 'creator',
    children: [
      {
        name: 'New',
        intended: 'creator',
        children: DREAM_ROUTES.NEW.map((route) => ({
          name: route.name,
          path: route.path,
        })),
      },
      {
        name: 'Manage',
        intended: 'creator',
        children: DREAM_ROUTES.MANAGE.map((route) => ({
          name: route.name,
          path: route.path,
          intended: route.intended ?? 'creator',
        })),
      },
    ],
  },
  {
    name: 'Admin',
    intended: 'admin',
    children: [
      {
        name: 'Management',
        intended: 'admin',
        children: ADMIN_ROUTES.MANAGEMENT.map((route) => ({
          name: route.name,
          path: route.path,
        })),
      },
      {
        name: 'Web3',
        intended: 'admin',
        children: ADMIN_ROUTES.WEB3.map((route) => ({
          name: route.name,
          path: route.path,
        })),
      },

      {
        name: 'Analytics',
        intended: 'admin',
        children: ADMIN_ROUTES.ANALYTICS.map((route) => ({
          name: route.name,
          path: route.path,
        })),
      },
    ],
  },
  {
    name: 'OmniHub',
    path: '/dashboard/omnihub',
  },
];

export function buildRoutes(
  links: Linking[],
  map: Record<string, WrappedComponent>,
): Record<string, WrappedComponent> {
  const routes: Record<string, WrappedComponent> = {};

  function traverse(items: Linking[]) {
    for (const item of items) {
      if (item.path && map[item.path]) {
        routes[item.path] = map[item.path];
      }
      if (item.children) {
        traverse(item.children);
      }
    }
  }

  traverse(links);

  return routes;
}
