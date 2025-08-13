import Fetcher from '@service/fetcher';

/**
 * An API class for handling account requests.
 */
/**
 * AccountAPI provides methods for interacting with user account-related endpoints.
 *
 * This class extends Fetcher and encapsulates API calls for:
 * - Retrieving current user details
 * - Confirming email addresses
 * - Changing password, username, and avatar
 * - Managing referral codes
 * - Subscribing and unsubscribing to newsletters
 * - Checking newsletter subscription status
 * - Logging out the current user
 *
 * Each method returns a Promise resolving to type APIResponse containing the relevant data or error.
 */
export default class AccountAPI extends Fetcher {
  protected group: string = '/account';

  /**
   * Retrieves the current user's account information.
   *
   * @param token - Optional bearer token for authentication. If provided, it will be included in the request headers.
   * @returns A promise that resolves to the user's account information.
   */
  async me(token?: string) {
    return this.request<User>(`${this.group}/me`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  /**
   * Confirm the user's email address.
   * @param token - The confirmation token.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async confirmEmail(token: string) {
    return this.request(`${this.group}/confirm-email?token=${token}`);
  }

  /**
   * Update the user's profile details.
   * @param old_password - The user's old password.
   * @param new_password - The user's new password.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async changePassword(old_password: string, new_password: string) {
    const formData = new FormData();

    formData.append('old_password', old_password);
    formData.append('new_password', new_password);

    return this.request(`${this.group}/change-password`, {
      method: 'POST',
      body: formData,
    });
  }

  /**
   * Change Username
   * @param new_username - The new username to set.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   */
  async changeUsername(new_username: string) {
    return this.request(
      `${this.group}/change-username?new_username=${new_username}`,
    );
  }

  /**
   * Change Avatar accepts an image url or a new avatar file
   * @param image_url - The new avatar image URL.
   * @param new_avatar - The new avatar image to set.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   */
  async changeAvatar(image_url?: string, new_avatar?: File) {
    const formData = new FormData();
    if (image_url) formData.append('image_url', image_url);
    if (new_avatar) formData.append('file', new_avatar);

    return this.request(`/account/change-avatar`, {
      method: 'POST',
      body: formData,
    });
  }

  /* DASHBOARD */

  /**
   * Generate referral codes for the user to share with others.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async createReferralCodes() {
    return this.request<string>(`${this.group}/new-referral-code`);
  }

  /**
   * Get the user's referral codes.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async getReferralCodes() {
    return this.request<ReferralCode[]>(`${this.group}/get-referral-codes`);
  }

  /**
   * Use a referral code provided by another user.
   * @param code - The referral code to use.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   * */
  async useReferralCode(code: string) {
    const formData = new FormData();
    formData.append('code', code);

    return this.request(`${this.group}/use-referral-code`, {
      method: 'POST',
      body: formData,
    });
  }

  /**
   * Subscribe the user to the newsletter.
   * @param email - The email address to subscribe.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   */
  async subscribeNewsletter(email: string) {
    return this.request(`${this.group}/subscribe-newsletter?email=${email}`);
  }

  /**
   * Unsubscribe the user from the newsletter.
   * @param email - The email address to unsubscribe.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   */
  async unsubscribeNewsletter(email: string) {
    return this.request(`${this.group}/unsubscribe-newsletter?email=${email}`);
  }

  /**
   * Check if the user is subscribed to the newsletter.
   *
   * @param email - The email address to check.
   * @returns A promise that resolves to an APIResponse containing the response data or an error.
   */
  async isSubscribed(email: string) {
    return this.request<boolean>(
      `${this.group}/is-subscribed-newsletter?email=${email}`,
    );
  }

  /**
   * New Bookmark Folder
   *
   * @param name - The name of the new folder.
   * @returns A promise that resolves to the created folder's information or an error.
   */
  async createBookmarkFolder(name: string) {
    return this.request(`${this.group}/new-bookmark-folder?name=${name}`);
  }

  /**
   * Get Bookmark Folders
   *
   * @returns A promise that resolves to an array of bookmark folders or an error.
   */
  async getBookmarkFolders() {
    return this.request<BookmarkFolder[]>(`${this.group}/get-bookmark-folders`);
  }

  /**
   * Get Bookmark Folder Topics
   *
   * @param folderId - The ID of the bookmark folder to retrieve.
   * @returns A promise that resolves to the dashboard topics information or an error.
   */
  async getFolderBookmarks(folderId: string) {
    return this.request<Bookmark[]>(
      `${this.group}/get-bookmark-folder-topics/${folderId}`,
    );
  }

  /**
   * New Bookmark Tag
   *
   * @param name - The name of the new folder.
   * @returns A promise that resolves to the created folder's information or an error.
   */
  async createBookmarkTag(name: string) {
    return this.request(`${this.group}/new-bookmark-tag?name=${name}`);
  }

  /**
   * Get Bookmark Tags
   *
   * @returns A promise that resolves to an array of bookmark tags or an error.
   */
  async getBookmarkTags() {
    return this.request<BookmarkTag[]>(`${this.group}/get-bookmark-tags`);
  }

  /**
   * Get Bookmark Tag Topics
   *
   * @param tagId - The ID of the bookmark tag to retrieve.
   * @returns A promise that resolves to the dashboard topics  or an error.
   */
  async getTagBookmarks(tagId: string) {
    return this.request<Bookmark[]>(`${this.group}/get-bookmark-tag-topics/${tagId}`);
  }

  /**
   * Bookmark a topic.
   *
   * @param bookmarkRequest - The request object containing bookmark details.
   * @returns A promise that resolves to the created bookmark's information or an error.
   */
  async bookmarkTopic(bookmarkRequest: Bookmark) {
    return this.request(`${this.group}/bookmark-topic`, {
      method: 'POST',
      body: JSON.stringify(bookmarkRequest),
    });
  }

  /**
   * Get a Bookmark
   *
   * @param bookmarkId - The ID of the bookmark to retrieve.
   * @returns A promise that resolves to the bookmark's information or an error.
   */
  async getBookmark(bookmarkId: string) {
    return this.request<Bookmark>(`${this.group}/get-bookmark/${bookmarkId}`);
  }

  /**
   * Get Bookmarks
   *
   * @returns A promise that resolves to an array of bookmarks or an error.
   */
  async getBookmarks() {
    return this.request<Bookmark[]>(`${this.group}/get-bookmarks`);
  }

  /**
   * Update Bookmark
   *
   * @param bookmarkId - The ID of the bookmark to update.
   * @param updateData - The updated bookmark data.
   * @returns A promise that resolves to the updated bookmark's information or an error.
   */
  async updateBookmark(bookmarkId: string, updateData: Partial<Bookmark>) {
    return this.request(`${this.group}/update-bookmark/${bookmarkId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  }

  /**
   * Delete Bookmark
   *
   * @param bookmarkId - The ID of the bookmark to delete.
   * @returns A promise that resolves to the deleted bookmark's information or an error.
   */
  async deleteBookmark(bookmarkId: string) {
    return this.request(`${this.group}/delete-bookmark/${bookmarkId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get User Stories
   * @param request - The request object containing filter criteria.
   * @returns A promise that resolves to an array of user stories or an error.
   */
  async getStories(request: UserStoriesFilter) {
    return this.request<DashboardTopic[]>(`${this.group}/stories`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}
