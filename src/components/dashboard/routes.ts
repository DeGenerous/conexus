import type { WrappedComponent } from 'svelte-spa-router';

import { home } from './home';
import { PROFILE_ROUTES } from './profile';
import { DREAM_ROUTES } from './dream';
import { ADMIN_ROUTES } from './admin';
import { OMNIHUB } from './omnihub';

export const DASHBOARD_LINKS: Linking[] = [
  {
    name: 'Account',
    intended: 'all',
    children: PROFILE_ROUTES.map((route) => ({
      name: route.name,
      path: route.path,
    })),
  },
  {
    name: 'Dream',
    intended: 'player',
    children: [
      {
        name: 'New',
        intended: 'player',
        children: DREAM_ROUTES.NEW.map((route) => ({
          name: route.name,
          path: route.path,
        })),
      },
      {
        name: 'Manage',
        intended: 'player',
        children: DREAM_ROUTES.MANAGE.map((route) => ({
          name: route.name,
          path: route.path,
        })),
      },
    ],
  },
  {
    name: 'Admin',
    intended: 'admin',
    children: ADMIN_ROUTES.map((route) => ({
      name: route.name,
      path: route.path,
    })),
  },
  ...OMNIHUB,
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

  // fallback
  routes['*'] = home;

  return routes;
}
