import {
  USER_KEY,
  TTL_HOUR,
  REFERRAL_CODES_KEY,
  TTL_SHORT,
  SUBSCRIPTION_STATUS_KEY,
  ClearCache,
  GetCache,
  SetCache,
} from '@constants/cache';
import { api_error } from '@errors/index';
import AccountAPI from '@service/router/account';
import { authenticated, referralCodes } from '@stores/account.svelte';
import { toastStore } from '@stores/toast.svelte';
import NotificationService from './notification';

class Account {
  protected api: AccountAPI;
  notification: NotificationService;

  constructor() {
    this.api = new AccountAPI(import.meta.env.PUBLIC_BACKEND);
    this.notification = new NotificationService(this.api);
  }

  /**
   * Fetch the current user's information.
   * @returns {Promise<void>}
   */
  async me(): Promise<void> {
    // Try getting user data from localStorage
    const cachedUser = GetCache<User>(USER_KEY);
    if (cachedUser) {
      authenticated.set(cachedUser);
      return;
    }

    // If no valid cached user, fetch from API
    const { message, data } = await this.api.me();

    if (!data) {
      api_error(message, false);
      return;
    }

    const roles = await this.#roles();
    data.role = roles.find((r) => r.id === data.role_id)?.name || 'Guest';

    SetCache(USER_KEY, data, TTL_HOUR);
    authenticated.set(data);
  }

  /**
   * Fetch the current user's information.
   * @returns {Promise<User | null>}
   */
  static async getUser(): Promise<User | null> {
    const accountAPI = new AccountAPI(import.meta.env.PUBLIC_BACKEND);

    const { message, data } = await accountAPI.me();

    if (!data) {
      ClearCache('auth');
      api_error(message);
      return null;
    }

    const { message: roleMessage, data: roles } = await accountAPI.getRoles();

    if (!roles) {
      api_error(roleMessage);
      data.role = 'Guest';
      return data;
    }

    data.role = roles.find((r) => r.id === data.role_id)?.name || 'Guest';

    // Store user data in localStorage with timestamp
    SetCache(USER_KEY, data, TTL_HOUR);
    authenticated.set(data);

    return data;
  }

  /**
   * Confirm the user's email address.
   * @param token The confirmation token.
   * @returns {Promise<boolean>} True if the email was confirmed, false otherwise.
   */
  async confirmEmail(token: string): Promise<boolean> {
    const { status, message } = await this.api.confirmEmail(token);

    if (status === 'error') {
      api_error(message);
      return false;
    }

    toastStore.show(message || 'Email confirmed successfully', 'info');
    return true;
  }

  /**
   * Change the user's password.
   * @param changePasswordData The new password data.
   */
  async changePassword(changePasswordData: ChangePassword): Promise<void> {
    const { status, message } = await this.api.changePassword(
      changePasswordData.old_password,
      changePasswordData.new_password,
    );

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Password changed successfully', 'info');
  }

  /**
   * Change the user's username.
   * @param username The new username.
   */
  async changeUsername(username: string): Promise<void> {
    const { status, message } = await this.api.changeUsername(username);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Username changed successfully', 'info');
  }

  /**
   * Change the user's avatar.
   * @param imageURL The URL of the new avatar image.
   * @param avatarFile The new avatar image file.
   */
  async changeAvatar(imageURL?: string, avatarFile?: File): Promise<void> {
    const { status, message } = await this.api.changeAvatar(
      imageURL,
      avatarFile,
    );

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Avatar changed successfully', 'info');
  }

  /**
   * Generate a new referral code.
   * @returns {Promise<string | null>}
   */
  async generateReferralCode(): Promise<string | null> {
    const { message, data } = await this.api.createReferralCodes();

    if (!data) {
      api_error(message);
      return null;
    }

    toastStore.show(message || 'Referral codes generated successfully', 'info');
    return data;
  }

  /**
   * Get the user's referral codes.
   * @returns {Promise<void>}
   */
  async getReferralCodes(): Promise<void> {
    const cachedData = GetCache<ReferralCode[]>(REFERRAL_CODES_KEY);
    if (cachedData) {
      referralCodes.set(cachedData);
      return;
    }

    // Fetch fresh data
    const { message, data } = await this.api.getReferralCodes();

    if (!data) {
      api_error(message);
      return;
    }

    referralCodes.set(data);
    SetCache(REFERRAL_CODES_KEY, data, TTL_SHORT);
  }

  /**
   * Use a referral code.
   * @param code The referral code to use.
   * @returns {Promise<void>}
   */
  async useReferralCode(code: string): Promise<boolean> {
    const { status, message } = await this.api.useReferralCode(code);

    if (status === 'error') {
      api_error(message);
      return false;
    }

    toastStore.show(message || 'Referral code used successfully', 'info');
    return true;
  }

  /**
   * Subscribe the user to the newsletter.
   * @param email The email address to subscribe.
   */
  async subscribeNewsletter(email: string): Promise<void> {
    const { status, message } = await this.api.subscribeNewsletter(email);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Subscribed to newsletter', 'info');
    SetCache(SUBSCRIPTION_STATUS_KEY, true, TTL_SHORT);
  }

