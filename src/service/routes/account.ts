import Fetcher from '@service/fetcher';

/**
 * An API class for handling account requests.
 */
export default class AccountAPI extends Fetcher {
  /**
   * Sends a request to get the current user's details.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   */
  async me(token?: string) {
    return this.request<{ user: User }>('/account/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  /**
   * Confirm the user's email address.
   * @param token - The confirmation token.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async confirmEmail(token: string) {
    return this.request<APISTDResposne>(
      `/account/confirm-email?token=${token}`,
    );
  }

  /**
   * Subscribe the user to the newsletter.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   */
  async subscribeNewsletter() {
    return this.request<APISTDResposne>('/account/subscribe-newsletter');
  }

  /**
   * Unsubscribe the user from the newsletter.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   */
  async unsubscribeNewsletter() {
    return this.request<APISTDResposne>('/account/unsubscribe-newsletter');
  }

  /**
   * Subscription status of the user.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   */
  async subscriptionStatus() {
    return this.request<SubscriptionStatus>('/account/subscription-status');
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
      body: JSON.stringify({ wallet }),
    });
  }

  /**
   * Update the user's profile details.
   * @param profile - The profile details to update.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async changePassword(old_password: string, new_password: string) {
    return this.request<APISTDResposne>('/account/change-account-password', {
      method: 'POST',
      body: JSON.stringify({ old_password, new_password }),
    });
  }

  /**
   * Logout the current user.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async logout() {
    return this.request<APISTDResposne>('/account/logout');
  }

  /**
   * Use a referral code provided by another user.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async useReferralCode(code: string) {
    return this.request<APISTDResposne>(`/account/use-referral-code/${code}`);
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
    return this.request<{ codes: ReferralCode[] }>(
      '/account/get-referral-codes',
    );
  }

  /**
   * Bookmark a topic for the user.
   * @param topic_id - The ID of the topic to bookmark.
   * @returns A promise that resolves to an APIResponse containing the response data or an error
   */
  async bookmarkTopic(topic_id: number) {
    return this.request<APISTDResposne>(`/account/bookmark-topic/${topic_id}`);
  }

  /**
   * Unbookmark a topic for the user.
   * @param topic_id - The ID of the topic to unbookmark.
   * @returns A promise that resolves to an APIResponse containing the response data or an error
   */
  async unbookmarkTopic(topic_id: number) {
    return this.request<APISTDResposne>(
      `/account/unbookmark-topic/${topic_id}`,
      {
        method: 'DELETE',
      },
    );
  }

  /**
   * Get the user's bookmarked topics.
   * @returns A promise that resolves to an APIResponse containing the response data or an error
   */
  async getBookmarkedTopics() {
    return this.request<{ topics: Bookmark[] }>(
      '/account/get-bookmarked-topics',
    );
  }

  /**
   * Add a new tag for the user.
   * @param name - The name of the tag to add.
   * @returns A promise that resolves to an APIResponse containing the response data or an error
   */
  async addTag(tag: Tag) {
    return this.request<APISTDResposne>('/account/add-tag', {
      method: 'POST',
      body: JSON.stringify(tag),
    });
  }

  /**
   * Get the user's tags.
   * @returns A promise that resolves to an APIResponse containing the response data or an error
   */
  async getTags() {
    return this.request<{ tags: Tag[] }>('/account/get-tags');
  }

  /**
   * Delete a tag for the user.
   * @param tag_id - The ID of the tag to delete.
   * @returns A promise that resolves to an APIResponse containing the response data or an error
   */
  async deleteTag(tag_id: number) {
    return this.request<APISTDResposne>(`/account/delete-tag/${tag_id}`, {
      method: 'DELETE',
    });
  }

  /** Bookmark a tag for the user.
   * @param bookmark_id - The ID of the bookmark to associate with the tag.
   * @param tag_id - The ID of the tag to bookmark.
   * @returns A promise that resolves to an APIResponse containing the response data or an error
   */
  async bookmarkTag(bookmark_id: number, tag_id: number) {
    return this.request<APISTDResposne>(
      `/account/bookmark-tag/${bookmark_id}/${tag_id}`,
    );
  }

  /**
   * Remove a tag for the user.
   * @param bookmark_id - The ID of the bookmark associated with the tag.
   * @param tag_id - The ID of the tag to remove.
   * @returns A promise that resolves to an APIResponse containing the response data or an error
   */
  async removeTag(bookmark_id: number, tag_id: number) {
    return this.request<APISTDResposne>(
      `/account/remove-bookmark-tag/${bookmark_id}/${tag_id}`,
      {
        method: 'DELETE',
      },
    );
  }

  /**
   * Get Bookmarks by Tag
   * @param tag_id - The ID of the tag to filter bookmarks.
   * @returns A promise that resolves to an APIResponse containing the response data or an error
   */
  async getBookmarksByTag(tag_id: number) {
    return this.request<{ bookmarks: Bookmark[] }>(
      `/account/get-bookmarks-by-tag/${tag_id}`,
    );
  }
}
