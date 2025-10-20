import { USER_KEY, TTL_HOUR, SetCache, ClearCache } from '@constants/cache';
import { api_error } from '@errors/index';
import AuthenticationAPI from '@service/v2/authentication';
import { accountError } from '@stores/account.svelte';
import { toastStore } from '@stores/toast.svelte';

/**
 * Handles user authentication and related actions.
 */
export default class Authentication {
  private api: AuthenticationAPI;

  /**
   * Initialize the authentication service with the configured backend endpoint.
   */
  constructor() {
    this.api = new AuthenticationAPI(import.meta.env.PUBLIC_BACKEND);
  }

  /**
   * Initiates Google Sign-In process.
   */
  async googleSignin(): Promise<void> {
    const { status, message, data } = await this.api.googleSignin();

    if (status === 'error') {
      accountError.set({ googleSignin: message || 'Unknown error occurred' });
      return;
    }

    if (!data) {
      accountError.set({ googleSignin: message || 'Unknown error occurred' });
      return;
    }

    window.location.href = data;
  }

  /**
   * Signs in a user with the provided credentials.
   * @param signinData - The user's sign-in credentials.
   * @returns A promise that resolves when the sign-in process is complete.
   */
  async signin(signinData: SignIn): Promise<void> {
    const { status, message, data } = await this.api.signin(
      signinData.email,
      signinData.password,
    );

    if (status === 'error') {
      accountError.set({ signin: message || 'Unknown error occurred' });
      return;
    }

    if (!data) {
      accountError.set({ signin: 'Unable to load account data' });
      return;
    }

    SetCache(USER_KEY, data, TTL_HOUR);
    window.location.reload();
  }

  /**
   * Signs up a new user with the provided referral code.
   * @param signupData - The user's sign-up information.
   * @returns A promise that resolves when the sign-up process is complete.
   */
  async signup(signupData: ReferralSignUp): Promise<void> {
    const { status, message, data } = await this.api.signup(signupData);

    if (status === 'error') {
      accountError.set({ signup: message || 'Unknown error occurred' });
      return;
    }

    if (!data) {
      accountError.set({ signup: 'Unable to load account data' });
      return;
    }

    SetCache(USER_KEY, data, TTL_HOUR);
    window.location.reload();
  }

  /**
   * Validates a referral code.
   * @param code - The referral code to validate.
   * @returns A promise that resolves to a boolean indicating whether the code is valid.
   */
  async validateReferralCode(code: string): Promise<boolean> {
    const { status, message } = await this.api.validateReferralCode(code);

    if (status === 'error') {
      api_error(message || 'Unknown error occurred');
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
   * Selects a wallet as the primary Web3 address for the user.
   * @param wallet - The wallet address to select.
   * @returns A promise that resolves to the updated user or null on failure.
   */
  async selectMainWallet(wallet: string): Promise<Nullable<User>> {
    const { status, message, data } = await this.api.web3SelectWallet(wallet);

    if (status === 'error') {
      api_error(
        message || 'There was a problem selecting this wallet address.',
      );
      return null;
    }

    if (!data) {
      toastStore.show('Wallet selection returned without user data.', 'error');
      return null;
    }

    accountError.set(null);
    SetCache(USER_KEY, data, TTL_HOUR);
    toastStore.show(message || 'Wallet selected successfully', 'info');
    return data;
  }

  /**
   * Unlinks a wallet from the user's account.
   * @param wallet - The wallet address to unlink.
   * @returns A promise that resolves to the updated user or null on failure.
   */
  async unlinkWallet(wallet: string): Promise<Nullable<User>> {
    const { status, message, data } = await this.api.web3UnlinkWallet(wallet);

    if (status === 'error') {
      api_error(message);
      return null;
    }

    if (!data) {
      toastStore.show(
        'Wallet unlink response did not include user data.',
        'error',
      );
      return null;
    }

    accountError.set(null);
    SetCache(USER_KEY, data, TTL_HOUR);
    toastStore.show(message || 'Wallet unlinked successfully', 'info');
    return data;
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

    ClearCache('auth');

    toastStore.show(message || 'Logged out successfully', 'info');

    window.open('/', '_self');
  }
}
