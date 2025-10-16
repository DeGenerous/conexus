// Simple shared toggle map to control visibility of password fields across forms
const passwordVisible = $state<PasswordVisibility>({
  login: false,
  signup: false,
  edit: false,
  reset: false,
});

export default passwordVisible;
