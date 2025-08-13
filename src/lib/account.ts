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
import AccountAPI from '@service/routesv2/account';
import { authenticated, referralCodes } from '@stores/account.svelte';
import { toastStore } from '@stores/toast.svelte';

class Account {
  private accountAPI: AccountAPI;

  constructor() {
    this.accountAPI = new AccountAPI(import.meta.env.PUBLIC_BACKEND);
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
    const { status, message, data } = await this.accountAPI.me();

    switch (status) {
      case 'error':
        api_error(message, false);
        break;
      case 'success':
        if (!data) {
          toastStore.show('Error getting current user', 'error');
          ClearCache('auth');
          return;
        }
        SetCache(USER_KEY, data, TTL_HOUR);
        authenticated.set(data);
        break;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }
  }

  /**
   * Fetch the current user's information.
   * @returns {Promise<User | null>}
   */
  static async getUser(): Promise<User | null> {
    const accountAPI = new AccountAPI(import.meta.env.PUBLIC_BACKEND);
    const { status, message, data } = await accountAPI.me();

    if (status === 'error') {
      api_error(message);
      return null;
    }

    if (!data) {
      ClearCache('auth');
      return null;
    }

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
    const { status, message } = await this.accountAPI.confirmEmail(token);

    switch (status) {
      case 'error':
        api_error(message);
        return false;
      case 'success':
        toastStore.show(message || 'Email confirmed successfully', 'info');
        return true;
      default:
        toastStore.show('Unknown error occurred', 'error');
        return false;
    }
  }

  /**
   * Change the user's password.
   * @param changePasswordData The new password data.
   */
  async changePassword(changePasswordData: ChangePassword): Promise<void> {
    const { status, message } = await this.accountAPI.changePassword(
      changePasswordData.old_password,
      changePasswordData.new_password,
    );

    switch (status) {
      case 'error':
        api_error(message);
        break;
      case 'success':
        toastStore.show(message || 'Password changed successfully', 'info');
        break;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }
  }

  /**
   * Change the user's username.
   * @param username The new username.
   */
  async changeUsername(username: string): Promise<void> {
    const { status, message } = await this.accountAPI.changeUsername(username);

    switch (status) {
      case 'error':
        api_error(message);
        break;
      case 'success':
        toastStore.show(message || 'Username changed successfully', 'info');
        break;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }
  }

  /**
   * Change the user's avatar.
   * @param imageURL The URL of the new avatar image.
   * @param avatarFile The new avatar image file.
   */
  async changeAvatar(imageURL?: string, avatarFile?: File): Promise<void> {
    const { status, message } = await this.accountAPI.changeAvatar(
      imageURL,
      avatarFile,
    );

    switch (status) {
      case 'error':
        api_error(message);
        break;
      case 'success':
        toastStore.show(message || 'Avatar changed successfully', 'info');
        break;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }
  }

  /**
   * Generate a new referral code.
   * @returns {Promise<string | null>}
   */
  async generateReferralCode(): Promise<string | null> {
    const { status, message, data } =
      await this.accountAPI.createReferralCodes();

    switch (status) {
      case 'error':
        api_error(message);
        return null;
      case 'success':
        if (!data) {
          toastStore.show('Error generating referral codes', 'error');
          return null;
        }
        toastStore.show(
          message || 'Referral codes generated successfully',
          'info',
        );
        return data;
      default:
        toastStore.show('Unknown error occurred', 'error');
        return null;
    }
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
    const { status, message, data } = await this.accountAPI.getReferralCodes();

    switch (status) {
      case 'error':
        api_error(message);
        return;
      case 'success':
        if (!data) {
          toastStore.show('Error getting referral codes', 'error');
          return;
        }
        referralCodes.set(data);
        SetCache(REFERRAL_CODES_KEY, data, TTL_SHORT);
        break;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }
  }

  /**
   * Use a referral code.
   * @param code The referral code to use.
   * @returns {Promise<void>}
   */
  async useReferralCode(code: string): Promise<void> {
    const { status, message } = await this.accountAPI.useReferralCode(code);

    switch (status) {
      case 'error':
        api_error(message);
        return;
      case 'success':
        toastStore.show(message || 'Referral code used successfully', 'info');
        break;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }
  }