  /**
   * Unsubscribe the user from the newsletter.
   * @param email The email address to unsubscribe.
   */
  async unsubscribeNewsletter(email: string): Promise<void> {
    const { status, message } = await this.api.unsubscribeNewsletter(email);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Unsubscribed from newsletter', 'info');
    SetCache(SUBSCRIPTION_STATUS_KEY, false, TTL_SHORT);
  }

  /**
   * Get the user's subscription status.
   * @param email The email address to check.
   * @returns {Promise<boolean>}
   */
  async subscriptionStatus(email: string): Promise<boolean> {
    const cachedData = GetCache<boolean>(SUBSCRIPTION_STATUS_KEY);
    if (cachedData) {
      return cachedData;
    }

    // Fetch fresh data
    const { status, message, data } = await this.api.isSubscribed(email);

    if (status === 'error') {
      api_error(message);
      return false;
    }

    SetCache(SUBSCRIPTION_STATUS_KEY, data, TTL_SHORT);
    return data || false;
  }

  /**
   * Create a new bookmark folder.
   * @param name The name of the folder to create.
   */
  async createBookmarkFolder(name: string): Promise<void> {
    const { status, message } = await this.api.createBookmarkFolder(name);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Bookmark folder created successfully', 'info');
  }

  /**
   * Get the user's bookmark folders.
   * @returns {Promise<BookmarkFolder[] | null>}
   */
  async getBookmarkFolders(): Promise<BookmarkFolder[]> {
    const { status, message, data } = await this.api.getBookmarkFolders();

    if (status === 'error') {
      api_error(message);
      return [];
    }

    toastStore.show(
      message || 'Bookmark folders retrieved successfully',
      'info',
    );
    return data || [];
  }

  /**
   * Get the topics in a bookmark folder.
   * @param folderId The ID of the folder to retrieve topics from.
   * @returns {Promise<Bookmark[] | null>}
   */
  async getBookmarkFolderTopic(folderId: string): Promise<Bookmark[]> {
    const { message, data } = await this.api.getFolderBookmarks(folderId);

    if (!data) {
      api_error(message);
      return [];
    }

    toastStore.show(
      message || 'Bookmark folder topics retrieved successfully',
      'info',
    );
    return data;
  }

  /**
   * Create a new bookmark tag.
   * @param name The name of the tag to create.
   */
  async createBookmarkTag(name: string): Promise<void> {
    const { status, message } = await this.api.createBookmarkTag(name);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Bookmark tag created successfully', 'info');
  }

  /**
   * Get the user's bookmark tags.
   * @returns {Promise<BookmarkTag[] | null>}
   */
  async getBookmarkTags(): Promise<BookmarkTag[]> {
    const { message, data } = await this.api.getBookmarkTags();

    if (!data) {
      api_error(message);
      return [];
    }

    toastStore.show(message || 'Bookmark tags retrieved successfully', 'info');
    return data;
  }

  /**
   * Get the topics in a bookmark tag.
   * @param tagID The ID of the tag to retrieve topics from.
   * @returns {Promise<Bookmark[] | null>}
   */
  async getBookmarkTagsTopic(tagID: string): Promise<Bookmark[] | null> {
    const { message, data } = await this.api.getTagBookmarks(tagID);

    if (!data) {
      api_error(message);
      return null;
    }

    toastStore.show(
      message || 'Bookmark folder topics retrieved successfully',
      'info',
    );

    return data;
  }

  /**
   * Bookmark a topic.
   * @param body The bookmark data to create.
   */
  async bookmarkTopic(body: Bookmark): Promise<void> {
    const { status, message } = await this.api.bookmarkTopic(body);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Topic bookmarked successfully', 'info');
  }

  /**
   * Get a bookmark by its ID.
   * @param bookmarkId The ID of the bookmark to retrieve.
   * @returns {Promise<Bookmark | null>}
   */
  async getBookmark(bookmarkId: string): Promise<Bookmark | null> {
    const { message, data } = await this.api.getBookmark(bookmarkId);

    if (!data) {
      api_error(message);
      return null;
    }

    toastStore.show(message || 'Bookmark retrieved successfully', 'info');
    return data;
  }

  /**
   * Update a bookmark.
   * @param bookmarkId The ID of the bookmark to update.
   * @param updatedData The updated bookmark data.
   */
  async updateBookmark(
    bookmarkId: string,
    updatedData: Partial<Bookmark>,
  ): Promise<void> {
    const { status, message } = await this.api.updateBookmark(
      bookmarkId,
      updatedData,
    );

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Bookmark updated successfully', 'info');
  }

  /**
   * Delete a bookmark.
   * @param bookmarkId The ID of the bookmark to delete.
   */
  async deleteBookmark(bookmarkId: string): Promise<void> {
    const { status, message } = await this.api.deleteBookmark(bookmarkId);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Bookmark deleted successfully', 'info');
  }

  /**
   * Get user stories.
   * @param ended Whether the stories have ended.
   * @param date_range The date range to filter stories.
   * @returns {Promise<DashboardTopic[] | null>}
   */
  async getUserStories(
    ended: boolean,
    duration: DurationEnum,
  ): Promise<DashboardTopic[] | null> {
    const { message, data } = await this.api.getStories({
      ended,
      duration,
    });

    if (!data) {
      api_error(message);
      return null;
    }

    toastStore.show(message || 'Stories retrieved successfully', 'info');
    return data;
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

export default Account;
