import {
  SetCache,
  GetCache,
  ClearCache,
  USER_KEY,
  REFERRAL_CODES_KEY,
  SUBSCRIPTION_STATUS_KEY,
  BOOKMARKS_KEY,
  BOOKMARK_TAGS_KEY,
  TTL_SHORT,
  TTL_HOUR,
  TTL_DAY,
} from '@constants/cache';
import { api_error } from '@errors/index';
import { AccountAPI, AuthAPI } from '@service/routes';
import {
  authenticated,
  referralCodes,
  accountError,
} from '@stores/account.svelte';
import { toastStore } from '@stores/toast.svelte';

class Account {
  private accountAPI: AccountAPI;
  private authAPI: AuthAPI;

  constructor() {
    this.accountAPI = new AccountAPI(import.meta.env.PUBLIC_BACKEND);
    this.authAPI = new AuthAPI(import.meta.env.PUBLIC_BACKEND);
  }

  async signin(signinData: SignIn): Promise<void> {
    const { data, error } = await this.authAPI.signin(
      signinData.email,
      signinData.password,
    );

    if (!data) {
      if (error) {
        accountError.set({ signin: error.message });
      } else {
        accountError.set({ signin: 'Error signing in' });
      }
      return;
    }

    // Store user data in localStorage with timestamp
    SetCache(USER_KEY, data.user, TTL_HOUR);
    window.location.reload();
  }

  async signup(signupData: ReferralSignUp): Promise<Nullable<void>> {
    const { data, error } = await this.authAPI.signup(signupData);

    if (!data) {
      if (error) {
        accountError.set({ signup: error.message });
      } else {
        accountError.set({ signup: 'Error signing up' });
      }
      return null;
    }

    // Store user data in localStorage with timestamp
    SetCache(USER_KEY, data.user, TTL_HOUR);

    authenticated.set(data.user);
  }

  async validateReferralCode(code: string): Promise<ReferralCode | null> {
    const { data, error } = await this.authAPI.validateReferralCode(code);

    if (!data) {
      if (error) {
        accountError.set({ validateReferralCode: error.message });
      } else {
        accountError.set({
          validateReferralCode: 'Error validating referral code',
        });
      }
      return null;
    }

    return data.referral;
  }

  async googleSignin(): Promise<void> {
    const { data, error } = await this.authAPI.googleSignin();

    if (!data) {
      if (error) {
        accountError.set({ googleSignin: error.message });
      } else {
        accountError.set({ googleSignin: 'Error signing in with google' });
      }
      return;
    }

    window.location.href = data.url;
  }

