import { toastStore } from '@stores/toast.svelte';
// import { ClearCache } from '@constants/cache';

export const api_error = (error: string, display: boolean = true) => {
  if (display) {
    // check if message contains unable to parse /api and don't show toast
    if (error.includes('Failed to parse URL from /api')) {
      return;
    }

    // Ignore 'You shall not pass!' errors
    if (error.includes('You shall not pass!')) {
      return;
    }

    if (error.includes('Unauthorized access')) {
      // ClearCache('auth');
      // toastStore.show('Unauthorized access, please login again', 'error');
      // window.location.href = '/';
      return;
    }
    toastStore.show(error || 'Unknown error occurred', 'error');
  }

  throw new Error(error);

  // TODO: Send to sentry
};
