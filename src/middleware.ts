import { defineMiddleware } from 'astro:middleware';
import { AccountAPI } from '@service/routes';

export const onRequest = defineMiddleware(async (context, next) => {
  // Proceed with the next middleware or the requested route
  return next();
});

// export const onRequest = defineMiddleware(async (context, next) => {
//   const acctAPI = new AccountAPI(import.meta.env.VITE_API_URL);

//   // Define patterns for excluded, protected, and verified routes
//   const excludedRoutes = [
//     /^\/referral$/, // Bypass for the referral page
//   ];

//   const protectedRoutes = [
//     /^\/story(\/.*)?$/, // Matches /story and dynamic segments
//     /^\/dashboard(\/.*)?$/, // Matches /dashboard and dynamic segments
//     /^\/[^/]+$/, // Matches /<dynamic name> (any single-segment route)
//   ];

//   const verifiedRoutes = [
//     /^\/story(\/.*)?$/, // Matches /story and dynamic segments
//     /^\/[^/]+$/, // Matches /<dynamic name> (any single-segment route)
//   ];

//   const currentPath = new URL(context.request.url).pathname;

//   // Helper function to check if a route matches a pattern
//   const isRouteMatched = (path: string, patterns: RegExp[]) =>
//     patterns.some((pattern) => pattern.test(path));

//   // Skip checks for excluded routes
//   if (isRouteMatched(currentPath, excludedRoutes)) {
//     return next();
//   }

//   // Check if the current route is protected
//   if (isRouteMatched(currentPath, protectedRoutes)) {
//     try {
//       const { data, error } = await acctAPI.me();

//       if (!data) {
//         console.warn('User not authenticated, redirecting to login page');
//         return new Response(null, {
//           status: 302,
//           headers: { Location: '/' },
//         });
//       }

//       const { user } = data;

//       context.locals.user = user;

//       // Check if route requires verification
//       if (isRouteMatched(currentPath, verifiedRoutes) && !user.referred) {
//         console.warn('User not verified, redirecting to referral page');
//         return new Response(null, {
//           status: 302,
//           headers: { Location: '/referral' },
//         });
//       }
//     } catch (error) {
//       console.error('Error during authentication:', error);
//       return new Response(null, {
//         status: 302,
//         headers: { Location: '/' },
//       });
//     }
//   }

//   // Proceed with the next middleware or the requested route
//   return next();
// });
