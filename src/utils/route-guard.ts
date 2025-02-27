import { Account } from '@lib/account';
import { authenticated, web3LoggedIn } from '@stores/account';

function redirectTo(path: string) {
  if (typeof window !== 'undefined') {
    window.location.href = path;
  }
}

// Define route patterns
const excludedRoutes = [/^\/referral$/];
const protectedRoutes = [/^\/story(\/.*)?$/, /^\/dashboard(\/.*)?$/, /^\/[^/]+$/];
const verifiedRoutes = [/^\/story(\/.*)?$/, /^\/[^/]+$/];

// Helper function to match a route pattern
const isRouteMatched = (path: string, patterns: RegExp[]) =>
  patterns.some((pattern) => pattern.test(path));

// Function to check user state
export async function checkUserState(path: string): Promise<void> {
  // Skip checks for excluded routes
  if (isRouteMatched(path, excludedRoutes)) {
    return;
  }

  if (isRouteMatched(path, protectedRoutes)) {
    const user = await Account.getUser();

    if (!user) {
      redirectTo('/');
      return;
    }

    authenticated.set({ user: user, loggedIn: true });
    web3LoggedIn.set(true);

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
