import { defineMiddleware } from 'astro:middleware';

import { AccountAPI } from '@service/routes';
import { authenticated, web3LoggedIn } from '@stores/account';

export const onRequest = defineMiddleware(async (context, next) => {
  const url = import.meta.env.VITE_API_URL;

  console.log('API URL:', url);
  const acctAPI = new AccountAPI(url);
  const request = context.request;
  const currentPath = new URL(request.url).pathname;

  // Utility function to extract cookie value
  const getCookieValue = (name: string, cookieHeader: string | null) => {
    if (!cookieHeader) return null;
    return cookieHeader
      .split('; ')
      .find((cookie) => cookie.startsWith(`${name}=`))
      ?.split('=')[1];
  };

  // Skip authentication for excluded routes
  if (isRouteMatched(currentPath, excludedRoutes)) {
    return next();
  }

  // Handle protected routes
  if (isRouteMatched(currentPath, protectedRoutes)) {
    try {
      const cookies = request.headers.get('cookie');
      const token = getCookieValue('token', cookies);

      if (!token) {
        console.warn('No token found, redirecting to login page');
        return new Response(null, {
          status: 302,
          headers: { Location: '/' },
        });
      }

      const { data } = await acctAPI.me(token);

      if (!data || !data.user) {
        console.warn('User not authenticated, redirecting to login page');
        return new Response(null, {
          status: 302,
          headers: { Location: '/' },
        });
      }

      const { user } = data;
      context.locals.user = user;
      authenticated.set({ user, loggedIn: true });
      web3LoggedIn.set(true);

      // Handle verification check
      if (isRouteMatched(currentPath, verifiedRoutes) && !user.referred) {
        console.warn('User not verified, redirecting to referral page');
        return new Response(null, {
          status: 302,
          headers: { Location: '/referral' },
        });
      }

      // Handle admin-protected routes
      if (
        isRouteMatched(currentPath, adminProtectedRoutes) &&
        user.role !== 'admin'
      ) {
        console.warn('User not authorized, redirecting to home page');
        return new Response(null, {
          status: 302,
          headers: { Location: '/?message=You\'re not authorized this page' },
        });
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      return new Response(null, {
        status: 500,
        statusText: 'Internal Server Error',
      });
    }
  }

  // Continue to the next middleware or requested route
  return next();
});

/* Helper functions */

// Define patterns for excluded, protected, and verified routes
const excludedRoutes = [
  /^\/referral$/, // Bypass for the referral page
];

const protectedRoutes = [
  /^\/story(\/.*)?$/, // Matches /story and dynamic segments
  /^\/dashboard(\/.*)?$/, // Matches /dashboard and dynamic segments
  /^\/[^/]+$/, // Matches /<dynamic name> (any single-segment route)
];

const adminProtectedRoutes = [
  /^\/dashboard(\/.*)?$/, // Matches /admin and dynamic segments
];

const verifiedRoutes = [
  /^\/story(\/.*)?$/, // Matches /story and dynamic segments
  /^\/[^/]+$/, // Matches /<dynamic name> (any single-segment route)
];

// Helper function to check if a route matches a pattern
const isRouteMatched = (path: string, patterns: RegExp[]) =>
  patterns.some((pattern) => pattern.test(path));
