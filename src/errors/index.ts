import { toastStore } from '@stores/toast';

export const api_error = (error: APIError, display: boolean = true) => {
  if (display) toastStore.show(`Error: ${error.message}`, 'error');
};