  /**
   * Subscribe the user to the newsletter.
   * @param email The email address to subscribe.
   */
  async subscribeNewsletter(email: string): Promise<void> {
    const { status, message } =
      await this.accountAPI.subscribeNewsletter(email);

    switch (status) {
      case 'error':
        api_error(message);
        break;
      case 'success':
        toastStore.show(message || 'Subscribed to newsletter', 'info');
        SetCache(SUBSCRIPTION_STATUS_KEY, true, TTL_SHORT);
        break;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }
  }

  /**
   * Unsubscribe the user from the newsletter.
   * @param email The email address to unsubscribe.
   */
  async unsubscribeNewsletter(email: string): Promise<void> {
    const { status, message } =
      await this.accountAPI.unsubscribeNewsletter(email);

    switch (status) {
      case 'error':
        api_error(message);
        break;
      case 'success':
        toastStore.show(message || 'Unsubscribed from newsletter', 'info');
        SetCache(SUBSCRIPTION_STATUS_KEY, false, TTL_SHORT);
        break;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }
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
    const { status, message, data } = await this.accountAPI.isSubscribed(email);

    switch (status) {
      case 'error':
        api_error(message);
        toastStore.show(message);
        return false;
      case 'success':
        if (!data) {
          toastStore.show('Error getting subscription status', 'error');
          return false;
        }
        // Store in localStorage with expiry timestamp
        SetCache(SUBSCRIPTION_STATUS_KEY, data, TTL_SHORT);
        return data;
      default:
        toastStore.show('Unknown error occurred', 'error');
        return false;
    }
  }

  /**
   * Create a new bookmark folder.
   * @param name The name of the folder to create.
   */
  async createBookmarkFolder(name: string): Promise<void> {
    const { status, message } =
      await this.accountAPI.createBookmarkFolder(name);

    switch (status) {
      case 'error':
        api_error(message);
      case 'success':
        toastStore.show(
          message || 'Bookmark folder created successfully',
          'info',
        );
      default:
        toastStore.show('Unknown error occurred', 'error');
    }
  }

  /**
   * Get the user's bookmark folders.
   * @returns {Promise<BookmarkFolder[] | null>}
   */
  async getBookmarkFolders(): Promise<BookmarkFolder[] | null> {
    const { status, message, data } =
      await this.accountAPI.getBookmarkFolders();

    switch (status) {
      case 'error':
        api_error(message);
        return null;
      case 'success':
        if (!data) {
          toastStore.show('Error getting bookmark folders', 'error');
          return null;
        }
        toastStore.show(
          message || 'Bookmark folders retrieved successfully',
          'info',
        );
        return data;
      default:
        toastStore.show('Unknown error occurred', 'error');
        return null;
    }
  }

  /**
   * Get the topics in a bookmark folder.
   * @param folderId The ID of the folder to retrieve topics from.
   * @returns {Promise<Bookmark[] | null>}
   */
  async getBookmarkFolderTopic(
    folderId: string,
  ): Promise<Bookmark[] | null> {
    const { status, message, data } =
      await this.accountAPI.getFolderBookmarks(folderId);

    switch (status) {
      case 'error':
        api_error(message);
        return null;
      case 'success':
        if (!data) {
          toastStore.show('Error getting bookmark folder topics', 'error');
          return null;
        }
        toastStore.show(
          message || 'Bookmark folder topics retrieved successfully',
          'info',
        );
        return data;
      default:
        toastStore.show('Unknown error occurred', 'error');
        return null;
    }
  }

  /**
   * Create a new bookmark tag.
   * @param name The name of the tag to create.
   */
  async createBookmarkTag(name: string): Promise<void> {
    const { status, message } = await this.accountAPI.createBookmarkTag(name);

    switch (status) {
      case 'error':
        api_error(message);
        break;
      case 'success':
        toastStore.show(message || 'Bookmark tag created successfully', 'info');
        break;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }
  }