  async confirmEmail(token: string): Promise<boolean> {
    const { data, error } = await this.accountAPI.confirmEmail(token);

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error confirming email', 'error');
      }
      return false;
    }

    toastStore.show(data.message || 'Email confirmed successfully', 'info');
    return true;
  }

  async subscribeNewsletter(): Promise<void> {
    const { data, error } = await this.accountAPI.subscribeNewsletter();

    const cachedData = GetCache<SubscriptionStatus>(SUBSCRIPTION_STATUS_KEY);
    if (cachedData) {
      cachedData.is_active = true;
      SetCache<SubscriptionStatus>(
        SUBSCRIPTION_STATUS_KEY,
        cachedData,
        TTL_SHORT,
      );
    }

    if (!data) {
      if (error) {
        toastStore.show(error.message);
      } else {
        toastStore.show('Error subscribing to newsletter');
      }
      return;
    }

    toastStore.show(data.message || 'Subscribed to newsletter', 'info');
  }

  async unsubscribeNewsletter(): Promise<void> {
    const { data, error } = await this.accountAPI.unsubscribeNewsletter();

    const cachedData = GetCache<SubscriptionStatus>(SUBSCRIPTION_STATUS_KEY);
    if (cachedData) {
      cachedData.is_active = false;
      SetCache<SubscriptionStatus>(
        SUBSCRIPTION_STATUS_KEY,
        cachedData,
        TTL_SHORT,
      );
    }

    if (!data) {
      if (error) {
        toastStore.show(error.message);
      } else {
        toastStore.show('Error unsubscribing from newsletter');
      }
      return;
    }

    toastStore.show(data.message || 'Unsubscribed from newsletter', 'info');
  }

  async subscriptionStatus(): Promise<SubscriptionStatus> {
    const cachedData = GetCache<SubscriptionStatus>(SUBSCRIPTION_STATUS_KEY);
    if (cachedData) {
      return cachedData;
    }

    // Fetch fresh data
    const { data, error } = await this.accountAPI.subscriptionStatus();

    if (!data) {
      if (error) {
        api_error(error);
        toastStore.show(error.message);
      } else {
        toastStore.show('Error getting subscription status', 'error');
      }
      return { is_active: false, subscribed_at: null, unsubscribed_at: null };
    }

    // Store in localStorage with expiry timestamp
    SetCache(SUBSCRIPTION_STATUS_KEY, data, TTL_SHORT);

    return data;
  }

  async forgotPassword(email: string): Promise<void> {
    const { data, error } = await this.authAPI.forgotPassword(email);

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error sending forgot passowrd', 'error');
      }
      return;
    }

    toastStore.show(data.message || 'Password reset email sent', 'info');
  }

  async resetPassword(resetData: ResetPassword): Promise<void> {
    const { data, error } = await this.authAPI.resetPassword(
      resetData.email,
      resetData.token,
      resetData.password,
    );

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error resetting password', 'error');
      }
      return;
    }

    toastStore.show(data.message || 'Password reset successfully', 'info');
  }

  /* Account API */

  async me(): Promise<void> {
    // Try getting user data from localStorage
    const cachedUser = GetCache<User>(USER_KEY);
    if (cachedUser) {
      authenticated.set(cachedUser);
      return;
    }

    // If no valid cached user, fetch from API
    const { data, error } = await this.accountAPI.me();

    if (!data) {
      if (error) {
        api_error(error, false);
      } else {
        toastStore.show('Error getting current user', 'error');
      }
      ClearCache('auth');
      return;
    }

    // Store user data in localStorage with timestamp
    SetCache(USER_KEY, data.user, TTL_HOUR);

    authenticated.set(data.user);
  }

  static async getUser(): Promise<User | null> {
    const accountAPI = new AccountAPI(import.meta.env.PUBLIC_BACKEND);
    const { data, error } = await accountAPI.me();

    if (!data) {
      if (error) {
        api_error(error);
      }
      ClearCache('auth');
      return null;
    }

    // Store user data in localStorage with timestamp
    SetCache(USER_KEY, data.user, TTL_HOUR);

    authenticated.set(data.user);

    return data.user;
  }

  async changePassword(changePasswrodData: ChangePassword): Promise<void> {
    const { data, error } = await this.accountAPI.changePassword(
      changePasswrodData.old_password,
      changePasswrodData.new_password,
    );

    if (!data) {
      if (error) {
        accountError.set({ changePassword: error.message });
      } else {
        accountError.set({ changePassword: 'Error changing password' });
      }
      return;
    }

    // toastStore.show(data.message || 'Password changed successfully', 'info');
  }

  async signout(): Promise<void> {
    const { data, error } = await this.accountAPI.logout();

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error signing out', 'error');
      }
      ClearCache('auth'); // clear cache anyway
      return;
    }

    // clear user from cache
    ClearCache('auth');
    window.location.reload();
  }

  async selectMainWallet(wallet: string): Promise<void> {
    const { data, error } = await this.accountAPI.web3SelectWallet(wallet);

    if (!data) {
      if (error) {
        accountError.set({ selectMainWallet: error.message });
      } else {
        accountError.set({ selectMainWallet: 'Error changing wallet' });
      }
      return;
    }

    // update user data
    SetCache(USER_KEY, data.user, TTL_HOUR);

    authenticated.set(data.user);
  }

  async generateReferralCode(): Promise<void> {
    const { data, error } = await this.accountAPI.createReferralCodes();

    if (!data) {
      if (error) {
        toastStore.show(error.message);
      } else {
        toastStore.show('Error generating referral codes');
      }
      return;
    }

    referralCodes.set(data.codes);
  }

  async getReferralCodes(): Promise<void> {
    const cachedData = GetCache<ReferralCode[]>(REFERRAL_CODES_KEY);
    if (cachedData) {
      referralCodes.set(cachedData);
      return;
    }

    // Fetch fresh data
    const { data, error } = await this.accountAPI.getReferralCodes();

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error getting referral codes', 'error');
      }
      return;
    }

    // Store in localStorage with expiry timestamp
    SetCache(REFERRAL_CODES_KEY, data.codes, TTL_SHORT);

    referralCodes.set(data.codes);
  }

  async useReferralCode(code: string): Promise<void> {
    const { data, error } = await this.accountAPI.useReferralCode(code);

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error using referral code', 'error');
      }
      return;
    }

    toastStore.show(data.message || 'Referral code used successfully', 'info');
  }

  async bookmarkTopic(topic_id: number): Promise<void> {
    const { data, error } = await this.accountAPI.bookmarkTopic(topic_id);

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error bookmarking topic', 'error');
      }
      return;
    }

    toastStore.show(data.message || 'Topic bookmarked successfully', 'info');
  }

  async unbookmarkTopic(topic_id: number): Promise<void> {
    const { data, error } = await this.accountAPI.unbookmarkTopic(topic_id);

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error unbookmarking topic', 'error');
      }
      return;
    }

    toastStore.show(data.message || 'Topic unbookmarked successfully', 'info');
  }

  async getBookmarkedTopics(): Promise<Bookmark[]> {
    const cachedData = GetCache<Bookmark[]>(BOOKMARKS_KEY);
    if (cachedData) {
      return cachedData;
    }

    // If no cached data, fetch from API
    const { data, error } = await this.accountAPI.getBookmarkedTopics();

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error getting bookmarked topics', 'error');
      }
      return [];
    }

    // Store in localStorage with expiry timestamp
    SetCache(BOOKMARKS_KEY, data.topics, TTL_DAY);

    return data.topics;
  }

  async addTag(name: string, description: string): Promise<void> {
    const { data, error } = await this.accountAPI.addTag({ name, description });

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error adding tag', 'error');
      }
      return;
    }

    toastStore.show(data.message || 'Tag added successfully', 'info');
  }

  async getTags(): Promise<Tag[]> {
    const cachedData = GetCache<Tag[]>(BOOKMARK_TAGS_KEY);
    if (cachedData) {
      return cachedData;
    }

    // If no cached data, fetch from API
    const { data, error } = await this.accountAPI.getTags();

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error getting tags', 'error');
      }
      return [];
    }
    2;

    // Store in localStorage with expiry timestamp
    SetCache(BOOKMARK_TAGS_KEY, data.tags, TTL_DAY);

    return data.tags;
  }

  async removeTag(tag_id: number): Promise<void> {
    const { data, error } = await this.accountAPI.removeTag(tag_id);

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error removing tag', 'error');
      }
      return;
    }

    toastStore.show(data.message || 'Tag removed successfully', 'info');
  }

  async getBookmarkedTopicsByTag(tag_id: number): Promise<Bookmark[]> {
    const { data, error } = await this.accountAPI.getBookmarksByTag(tag_id);

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error getting bookmarked topics by tag', 'error');
      }
      return [];
    }

    return data.bookmarks;
  }
}

export default Account;
