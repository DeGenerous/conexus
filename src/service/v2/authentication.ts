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
  async web3WalletSignin(signin: Web3Signin, linking: boolean = false) {
    const url = linking ? `${this.group}/web3-wallet-link` : `${this.group}/web3-wallet-signin`;
    
    return this.request<User>(url, {
      method: 'POST',
      body: JSON.stringify(signin),
    });
  }

  /**
   * Select a web3 wallet for authentication.
   * @param wallet - the wallet address to select.
   * @returns A promise that resolves to an APIResponse containing the user data or an error.
   */
  async web3SelectWallet(wallet: string) {
    return this.request<User>(`${this.group}/web3-select-wallet`, {
      method: 'POST',
      body: JSON.stringify({ wallet }),
    });
  }

  /**
   * Unlink a web3 wallet from the user's account.
   * @param wallet - the wallet address to unlink.
   * @returns A promise that resolves to an APIResponse containing the user data or an error.
   */
  async web3UnlinkWallet(wallet: string) {
    return this.request<User>(`${this.group}/web3-unlink-wallet`, {
      method: 'POST',
      body: JSON.stringify({ wallet }),
    });
  }

  /**
   * Logs out the current user by making a request to the `/auth/signout` endpoint.
   *
   * @returns A promise that resolves with the response from the logout request.
   */
  async logout() {
    return this.request(`${this.group}/signout`);
  }
}
