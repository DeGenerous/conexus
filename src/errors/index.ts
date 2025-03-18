import { toastStore } from '@stores/toast';

export const api_error = (error: APIError, display: boolean = true) => {
  if (display) {
    // check if message contains unable to parse /api and don't show toast
    if (error.message.includes('Failed to parse URL from /api')) {
      return;
    }
    toastStore.show(`Error: ${error.message}`, 'error');
  }
};
