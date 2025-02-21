import { toastStore } from '@stores/toast';

export const new_error = (error: ConexusError) => {
  if (error.log) {
    toastStore.show(`Error: ${error.error}`, 'error');
  }
};

export const api_error = (error: APIError) => {
  toastStore.show(`Error: ${error.message}`, 'error');
};