  /**
   * Get the user's bookmark tags.
   * @returns {Promise<BookmarkTag[] | null>}
   */
  async getBookmarkTags(): Promise<BookmarkTag[] | null> {
    const { status, message, data } = await this.accountAPI.getBookmarkTags();

    switch (status) {
      case 'error':
        api_error(message);
        return null;
      case 'success':
        if (!data) {
          toastStore.show('Error getting bookmark tags', 'error');
          return null;
        }
        toastStore.show(
          message || 'Bookmark tags retrieved successfully',
          'info',
        );
        return data;
      default:
        toastStore.show('Unknown error occurred', 'error');
        return null;
    }
  }

  /**
   * Get the topics in a bookmark tag.
   * @param tagID The ID of the tag to retrieve topics from.
   * @returns {Promise<Bookmark[] | null>}
   */
  async getBookmarkTagsTopic(tagID: string): Promise<Bookmark[] | null> {
    const { status, message, data } =
      await this.accountAPI.getTagBookmarks(tagID);

    switch (status) {
      case 'error':
        api_error(message);
        return null;
      case 'success':
        if (!data) {
          toastStore.show('Error getting bookmark folder topics', 'error');
          return null;
        }
        toastStore.show(
          message || 'Bookmark folder topics retrieved successfully',
          'info',
        );
        return data;
      default:
        toastStore.show('Unknown error occurred', 'error');
        return null;
    }
  }

  /**
   * Bookmark a topic.
   * @param body The bookmark data to create.
   */
  async bookmarkTopic(body: Bookmark): Promise<void> {
    const { status, message } = await this.accountAPI.bookmarkTopic(body);

    switch (status) {
      case 'error':
        api_error(message);
        break;
      case 'success':
        toastStore.show(message || 'Topic bookmarked successfully', 'info');
        break;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }
  }

  /**
   * Get a bookmark by its ID.
   * @param bookmarkId The ID of the bookmark to retrieve.
   * @returns {Promise<Bookmark | null>}
   */
  async getBookmark(bookmarkId: string): Promise<Bookmark | null> {
    const { status, message, data } =
      await this.accountAPI.getBookmark(bookmarkId);

    switch (status) {
      case 'error':
        api_error(message);
        return null;
      case 'success':
        if (!data) {
          toastStore.show('Error getting bookmark', 'error');
          return null;
        }
        toastStore.show(message || 'Bookmark retrieved successfully', 'info');
        return data;
      default:
        toastStore.show('Unknown error occurred', 'error');
        return null;
    }
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
    const { status, message } = await this.accountAPI.updateBookmark(
      bookmarkId,
      updatedData,
    );

    switch (status) {
      case 'error':
        api_error(message);
        break;
      case 'success':
        toastStore.show(message || 'Bookmark updated successfully', 'info');
        break;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }
  }

  /**
   * Delete a bookmark.
   * @param bookmarkId The ID of the bookmark to delete.
   */
  async deleteBookmark(bookmarkId: string): Promise<void> {
    const { status, message } =
      await this.accountAPI.deleteBookmark(bookmarkId);

    switch (status) {
      case 'error':
        api_error(message);
        break;
      case 'success':
        toastStore.show(message || 'Bookmark deleted successfully', 'info');
        break;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }
  }

  /**
   * Get user stories.
   * @param ended Whether the stories have ended.
   * @param date_range The date range to filter stories.
   * @returns {Promise<DashboardTopic[] | null>}
   */
  async getUserStories(
    ended: boolean,
    date_range: DateRange,
  ): Promise<DashboardTopic[] | null> {
    const { status, message, data } = await this.accountAPI.getStories({
      ended,
      date_range,
    });

    switch (status) {
      case 'error':
        api_error(message);
        return null;
      case 'success':
        if (!data) {
          toastStore.show('Error getting stories', 'error');
          return null;
        }
        toastStore.show(message || 'Stories retrieved successfully', 'info');
        return data;
      default:
        toastStore.show('Unknown error occurred', 'error');
        return null;
    }
  }
}

export default Account;
