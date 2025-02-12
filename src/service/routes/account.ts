import Fetcher from '@service/fetcher';

/**
 * An API class for handling account requests.
 */
export default class AccountAPI extends Fetcher {
  /**
   * Sends a request to get the current user's details.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   */
  async me() {
    return this.request<{ user: User }>('/account/me');
  }

  /**
   * Link a new wallet to the user's account.
   * @param signin - The wallet details to link.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async web3WalletLink(signin: Web3Signin) {
    return this.request<{ user: User }>('/account/web3-wallet-link', {
      method: 'POST',
      body: JSON.stringify(signin),
    });
  }

  /**
   * Unlink the specified wallet from the user's account.
   * @param signin - The wallet details to unlink.
   * @returns A promise that resolves to an APIResponse containing the response data or
   * an error.
   * */
  async web3WalletUnlink(signin: Web3Signin) {
    // TODO: Define in backend
    return this.request<{ success: boolean }>('/account/web3-wallet-unlink', {
      method: 'POST',
      body: JSON.stringify(signin),
    });
  }

  /**
   * Select a wallet to use for the user's account.
   * @param wallet - The wallet address to select.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async web3SelectWallet(wallet: string) {
    return this.request<{ user: User }>('/account/web3-select-wallet', {
      method: 'POST',
      body: JSON.stringify(wallet),
    });
  }

  /**
   * Update the user's profile details.
   * @param profile - The profile details to update.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async changePassword(passwords: { old: string; new: string }) {
    return this.request<{ success: boolean; message: string }>(
      '/account/change-password',
      {
        method: 'POST',
        body: JSON.stringify(passwords),
      },
    );
  }

  /**
   * Logout the current user.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async logout() {
    return this.request<{ success: boolean; message: string }>(
      '/account/logout',
    );
  }

  /**
   * Use a referral code provided by another user.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async useReferralCode(code: string) {
    return this.request<{ success: boolean; message: string }>(
      `/account/use-referral-code/${code}`,
    );
  }

  /**
   * Generate referral codes for the user to share with others.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async createReferralCodes() {
    return this.request<{ codes: ReferralCode[] }>(
      '/account/create-referral-codes',
    );
  }

  /**
   * Get the user's referral codes.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async getReferralCodes() {
    return this.request<{ codes: ReferralCode[] }>('/account/referral-codes');
  }

  /**
   * Validate a referral code provided by another user.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async validateReferralCode(code: string) {
    return this.request<{ valid: boolean; referral: ReferralCode }>(
      `/account/validate-referral-code/${code}`,
    );
  }
}
