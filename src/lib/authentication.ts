import { USER_KEY, TTL_HOUR, SetCache } from '@constants/cache';
import { api_error } from '@errors/index';
import AuthenticationAPI from '@service/router/authentication';
import { authenticated, accountError } from '@stores/account.svelte';
import { toastStore } from '@stores/toast.svelte';

/**
 * Handles user authentication and related actions.
 */
export default class Authentication {
  private authAPI: AuthenticationAPI;

  constructor() {
    this.authAPI = new AuthenticationAPI(import.meta.env.PUBLIC_BACKEND);
  }

  /**
   * Initiates Google Sign-In process.
   */
  async googleSignin(): Promise<void> {
    const { status, message, data } = await this.authAPI.googleSignin();

    switch (status) {
      case 'error':
        accountError.set({ googleSignin: message });
        break;
      case 'success':
        if (!data) {
          throw new Error('No data returned from Google Sign-In');
        }
        window.location.href = data;
        break;
      default:
        accountError.set({ googleSignin: 'Unknown error occurred' });
    }
  }

  /**
   * Signs in a user with the provided credentials.
   * @param signinData - The user's sign-in credentials.
   * @returns A promise that resolves when the sign-in process is complete.
   */
  async signin(signinData: SignIn): Promise<void> {
    const { status, message, data } = await this.authAPI.signin(
      signinData.email,
      signinData.password,
    );

    switch (status) {
      case 'error':
        accountError.set({ signin: message });
        return;
      case 'success':
        SetCache(USER_KEY, data, TTL_HOUR);
        window.location.reload();
        return;
      default:
        accountError.set({ signin: 'Unknown error occurred' });
        return;
    }
  }

  /**
   * Signs up a new user with the provided referral code.
   * @param signupData - The user's sign-up information.
   * @returns A promise that resolves when the sign-up process is complete.
   */
  async signup(signupData: ReferralSignUp): Promise<Nullable<void>> {
    const { status, message, data } = await this.authAPI.signup(signupData);

    switch (status) {
      case 'error':
        accountError.set({ signup: message });
        return null;
      case 'success':
        SetCache(USER_KEY, data, TTL_HOUR);
        authenticated.set(data);
        return;
      default:
        accountError.set({ signup: 'Unknown error occurred' });
        return null;
    }
  }

  /**
   * Validates a referral code.
   * @param code - The referral code to validate.
   * @returns A promise that resolves to a boolean indicating whether the code is valid.
   */
  async validateReferralCode(code: string): Promise<boolean> {
    const { status, message } = await this.authAPI.validateReferralCode(code);

    switch (status) {
      case 'error':
        accountError.set({ validateReferralCode: message });
        return false;
      case 'success':
        return true;
      default:
        accountError.set({ validateReferralCode: 'Unknown error occurred' });
        return false;
    }
  }

  /**
   * Initiates the password reset process.
   * @param email - The email address of the user requesting the password reset.
   */
  async forgotPassword(email: string): Promise<void> {
    const { status, message } = await this.authAPI.forgotPassword(email);

    switch (status) {
      case 'error':
        api_error(message, true);
        break;
      case 'success':
        toastStore.show(message || 'Password reset email sent', 'info');
        break;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }
  }

  /**
   * Resets the user's password.
   * @param resetData - The data required to reset the password.
   */
  async resetPassword(resetData: ResetPassword): Promise<void> {
    const { status, message } = await this.authAPI.resetPassword(
      resetData.email,
      resetData.token,
      resetData.password,
    );

    switch (status) {
      case 'error':
        api_error(message, true);
        break;
      case 'success':
        toastStore.show(message || 'Password reset successfully', 'info');
        break;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }
  }

  /**
   * Logs the user out.
   */
  async logout(): Promise<void> {
    const { status, message } = await this.authAPI.logout();

    switch (status) {
      case 'error':
        api_error(message, true);
        break;
      case 'success':
        toastStore.show(message || 'Logged out successfully', 'info');
        break;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }
  }
}
