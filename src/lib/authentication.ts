import { USER_KEY, TTL_HOUR, SetCache } from '@constants/cache';
import { api_error } from '@errors/index';
import AuthenticationAPI from '@service/router/authentication';
import { authenticated, accountError } from '@stores/account.svelte';
import { toastStore } from '@stores/toast.svelte';

/**
 * Handles user authentication and related actions.
 */
export default class Authentication {
  private api: AuthenticationAPI;

  constructor() {
    this.api = new AuthenticationAPI(import.meta.env.PUBLIC_BACKEND);
  }

  /**
   * Initiates Google Sign-In process.
   */
  async googleSignin(): Promise<void> {
    const { message, data } = await this.api.googleSignin();

    if (!data) {
      accountError.set({ googleSignin: message || 'Unknown error occurred' });
      return;
    } else {
      window.location.href = data;
      return;
    }
  }

  /**
   * Signs in a user with the provided credentials.
   * @param signinData - The user's sign-in credentials.
   * @returns A promise that resolves when the sign-in process is complete.
   */
  async signin(signinData: SignIn): Promise<void> {
    const { message, data } = await this.api.signin(
      signinData.email,
      signinData.password,
    );

    if (!data) {
      accountError.set({ signin: message || 'Unknown error occurred' });
      return;
    }

    const roles = await this.#roles();
    data.role = roles.find((r) => r.id === data.role_id)?.name || 'Guest';

    SetCache(USER_KEY, data, TTL_HOUR);
    window.location.reload();
  }

  /**
   * Signs up a new user with the provided referral code.
   * @param signupData - The user's sign-up information.
   * @returns A promise that resolves when the sign-up process is complete.
   */
  async signup(signupData: ReferralSignUp): Promise<void> {
    const { message, data } = await this.api.signup(signupData);

    if (!data) {
      accountError.set({ signup: message || 'Unknown error occurred' });
      return;
    }

    const roles = await this.#roles();
    data.role = roles.find((r) => r.id === data.role_id)?.name || 'Guest';

    SetCache(USER_KEY, data, TTL_HOUR);
    authenticated.set(data);
  }

  /**
   * Validates a referral code.
   * @param code - The referral code to validate.
   * @returns A promise that resolves to a boolean indicating whether the code is valid.
   */
  async validateReferralCode(code: string): Promise<boolean> {
    const { status, message } = await this.api.validateReferralCode(code);

    if (status === 'error') {
      accountError.set({
        validateReferralCode: message || 'Unknown error occurred',
      });
      return false;
    }

    return true;
  }

  /**
   * Initiates the password reset process.
   * @param email - The email address of the user requesting the password reset.
   */
  async forgotPassword(email: string): Promise<void> {
    const { status, message } = await this.api.forgotPassword(email);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Password reset email sent', 'info');
  }

  /**
   * Resets the user's password.
   * @param resetData - The data required to reset the password.
   */
  async resetPassword(resetData: ResetPassword): Promise<void> {
    const { status, message } = await this.api.resetPassword(
      resetData.email,
      resetData.token,
      resetData.password,
    );

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Password reset successfully', 'info');
  }

  /**
   * Logs the user out.
   */
  async logout(): Promise<void> {
    const { status, message } = await this.api.logout();

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Logged out successfully', 'info');
  }

  async #roles(): Promise<TenantRole[]> {
    const { message, data } = await this.api.getRoles();

    if (!data) {
      api_error(message);
      return [];
    }

    return data;
  }
}
