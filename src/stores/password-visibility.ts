import { writable } from 'svelte/store';

const passwordVisible = writable({
  login: false,
  signup: false,
  edit: false,
  reset: false
})

export default passwordVisible;
