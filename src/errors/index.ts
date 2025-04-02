import { toastStore } from '@stores/toast';
import { ClearCache } from '@constants/cache';

export const api_error = (error: APIError, display: boolean = true) => {
  if (display) {
    // check if message contains unable to parse /api and don't show toast
    if (error.message.includes('Failed to parse URL from /api')) {
      return;
    }

    if (error.message.includes('Unauthorized access')) {
      ClearCache('auth');
      toastStore.show('Unauthorized access, please login again', 'error');
      window.location.href = '/';
      return;
    }
    toastStore.show(`Error: ${error.message}`, 'error');
  }
};
