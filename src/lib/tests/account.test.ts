import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Account from '../account';
import AccountAPI from '@service/router/account';
import { authenticated, referralCodes } from '@stores/account.svelte';
import { toastStore } from '@stores/toast.svelte';
import { api_error } from '@errors/index';

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

// Mocks
vi.mock('@service/router/account', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      me: vi.fn(),
      confirmEmail: vi.fn(),
      changePassword: vi.fn(),
      changeUsername: vi.fn(),
      changeAvatar: vi.fn(),
      createReferralCodes: vi.fn(),
      getReferralCodes: vi.fn(),
      useReferralCode: vi.fn(),
      subscribeNewsletter: vi.fn(),
      unsubscribeNewsletter: vi.fn(),
      isSubscribed: vi.fn(),
      createBookmarkFolder: vi.fn(),
      getBookmarkFolders: vi.fn(),
      getFolderBookmarks: vi.fn(),
      createBookmarkTag: vi.fn(),
      getBookmarkTags: vi.fn(),
      getTagBookmarks: vi.fn(),
      bookmarkTopic: vi.fn(),
      getBookmark: vi.fn(),
      updateBookmark: vi.fn(),
      deleteBookmark: vi.fn(),
      getStories: vi.fn(),
    })),
  };
});

vi.mock('@stores/account.svelte', () => ({
  authenticated: { set: vi.fn() },
  referralCodes: { set: vi.fn() },
}));

vi.mock('@stores/toast.svelte', () => ({
  toastStore: { show: vi.fn() },
}));

vi.mock('@constants/cache', () => ({
  USER_KEY: 'user',
  TTL_HOUR: 3600,
  REFERRAL_CODES_KEY: 'referral_codes',
  TTL_SHORT: 60,
  SUBSCRIPTION_STATUS_KEY: 'subscription_status',
  ClearCache: vi.fn(),
  GetCache: vi.fn(),
  SetCache: vi.fn(),
}));

vi.mock('@errors/index', () => ({
  api_error: vi.fn(),
}));

const mockUser = { id: '1', name: 'Test User' };
const mockReferralCodes = [{ code: 'ABC123' }];
const mockBookmarkFolder = [{ id: 'folder1', name: 'Folder' }];
const mockBookmark = { topic_id: 'bookmark1', bookmark_folder_id: 'Topic' };
const mockBookmarkTag = [{ id: 'tag1', name: 'Tag' }];
const mockDashboardTopic = [{ id: 'topic1', title: 'Story' }];

