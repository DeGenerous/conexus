import Fetcher from '../fetcher';

/**
 * An API class for handling authentication requests.
 */
export default class AuthenticationAPI extends Fetcher {
  protected group: string = '/auth';

  /**
   * Sends a request to sign in a user.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns A promise that resolves to an APIResponse containing the user data or an error.
   */
  async signin(email: string, password: string) {
    return this.request<User>(`${this.group}/signin`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  /**
   * Sends a request to sign up a user.
   * @param user - The user's signup details.
   * @returns A promise that resolves to an APIResponse containing the user data or an error.
   */
  async signup(user: ReferralSignUp) {
    return this.request<User>(`${this.group}/signup`, {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  /**
   * Validate a referral code provided by another user.
   * @param code - The referral code to validate.
   * @returns A promise that resolves to an APIResponse or an error.
   * */
  async validateReferralCode(code: string) {
    return this.request(`/account/validate-referral-code?code=${code}`);
  }

  /**
   * Forgot password request.
   * @param email - The user's email address.
   * @returns A promise that resolves to an APIResponse or an error.
   * */
  async forgotPassword(email: string) {
    return this.request(`${this.group}/forgot-password`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  /**
   * Sends a request to trigger password reset.
   * @param email - The user's email address.
   * @param token - The reset token.
   * @param password - The new password.
   * @returns A promise that resolves to an APIResponse or an error.
   * */
  async resetPassword(email: string, token: string, password: string) {
    return this.request(`${this.group}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ email, token, password }),
    });
  }

  /**
   * Oauth request to signin with google.
   * @param token - The google token.
   * @returns A promise that resolves to an APIResponse containing the url string or an error.
   * */
  async googleSignin() {
    return this.request<string>(`${this.group}/google-signin`);
  }

  /**
   * Get Nonce for web3 wallet signin.
   * @param address - The user's wallet address.
   * @returns A promise that resolves to an APIResponse containing the nonce string or an error.
   */
  async web3Getnonce() {
    return this.request<string>(`${this.group}/web3-get-nonce`);
  }

  /**
   * Signin with web3 wallet.
   * @param signin - The wallet details to signin.
   * @returns A promise that resolves to an APIResponse containing the user data or an error.
   */
  async web3WalletSignin(signin: Web3Signin) {
    return this.request<User>(`${this.group}/web3-wallet-signin`, {
      method: 'POST',
      body: JSON.stringify(signin),
    });
  }

  /**
   * Logs out the current user by making a request to the `/auth/logout` endpoint.
   *
   * @returns A promise that resolves with the response from the logout request.
   */
  async logout() {
    return this.request(`${this.group}/logout`);
  }

  /**
   * Retrieves a list of roles.
   * @returns A promise that resolves to an array of TenantRole objects.
   */
  async getRoles() {
    return this.request<TenantRole[]>(`/admin/roles`);
  }
}
