// import { defineMiddleware } from 'astro:middleware';

// const url = import.meta.env.VITE_API_URL;

// export const onRequest = defineMiddleware(async (context, next) => {
//   // Define patterns for excluded, protected, and verified routes
//   const excludedRoutes = [
//     /^\/referral$/, // Bypass for the referral page
//   ];

//   const protectedRoutes = [
//     /^\/story(\/.*)?$/, // Matches /story and dynamic segments
//     /^\/profile(\/.*)?$/, // Matches /profile and dynamic segments
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
//       // Call the backend's auth endpoint
//       const response = await fetch(`${url}/me`, {
//         method: 'GET',
//         credentials: 'include', // Include cookies for authentication
//         headers: { 'Content-Type': 'application/json' },
//       });

//       console.log('Response:', response);

//       if (!response.ok) {
//         console.warn('User not authenticated:', response.statusText);
//         return new Response(null, {
//           status: 302,
//           headers: { Location: '/' },
//         });
//       }

//       // Parse and attach user info to context.locals
//       const user = await response.json();
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



// // import Account from '@lib/auth';
// // import { defineMiddleware } from 'astro:middleware';

// // const url = import.meta.env.VITE_API_URL;

// // export const onRequest = defineMiddleware(async (context, next) => {
// //   // Define patterns for protected and verified routes
// //   const protectedRoutes = [
// //     /^\/story(\/.*)?$/, // Matches /story and dynamic segments
// //     /^\/profile(\/.*)?$/, // Matches /profile and dynamic segments
// //     /^\/[^/]+$/, // Matches /<dynamic name> (any route with a single segment)
// //   ];

// //   const verifiedRoutes = [
// //     /^\/story(\/.*)?$/, // Matches /story and dynamic segments
// //     /^\/[^/]+$/, // Matches /<dynamic name> (any route with a single segment)
// //   ];

// //   const currentPath = new URL(context.request.url).pathname;

// //   // Helper function to check if a route matches a pattern
// //   const isRouteProtected = (path: string, patterns: RegExp[]) =>
// //     patterns.some((pattern) => pattern.test(path));

// //   // Check if the current route is protected
// //   if (isRouteProtected(currentPath, protectedRoutes)) {

// //     const user = await Account.middlewareAuthme();

// //     if (!user) {
// //       return new Response(null, {
// //         status: 302,
// //         headers: { Location: '/' },
// //       });
// //     }

// //     context.locals.user = user;

// //     if (
// //       isRouteProtected(currentPath, verifiedRoutes) &&
// //       !user.referred
// //     ) {
// //       return new Response(null, {
// //         status: 302,
// //         headers: { Location: '/referral' },
// //       });
// //     }
// //     // try {
// //     //   // Call your backend's auth endpoint
// //     //   const response = await fetch(`${url}/me`, {
// //     //     method: 'GET',
// //     //     credentials: 'include', // Ensure cookies are sent with the request
// //     //     headers: { 'Content-Type': 'application/json' },
// //     //   });

// //     //   console.log('Response:', response);

// //     //   if (!response.ok) {
// //     //     // Redirect to login if not authenticated
// //     //     return new Response(null, {
// //     //       status: 302,
// //     //       headers: { Location: '/' },
// //     //     });
// //     //   }

// //     //   // Parse and attach user info to context.locals
// //     //   const resp = await response.json() as User;
// //     //   context.locals.user = resp;

// //     //   // Check if route requires verification
// //     //   if (
// //     //     isRouteProtected(currentPath, verifiedRoutes) &&
// //     //     !resp.referred
// //     //   ) {
// //     //     // Redirect to the verification page if not verified
// //     //     return new Response(null, {
// //     //       status: 302,
// //     //       headers: { Location: '/referral' },
// //     //     });
// //     //   }
// //     // } catch (error) {
// //     //   console.error('Error during authentication:', error);

// //     //   // Redirect to login on error
// //     //   return new Response(null, {
// //     //     status: 302,
// //     //     headers: { Location: '/' },
// //     //   });
// //     // }
// //   }

// //   // Proceed with the next middleware or the requested route
// //   return next();
// // });