describe('Account', () => {
  let account: Account;
  let api: any;

  beforeEach(() => {
    account = new Account();
    api = (AccountAPI as any).mock.instances[0];
    vi.clearAllMocks();
  });

  describe('me', () => {
    // it('should use cached user if available', async () => {
    //   (GetCache as any).mockReturnValue(mockUser);
    //   await account.me();
    //   expect(authenticated.set).toHaveBeenCalledWith(mockUser);
    //   expect(api.me).not.toHaveBeenCalled();
    // });

    // it('should fetch user from API if not cached', async () => {
    //   (GetCache as any).mockReturnValue(null);
    //   api.me.mockResolvedValue({
    //     status: 'success',
    //     message: '',
    //     data: mockUser,
    //   });
    //   await account.me();
    //   expect(SetCache).toHaveBeenCalledWith(USER_KEY, mockUser, TTL_HOUR);
    //   expect(authenticated.set).toHaveBeenCalledWith(mockUser);
    // });

    it('should handle error status from API', async () => {
      (GetCache as any).mockReturnValue(null);
      api.me.mockResolvedValue({ status: 'error', message: 'fail' });
      await account.me();
      expect(api_error).toHaveBeenCalledWith('fail', false);
    });

    // it('should handle missing data', async () => {
    //   (GetCache as any).mockReturnValue(null);
    //   api.me.mockResolvedValue({ status: 'success', message: '', data: null });
    //   await account.me();
    //   expect(toastStore.show).toHaveBeenCalledWith(
    //     'Error getting current user',
    //     'error',
    //   );
    //   expect(ClearCache).toHaveBeenCalledWith('auth');
    // });
  });

  // describe('getUser', () => {
  //   it('should return user on success', async () => {
  //     api.me.mockResolvedValue({
  //       status: 'success',
  //       message: '',
  //       data: mockUser,
  //     });
  //     const user = await Account.getUser();
  //     expect(SetCache).toHaveBeenCalledWith(USER_KEY, mockUser, TTL_HOUR);
  //     expect(authenticated.set).toHaveBeenCalledWith(mockUser);
  //     expect(user).toEqual(mockUser);
  //   });

  //   it('should handle error status', async () => {
  //     api.me.mockResolvedValue({ status: 'error', message: 'fail' });
  //     const user = await Account.getUser();
  //     expect(api_error).toHaveBeenCalledWith('fail');
  //     expect(user).toBeNull();
  //   });

  //   it('should handle missing data', async () => {
  //     api.me.mockResolvedValue({ status: 'success', message: '', data: null });
  //     const user = await Account.getUser();
  //     expect(ClearCache).toHaveBeenCalledWith('auth');
  //     expect(user).toBeNull();
  //   });
  // });

  // describe('confirmEmail', () => {
  //   it('should confirm email on success', async () => {
  //     api.confirmEmail.mockResolvedValue({
  //       status: 'success',
  //       message: 'confirmed',
  //     });
  //     const result = await account.confirmEmail('token');
  //     expect(toastStore.show).toHaveBeenCalledWith('confirmed', 'info');
  //     expect(result).toBe(true);
  //   });

  //   it('should handle error', async () => {
  //     api.confirmEmail.mockResolvedValue({ status: 'error', message: 'fail' });
  //     const result = await account.confirmEmail('token');
  //     expect(api_error).toHaveBeenCalledWith('fail');
  //     expect(result).toBe(false);
  //   });

  //   it('should handle unknown status', async () => {
  //     api.confirmEmail.mockResolvedValue({ status: 'other', message: '' });
  //     const result = await account.confirmEmail('token');
  //     expect(toastStore.show).toHaveBeenCalledWith(
  //       'Unknown error occurred',
  //       'error',
  //     );
  //     expect(result).toBe(false);
  //   });
  // });

  // describe('changePassword', () => {
  //   it('should change password on success', async () => {
  //     api.changePassword.mockResolvedValue({
  //       status: 'success',
  //       message: 'changed',
  //     });
  //     await account.changePassword({
  //       old_password: 'old',
  //       new_password: 'new',
  //     });
  //     expect(toastStore.show).toHaveBeenCalledWith('changed', 'info');
  //   });

  //   it('should handle error', async () => {
  //     api.changePassword.mockResolvedValue({
  //       status: 'error',
  //       message: 'fail',
  //     });
  //     await account.changePassword({
  //       old_password: 'old',
  //       new_password: 'new',
  //     });
  //     expect(api_error).toHaveBeenCalledWith('fail');
  //   });

  //   it('should handle unknown status', async () => {
  //     api.changePassword.mockResolvedValue({ status: 'other', message: '' });
  //     await account.changePassword({
  //       old_password: 'old',
  //       new_password: 'new',
  //     });
  //     expect(toastStore.show).toHaveBeenCalledWith(
  //       'Unknown error occurred',
  //       'error',
  //     );
  //   });
  // });

  // describe('changeUsername', () => {
  //   it('should change username on success', async () => {
  //     api.changeUsername.mockResolvedValue({
  //       status: 'success',
  //       message: 'changed',
  //     });
  //     await account.changeUsername('newname');
  //     expect(toastStore.show).toHaveBeenCalledWith('changed', 'info');
  //   });

  //   it('should handle error', async () => {
  //     api.changeUsername.mockResolvedValue({
  //       status: 'error',
  //       message: 'fail',
  //     });
  //     await account.changeUsername('newname');
  //     expect(api_error).toHaveBeenCalledWith('fail');
  //   });

  //   it('should handle unknown status', async () => {
  //     api.changeUsername.mockResolvedValue({ status: 'other', message: '' });
  //     await account.changeUsername('newname');
  //     expect(toastStore.show).toHaveBeenCalledWith(
  //       'Unknown error occurred',
  //       'error',
  //     );
  //   });
  // });

  // describe('changeAvatar', () => {
  //   it('should change avatar on success', async () => {
  //     api.changeAvatar.mockResolvedValue({
  //       status: 'success',
  //       message: 'changed',
  //     });
  //     await account.changeAvatar('url', undefined);
  //     expect(toastStore.show).toHaveBeenCalledWith('changed', 'info');
  //   });

  //   it('should handle error', async () => {
  //     api.changeAvatar.mockResolvedValue({ status: 'error', message: 'fail' });
  //     await account.changeAvatar('url', undefined);
  //     expect(api_error).toHaveBeenCalledWith('fail');
  //   });

  //   it('should handle unknown status', async () => {
  //     api.changeAvatar.mockResolvedValue({ status: 'other', message: '' });
  //     await account.changeAvatar('url', undefined);
  //     expect(toastStore.show).toHaveBeenCalledWith(
  //       'Unknown error occurred',
  //       'error',
  //     );
  //   });
  // });

  // describe('generateReferralCode', () => {
  //   it('should generate referral code on success', async () => {
  //     api.createReferralCodes.mockResolvedValue({
  //       status: 'success',
  //       message: 'generated',
  //       data: 'CODE123',
  //     });
  //     const code = await account.generateReferralCode();
  //     expect(toastStore.show).toHaveBeenCalledWith('generated', 'info');
  //     expect(code).toBe('CODE123');
  //   });

  //   it('should handle error', async () => {
  //     api.createReferralCodes.mockResolvedValue({
  //       status: 'error',
  //       message: 'fail',
  //     });
  //     const code = await account.generateReferralCode();
  //     expect(api_error).toHaveBeenCalledWith('fail');
  //     expect(code).toBeNull();
  //   });

  //   it('should handle missing data', async () => {
  //     api.createReferralCodes.mockResolvedValue({
  //       status: 'success',
  //       message: '',
  //       data: null,
  //     });
  //     const code = await account.generateReferralCode();
  //     expect(toastStore.show).toHaveBeenCalledWith(
  //       'Error generating referral codes',
  //       'error',
  //     );
  //     expect(code).toBeNull();
  //   });
  // });

  // describe('getReferralCodes', () => {
  //   it('should use cached referral codes if available', async () => {
  //     (GetCache as any).mockReturnValue(mockReferralCodes);
  //     await account.getReferralCodes();
  //     expect(referralCodes.set).toHaveBeenCalledWith(mockReferralCodes);
  //     expect(api.getReferralCodes).not.toHaveBeenCalled();
  //   });

  //   it('should fetch referral codes from API if not cached', async () => {
  //     (GetCache as any).mockReturnValue(null);
  //     api.getReferralCodes.mockResolvedValue({
  //       status: 'success',
  //       message: '',
  //       data: mockReferralCodes,
  //     });
  //     await account.getReferralCodes();
  //     expect(referralCodes.set).toHaveBeenCalledWith(mockReferralCodes);
  //     expect(SetCache).toHaveBeenCalledWith(
  //       REFERRAL_CODES_KEY,
  //       mockReferralCodes,
  //       TTL_SHORT,
  //     );
  //   });

  //   it('should handle error', async () => {
  //     (GetCache as any).mockReturnValue(null);
  //     api.getReferralCodes.mockResolvedValue({
  //       status: 'error',
  //       message: 'fail',
  //     });
  //     await account.getReferralCodes();
  //     expect(api_error).toHaveBeenCalledWith('fail');
  //   });

  //   it('should handle missing data', async () => {
  //     (GetCache as any).mockReturnValue(null);
  //     api.getReferralCodes.mockResolvedValue({
  //       status: 'success',
  //       message: '',
  //       data: null,
  //     });
  //     await account.getReferralCodes();
  //     expect(toastStore.show).toHaveBeenCalledWith(
  //       'Error getting referral codes',
  //       'error',
  //     );
  //   });
  // });

  // describe('useReferralCode', () => {
  //   it('should use referral code on success', async () => {
  //     api.useReferralCode.mockResolvedValue({
  //       status: 'success',
  //       message: 'used',
  //     });
  //     await account.useReferralCode('CODE123');
  //     expect(toastStore.show).toHaveBeenCalledWith('used', 'info');
  //   });

  //   it('should handle error', async () => {
  //     api.useReferralCode.mockResolvedValue({
  //       status: 'error',
  //       message: 'fail',
  //     });
  //     await account.useReferralCode('CODE123');
  //     expect(api_error).toHaveBeenCalledWith('fail');
  //   });

  //   it('should handle unknown status', async () => {
  //     api.useReferralCode.mockResolvedValue({ status: 'other', message: '' });
  //     await account.useReferralCode('CODE123');
  //     expect(toastStore.show).toHaveBeenCalledWith(
  //       'Unknown error occurred',
  //       'error',
  //     );
  //   });
  // });

  // describe('subscribeNewsletter', () => {
  //   it('should subscribe on success', async () => {
  //     api.subscribeNewsletter.mockResolvedValue({
  //       status: 'success',
  //       message: 'subscribed',
  //     });
  //     await account.subscribeNewsletter('test@email.com');
  //     expect(toastStore.show).toHaveBeenCalledWith('subscribed', 'info');
  //     expect(SetCache).toHaveBeenCalledWith(
  //       SUBSCRIPTION_STATUS_KEY,
  //       true,
  //       TTL_SHORT,
  //     );
  //   });

  //   it('should handle error', async () => {
  //     api.subscribeNewsletter.mockResolvedValue({
  //       status: 'error',
  //       message: 'fail',
  //     });
  //     await account.subscribeNewsletter('test@email.com');
  //     expect(api_error).toHaveBeenCalledWith('fail');
  //   });

  //   it('should handle unknown status', async () => {
  //     api.subscribeNewsletter.mockResolvedValue({
  //       status: 'other',
  //       message: '',
  //     });
  //     await account.subscribeNewsletter('test@email.com');
  //     expect(toastStore.show).toHaveBeenCalledWith(
  //       'Unknown error occurred',
  //       'error',
  //     );
  //   });
  // });

  // describe('unsubscribeNewsletter', () => {
  //   it('should unsubscribe on success', async () => {
  //     api.unsubscribeNewsletter.mockResolvedValue({
  //       status: 'success',
  //       message: 'unsubscribed',
  //     });
  //     await account.unsubscribeNewsletter('test@email.com');
  //     expect(toastStore.show).toHaveBeenCalledWith('unsubscribed', 'info');
  //     expect(SetCache).toHaveBeenCalledWith(
  //       SUBSCRIPTION_STATUS_KEY,
  //       false,
  //       TTL_SHORT,
  //     );
  //   });

  //   it('should handle error', async () => {
  //     api.unsubscribeNewsletter.mockResolvedValue({
  //       status: 'error',
  //       message: 'fail',
  //     });
  //     await account.unsubscribeNewsletter('test@email.com');
  //     expect(api_error).toHaveBeenCalledWith('fail');
  //   });

  //   it('should handle unknown status', async () => {
  //     api.unsubscribeNewsletter.mockResolvedValue({
  //       status: 'other',
  //       message: '',
  //     });
  //     await account.unsubscribeNewsletter('test@email.com');
  //     expect(toastStore.show).toHaveBeenCalledWith(
  //       'Unknown error occurred',
  //       'error',
  //     );
  //   });
  // });

  // describe('subscriptionStatus', () => {
  //   it('should use cached status if available', async () => {
  //     (GetCache as any).mockReturnValue(true);
  //     const result = await account.subscriptionStatus('test@email.com');
  //     expect(result).toBe(true);
  //     expect(api.isSubscribed).not.toHaveBeenCalled();
  //   });

  //   it('should fetch status from API if not cached', async () => {
  //     (GetCache as any).mockReturnValue(null);
  //     api.isSubscribed.mockResolvedValue({
  //       status: 'success',
  //       message: '',
  //       data: true,
  //     });
  //     const result = await account.subscriptionStatus('test@email.com');
  //     expect(SetCache).toHaveBeenCalledWith(
  //       SUBSCRIPTION_STATUS_KEY,
  //       true,
  //       TTL_SHORT,
  //     );
  //     expect(result).toBe(true);
  //   });

  //   it('should handle error', async () => {
  //     (GetCache as any).mockReturnValue(null);
  //     api.isSubscribed.mockResolvedValue({ status: 'error', message: 'fail' });
  //     const result = await account.subscriptionStatus('test@email.com');
  //     expect(api_error).toHaveBeenCalledWith('fail');
  //     expect(toastStore.show).toHaveBeenCalledWith('fail');
  //     expect(result).toBe(false);
  //   });

  //   it('should handle missing data', async () => {
  //     (GetCache as any).mockReturnValue(null);
  //     api.isSubscribed.mockResolvedValue({
  //       status: 'success',
  //       message: '',
  //       data: null,
  //     });
  //     const result = await account.subscriptionStatus('test@email.com');
  //     expect(toastStore.show).toHaveBeenCalledWith(
  //       'Error getting subscription status',
  //       'error',
  //     );
  //     expect(result).toBe(false);
  //   });
  // });

  // describe('createBookmarkFolder', () => {
  //   it('should create folder on success', async () => {
  //     api.createBookmarkFolder.mockResolvedValue({
  //       status: 'success',
  //       message: 'created',
  //     });
  //     await account.createBookmarkFolder('folder');
  //     expect(toastStore.show).toHaveBeenCalledWith('created', 'info');
  //   });

  //   it('should handle error', async () => {
  //     api.createBookmarkFolder.mockResolvedValue({
  //       status: 'error',
  //       message: 'fail',
  //     });
  //     await account.createBookmarkFolder('folder');
  //     expect(api_error).toHaveBeenCalledWith('fail');
  //   });

  //   it('should handle unknown status', async () => {
  //     api.createBookmarkFolder.mockResolvedValue({
  //       status: 'other',
  //       message: '',
  //     });
  //     await account.createBookmarkFolder('folder');
  //     expect(toastStore.show).toHaveBeenCalledWith(
  //       'Unknown error occurred',
  //       'error',
  //     );
  //   });
  // });

  // describe('getBookmarkFolders', () => {
  //   it('should get folders on success', async () => {
  //     api.getBookmarkFolders.mockResolvedValue({
  //       status: 'success',
  //       message: 'retrieved',
  //       data: mockBookmarkFolder,
  //     });
  //     const result = await account.getBookmarkFolders();
  //     expect(toastStore.show).toHaveBeenCalledWith('retrieved', 'info');
  //     expect(result).toEqual(mockBookmarkFolder);
  //   });

  //   it('should handle error', async () => {
  //     api.getBookmarkFolders.mockResolvedValue({
  //       status: 'error',
  //       message: 'fail',
  //     });
  //     const result = await account.getBookmarkFolders();
  //     expect(api_error).toHaveBeenCalledWith('fail');
  //     expect(result).toBeNull();
  //   });

  //   it('should handle missing data', async () => {
  //     api.getBookmarkFolders.mockResolvedValue({
  //       status: 'success',
  //       message: '',
  //       data: null,
  //     });
  //     const result = await account.getBookmarkFolders();
  //     expect(toastStore.show).toHaveBeenCalledWith(
  //       'Error getting bookmark folders',
  //       'error',
  //     );
  //     expect(result).toBeNull();
  //   });
  // });

  // describe('getBookmarkFolderTopic', () => {
  //   it('should get topics on success', async () => {
  //     api.getFolderBookmarks.mockResolvedValue({
  //       status: 'success',
  //       message: 'retrieved',
  //       data: [mockBookmark],
  //     });
  //     const result = await account.getBookmarkFolderTopic('folder1');
  //     expect(toastStore.show).toHaveBeenCalledWith('retrieved', 'info');
  //     expect(result).toEqual([mockBookmark]);
  //   });

  //   it('should handle error', async () => {
  //     api.getFolderBookmarks.mockResolvedValue({
  //       status: 'error',
  //       message: 'fail',
  //     });
  //     const result = await account.getBookmarkFolderTopic('folder1');
  //     expect(api_error).toHaveBeenCalledWith('fail');
  //     expect(result).toBeNull();
  //   });

  //   it('should handle missing data', async () => {
  //     api.getFolderBookmarks.mockResolvedValue({
  //       status: 'success',
  //       message: '',
  //       data: null,
  //     });
  //     const result = await account.getBookmarkFolderTopic('folder1');
  //     expect(toastStore.show).toHaveBeenCalledWith(
  //       'Error getting bookmark folder topics',
  //       'error',
  //     );
  //     expect(result).toBeNull();
  //   });
  // });

  // describe('createBookmarkTag', () => {
  //   it('should create tag on success', async () => {
  //     api.createBookmarkTag.mockResolvedValue({
  //       status: 'success',
  //       message: 'created',
  //     });
  //     await account.createBookmarkTag('tag');
  //     expect(toastStore.show).toHaveBeenCalledWith('created', 'info');
  //   });

  //   it('should handle error', async () => {
  //     api.createBookmarkTag.mockResolvedValue({
  //       status: 'error',
  //       message: 'fail',
  //     });
  //     await account.createBookmarkTag('tag');
  //     expect(api_error).toHaveBeenCalledWith('fail');
  //   });

  //   it('should handle unknown status', async () => {
  //     api.createBookmarkTag.mockResolvedValue({ status: 'other', message: '' });
  //     await account.createBookmarkTag('tag');
  //     expect(toastStore.show).toHaveBeenCalledWith(
  //       'Unknown error occurred',
  //       'error',
  //     );
  //   });
  // });

  // describe('getBookmarkTags', () => {
  //   it('should get tags on success', async () => {
  //     api.getBookmarkTags.mockResolvedValue({
  //       status: 'success',
  //       message: 'retrieved',
  //       data: mockBookmarkTag,
  //     });
  //     const result = await account.getBookmarkTags();
  //     expect(toastStore.show).toHaveBeenCalledWith('retrieved', 'info');
  //     expect(result).toEqual(mockBookmarkTag);
  //   });

  //   it('should handle error', async () => {
  //     api.getBookmarkTags.mockResolvedValue({
  //       status: 'error',
  //       message: 'fail',
  //     });
  //     const result = await account.getBookmarkTags();
  //     expect(api_error).toHaveBeenCalledWith('fail');
  //     expect(result).toBeNull();
  //   });

  //   it('should handle missing data', async () => {
  //     api.getBookmarkTags.mockResolvedValue({
  //       status: 'success',
  //       message: '',
  //       data: null,
  //     });
  //     const result = await account.getBookmarkTags();
  //     expect(toastStore.show).toHaveBeenCalledWith(
  //       'Error getting bookmark tags',
  //       'error',
  //     );
  //     expect(result).toBeNull();
  //   });
  // });

  // describe('getBookmarkTagsTopic', () => {
  //   it('should get topics on success', async () => {
  //     api.getTagBookmarks.mockResolvedValue({
  //       status: 'success',
  //       message: 'retrieved',
  //       data: [mockBookmark],
  //     });
  //     const result = await account.getBookmarkTagsTopic('tag1');
  //     expect(toastStore.show).toHaveBeenCalledWith('retrieved', 'info');
  //     expect(result).toEqual([mockBookmark]);
  //   });

  //   it('should handle error', async () => {
  //     api.getTagBookmarks.mockResolvedValue({
  //       status: 'error',
  //       message: 'fail',
  //     });
  //     const result = await account.getBookmarkTagsTopic('tag1');
  //     expect(api_error).toHaveBeenCalledWith('fail');
  //     expect(result).toBeNull();
  //   });

  //   it('should handle missing data', async () => {
  //     api.getTagBookmarks.mockResolvedValue({
  //       status: 'success',
  //       message: '',
  //       data: null,
  //     });
  //     const result = await account.getBookmarkTagsTopic('tag1');
  //     expect(toastStore.show).toHaveBeenCalledWith(
  //       'Error getting bookmark folder topics',
  //       'error',
  //     );
  //     expect(result).toBeNull();
  //   });
  // });

  // describe('bookmarkTopic', () => {
  //   it('should bookmark topic on success', async () => {
  //     api.bookmarkTopic.mockResolvedValue({
  //       status: 'success',
  //       message: 'bookmarked',
  //     });
  //     await account.bookmarkTopic(mockBookmark);
  //     expect(toastStore.show).toHaveBeenCalledWith('bookmarked', 'info');
  //   });

  //   it('should handle error', async () => {
  //     api.bookmarkTopic.mockResolvedValue({ status: 'error', message: 'fail' });
  //     await account.bookmarkTopic(mockBookmark);
  //     expect(api_error).toHaveBeenCalledWith('fail');
  //   });

  //   it('should handle unknown status', async () => {
  //     api.bookmarkTopic.mockResolvedValue({ status: 'other', message: '' });
  //     await account.bookmarkTopic(mockBookmark);
  //     expect(toastStore.show).toHaveBeenCalledWith(
  //       'Unknown error occurred',
  //       'error',
  //     );
  //   });
  // });

  // describe('getBookmark', () => {
  //   it('should get bookmark on success', async () => {
  //     api.getBookmark.mockResolvedValue({
  //       status: 'success',
  //       message: 'retrieved',
  //       data: mockBookmark,
  //     });
  //     const result = await account.getBookmark('bookmark1');
  //     expect(toastStore.show).toHaveBeenCalledWith('retrieved', 'info');
  //     expect(result).toEqual(mockBookmark);
  //   });

  //   it('should handle error', async () => {
  //     api.getBookmark.mockResolvedValue({ status: 'error', message: 'fail' });
  //     const result = await account.getBookmark('bookmark1');
  //     expect(api_error).toHaveBeenCalledWith('fail');
  //     expect(result).toBeNull();
  //   });

  //   it('should handle missing data', async () => {
  //     api.getBookmark.mockResolvedValue({
  //       status: 'success',
  //       message: '',
  //       data: null,
  //     });
  //     const result = await account.getBookmark('bookmark1');
  //     expect(toastStore.show).toHaveBeenCalledWith(
  //       'Error getting bookmark',
  //       'error',
  //     );
  //     expect(result).toBeNull();
  //   });
  // });

  // describe('updateBookmark', () => {
  //   it('should update bookmark on success', async () => {
  //     api.updateBookmark.mockResolvedValue({
  //       status: 'success',
  //       message: 'updated',
  //     });
  //     await account.updateBookmark('bookmark1', {
  //       bookmark_folder_id: 'New Topic',
  //     });
  //     expect(toastStore.show).toHaveBeenCalledWith('updated', 'info');
  //   });

  //   it('should handle error', async () => {
  //     api.updateBookmark.mockResolvedValue({
  //       status: 'error',
  //       message: 'fail',
  //     });
  //     await account.updateBookmark('bookmark1', {
  //       bookmark_folder_id: 'New Topic',
  //     });
  //     expect(api_error).toHaveBeenCalledWith('fail');
  //   });

  //   it('should handle unknown status', async () => {
  //     api.updateBookmark.mockResolvedValue({ status: 'other', message: '' });
  //     await account.updateBookmark('bookmark1', {
  //       bookmark_folder_id: 'New Topic',
  //     });
  //     expect(toastStore.show).toHaveBeenCalledWith(
  //       'Unknown error occurred',
  //       'error',
  //     );
  //   });
  // });

  // describe('deleteBookmark', () => {
  //   it('should delete bookmark on success', async () => {
  //     api.deleteBookmark.mockResolvedValue({
  //       status: 'success',
  //       message: 'deleted',
  //     });
  //     await account.deleteBookmark('bookmark1');
  //     expect(toastStore.show).toHaveBeenCalledWith('deleted', 'info');
  //   });

  //   it('should handle error', async () => {
  //     api.deleteBookmark.mockResolvedValue({
  //       status: 'error',
  //       message: 'fail',
  //     });
  //     await account.deleteBookmark('bookmark1');
  //     expect(api_error).toHaveBeenCalledWith('fail');
  //   });

  //   it('should handle unknown status', async () => {
  //     api.deleteBookmark.mockResolvedValue({ status: 'other', message: '' });
  //     await account.deleteBookmark('bookmark1');
  //     expect(toastStore.show).toHaveBeenCalledWith(
  //       'Unknown error occurred',
  //       'error',
  //     );
  //   });
  // });

  // describe('getUserStories', () => {
  //   it('should get stories on success', async () => {
  //     api.getStories.mockResolvedValue({
  //       status: 'success',
  //       message: 'retrieved',
  //       data: mockDashboardTopic,
  //     });
  //     const result = await account.getUserStories(false, '1 WEEK');
  //     expect(toastStore.show).toHaveBeenCalledWith('retrieved', 'info');
  //     expect(result).toEqual(mockDashboardTopic);
  //   });

  //   it('should handle error', async () => {
  //     api.getStories.mockResolvedValue({ status: 'error', message: 'fail' });
  //     const result = await account.getUserStories(false, '1 WEEK');
  //     expect(api_error).toHaveBeenCalledWith('fail');
  //     expect(result).toBeNull();
  //   });

  //   it('should handle missing data', async () => {
  //     api.getStories.mockResolvedValue({
  //       status: 'success',
  //       message: '',
  //       data: null,
  //     });
  //     const result = await account.getUserStories(false, '1 WEEK');
  //     expect(toastStore.show).toHaveBeenCalledWith(
  //       'Error getting stories',
  //       'error',
  //     );
  //     expect(result).toBeNull();
  //   });
  // });
});
