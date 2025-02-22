import Fetcher from '@service/fetcher';

/**
 * An API class for handling authentication requests.
 */
export default class AuthAPI extends Fetcher {
  /**
   * Sends a request to sign in a user.
   * @param credentials - The user's credentials.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   */
  async signin(email: string, password: string) {
    return this.request<{ user: User }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  /**
   * Sends a request to sign up a user.
   * @param user - The user's details.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   */
  async signup(user: ReferralSignUp) {
    return this.request<{ user: User }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  /**
   * Oauth request to signin with google.
   * @param token - The google token.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async googleSignin() {
    return this.request<{ url: string }>('/auth/google-signin');
  }

  /**
   * Forgot password request.
   * @param email - The user's email address.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async forgotPassword(email: string) {
    return this.request<APISTDResposne>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  /**
   * Sends a request to trigger password reset.
   * @param email - The user's email address.
   * @param token - The reset token.
   * @param password - The new password.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async resetPassword(email: string, token: string, password: string) {
    return this.request<APISTDResposne>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, token, password }),
    });
  }

  /**
   * Get Nonce for web3 wallet signin.
   * @param address - The user's wallet address.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   */
  async web3Getnonce() {
    return this.request<{ nonce: string }>(`/auth/web3-get-nonce`);
  }

  /**
   * Signin with web3 wallet.
   * @param signin - The wallet details to signin.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   */
  async web3WalletSignin(signin: Web3Signin) {
    return this.request<{ user: User }>('/auth/web3-wallet-signin', {
      method: 'POST',
      body: JSON.stringify(signin),
    });
  }
}
