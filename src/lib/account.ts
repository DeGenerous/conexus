import {
  USER_KEY,
  REFERRAL_CODE_KEY,
  SUBSCRIPTION_STATUS_KEY,
  ROLES_KEY,
  TTL_SHORT,
  TTL_MONTH,
  ClearCache,
  GetCache,
  SetCache,
} from '@constants/cache';
import { api_error } from '@errors/index';
import AccountAPI from '@service/v2/account';
import { toastStore } from '@stores/toast.svelte';

import NotificationService from './notification';

/**
 * Provides convenience methods for interacting with account endpoints and caching user state.
 */
class Account {
  protected api: AccountAPI;
  notification: NotificationService;

  /**
   * Instantiate the account service with default dependencies.
   */
  constructor() {
    this.api = new AccountAPI(import.meta.env.PUBLIC_BACKEND);
    this.notification = new NotificationService(this.api);
  }

  /**
   * Fetch the current user's information.
   * @param refresh - Whether to refresh the user data from the server.
   * @returns {Promise<User | null>}
   */
  static async getUser(refresh: boolean = false): Promise<User | null> {
    if (refresh) ClearCache('auth');

    // Try getting user data from localStorage
    const cachedUser = GetCache<User>(USER_KEY);
    if (cachedUser) {
      return cachedUser;
    }

    const accountAPI = new AccountAPI(import.meta.env.PUBLIC_BACKEND);

    const { message, data } = await accountAPI.me(refresh);

    if (!data) {
      ClearCache('auth');
      api_error(message);
      return null;
    }

    // Store user data in localStorage with timestamp
    SetCache(USER_KEY, data, TTL_SHORT);

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
   * Change the user's bio.
   * @param bio The new bio.
   */
  async changeBio(bio: string): Promise<void> {
    const { status, message } = await this.api.changeBio(bio);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Bio changed successfully', 'info');
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
   * @returns {Promise<ReferralCode | null>}
   */
  async getReferralCode(): Promise<ReferralCode | null> {
    const cachedData = GetCache<ReferralCode>(REFERRAL_CODE_KEY);
    if (cachedData) {
      return cachedData;
    }

    // Fetch fresh data
    const { message, data } = await this.api.getReferralCode();

    if (!data) {
      // api_error(message);
      return null;
    }

    SetCache(REFERRAL_CODE_KEY, data, TTL_SHORT);
    return data;
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

    // toastStore.show(
    //   message || 'Bookmark folders retrieved successfully',
    //   'info',
    // );

    return data || [];
  }

  /**
   * Get the topics in a bookmark folder.
   * @param folderId The ID of the folder to retrieve topics from.
   * @returns {Promise<Bookmark[] | null>}
   */
  async getBookmarkFolderTopic(folderId: string): Promise<Bookmark[]> {
    const { status, message, data } =
      await this.api.getFolderBookmarks(folderId);

    if (status === 'error') {
      api_error(message);
      return [];
    }

    // toastStore.show(
    //   message || 'Bookmark folder topics retrieved successfully',
    //   'info',
    // );

    return data || [];
  }

  /**
   * Delete an existing bookmark folder.
   * @param folderId - The identifier of the folder to remove.
   */
  async deleteBookmarkFolder(folderId: string): Promise<void> {
    const { status, message } = await this.api.deleteBookmarkFolder(folderId);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Bookmark folder deleted successfully', 'info');
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
   * @returns {Promise<BookmarkTag[]>}
   */
  async getBookmarkTags(): Promise<BookmarkTag[]> {
    const { status, message, data } = await this.api.getBookmarkTags();

    if (status === 'error') {
      api_error(message);
      return [];
    }

    // toastStore.show(message || 'Bookmark tags retrieved successfully', 'info');

    return data || [];
  }

  /**
   * Get the topics in a bookmark tag.
   * @param tagID The ID of the tag to retrieve topics from.
   * @returns {Promise<Bookmark[]>}
   */
  async getBookmarkTagsTopic(tagID: string): Promise<Bookmark[]> {
    const { status, message, data } = await this.api.getTagBookmarks(tagID);

    if (status === 'error') {
      api_error(message);
      return [];
    }

    // toastStore.show(
    //   message || 'Bookmark folder topics retrieved successfully',
    //   'info',
    // );

    return data || [];
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
    const { status, message, data } = await this.api.getBookmark(bookmarkId);

    if (status === 'error') {
      api_error(message);
      return null;
    }

    return data || null;
  }

  /**
   * Retrieve all bookmarks associated with the current user.
   * @returns A list of bookmarks, or an empty array on failure.
   */
  async getBookmarks(): Promise<Bookmark[]> {
    const { status, message, data } = await this.api.getBookmarks();

    if (status === 'error') {
      api_error(message);
      return [];
    }

    return data || [];
  }

  /**
   * Check whether the provided topic is already bookmarked.
   * @param topic_id - The topic identifier to look up.
   * @returns The bookmark data when present, otherwise null.
   */
  async isTopicBookmarked(topic_id: string): Promise<Bookmark | null> {
    const { status, message, data } = await this.api.checkBookmark(topic_id);

    if (status === 'error') {
      api_error(message);
      return null;
    }

    return data || null;
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
   * @returns {Promise<UserStoriesMetric[] | null>}
   */
  async getUserStories(
    duration: DurationEnum,
    ended: boolean = false,
  ): Promise<UserStoriesMetric[] | null> {
    const { status, message, data } = await this.api.getStories({
      ended,
      duration,
    });

    if (status === 'error') {
      api_error(message);
      return null;
    }

    toastStore.show(message || 'Stories retrieved successfully', 'info');

    return data || null;
  }

  /**
   * Update the user's streak progress.
   * @param action - The streak action to report.
   */
  async streak(action: StreakAction): Promise<void> {
    const { status, message } = await this.api.streak(action);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Streak updated successfully', 'info');
  }

  /**
   * Create or update the user's global prompt settings.
   * @param settings - The prompt configuration to persist.
   */
  async createOrUpdatePromptSettings(settings: PromptSettings): Promise<void> {
    const { status, message } =
      await this.api.createOrUpdatePromptSettings(settings);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Prompt settings updated successfully', 'info');
  }

  /**
   * Retrieve the user's saved prompt settings.
   * @returns The prompt settings or null if unavailable.
   */
  async getPromptSettings(): Promise<PromptSettings | null> {
    const { message, data } = await this.api.getPromptSettings();

    if (!data) {
      api_error(message);
      return null;
    }

    return data;
  }

  /**
   * Create or update the user's custom theme configuration.
   * @param settings - The theme settings to persist.
   */
  async createOrUpdateCustomTheme(settings: CustomTheme): Promise<void> {
    const { status, message } =
      await this.api.createOrUpdateCustomTheme(settings);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Custom theme updated successfully', 'info');
  }

  /**
   * Retrieve the user's custom theme configuration.
   * @returns The stored custom theme or null if not set.
   */
  async getCustomTheme(): Promise<CustomTheme | null> {
    const { message, data } = await this.api.getCustomTheme();

    if (!data) {
      api_error(message);
      return null;
    }

    return data;
  }

  /**
   * Fetch the roles available to the current tenant.
   * @returns The list of roles, or an empty array on failure.
   */
  async fetchRoles(refresh: boolean = false): Promise<TenantRole[]> {
    if (refresh) ClearCache(ROLES_KEY);

    const cached = GetCache<TenantRole[]>(ROLES_KEY);
    if (cached) {
      return cached;
    }

    const { status, message, data } = await this.api.getRoles();

    if (status === 'error') {
      api_error(message);
      return [];
    }

    SetCache(ROLES_KEY, data, TTL_MONTH);

    return data || [];
  }
}

export default Account;
