// import { Account } from '@lib/account';
import { GetCache, USER_CACHE_KEY } from '@constants/cache';
import { authenticated, web3LoggedIn } from '@stores/account';

function redirectTo(path: string) {
  if (typeof window !== 'undefined') {
    window.location.href = path;
  }
}

// Define route patterns
const excludedRoutes = [/^\/referral$/];
const protectedRoutes = [
  /^\/story(\/.*)?$/,
  /^\/dashboard(\/.*)?$/,
  /^\/[^/]+$/,
];
const verifiedRoutes = [/^\/story(\/.*)?$/, /^\/[^/]+$/];

// Helper function to match a route pattern
const isRouteMatched = (path: string, patterns: RegExp[]) =>
  patterns.some((pattern) => pattern.test(path));

// Function to check user state
export async function checkUserState(
  path: string,
  checkAdmin: boolean = false,
): Promise<void> {
  // Skip checks for excluded routes
  if (isRouteMatched(path, excludedRoutes)) {
    return;
  }

  if (isRouteMatched(path, protectedRoutes)) {
    // get user from store if not in store try from cache
    let user: Nullable<User>;

    authenticated.subscribe((value) => {
      user = value.user;
    });

    if (!user) {
      const cache = GetCache<User>(USER_CACHE_KEY);
      if (cache) {
        user = cache as User;
        authenticated.set({ user, loggedIn: true });
        web3LoggedIn.set(true);
      }

      if (!user) {
        redirectTo('/');
        return;
      }
    }

    if (checkAdmin && user.role !== 'admin') {
      redirectTo('/');
      return;
    }

    if (isRouteMatched(path, verifiedRoutes) && !user.referred) {
      redirectTo('/referral');
      return;
    }
  }
}

export function checkWeb3LoginState(loggedIn: boolean, path: string): void {
  if (!loggedIn && path !== 'Community Picks') {
    redirectTo('/');
    return;
  }
}
