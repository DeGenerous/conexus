import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

import Account from '../account';

const mockAPI = vi.fn();

class MockAccount extends Account {
  request = mockAPI;
}

describe('Account', () => {
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
        getBookmarks: vi.fn(),
        updateBookmark: vi.fn(),
        deleteBookmark: vi.fn(),
        getStories: vi.fn(),
      })),
    };
  });

  vi.mock('@constants/cache', () => ({
    default: vi.fn().mockImplementation(() => ({
      USER_KEY: 'user',
      TTL_HOUR: 3600,
      REFERRAL_CODES_KEY: 'ref_codes',
      TTL_SHORT: 60,
      SUBSCRIPTION_STATUS_KEY: 'sub_status',
      ClearCache: vi.fn(),
      GetCache: vi.fn(),
      SetCache: vi.fn(),
    })),
  }));

  vi.mock('@errors/index', () => ({
    default: vi.fn().mockImplementation(() => ({
      api_error: vi.fn(),
    })),
  }));

  vi.mock('@stores/account.svelte', () => ({
    default: vi.fn().mockImplementation(() => ({
      authenticated: { set: vi.fn() },
      referralCodes: { set: vi.fn() },
    })),
  }));

  vi.mock('@stores/toast.svelte', () => ({
    toastStore: { show: vi.fn() },
  }));

  const mockUser: User = {
    id: 'u1',
    referred: false,
    credits: 0,
    first_name: 'Test',
    last_name: 'User',
    email: 'testuser@email.com',
    password: 'password123',
    role_id: 'role1',
    // Add other required properties if needed, or leave them undefined
  };
  const mockReferralCodes: ReferralCode[] = [
    {
      id: 'rc1',
      code: 'ref1',
      usage_count: 0,
      max_usage: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
  const mockBookmarkFolders: BookmarkFolder[] = [
    {
      id: 'f1',
      name: 'Folder',
    },
  ];
  const mockBookmarkTags: BookmarkTag[] = [
    {
      id: 't1',
      name: 'Tag',
    },
  ];
  const mockBookmarks: Bookmark[] = [
    {
      id: 'b1',
      name: 'Bookmark',
      topic_id: 't1',
      bookmark_folder_id: 'f1',
      note: 'This is a bookmark',
      sort_order: 1,
    },
  ];
  const mockDashboardTopics: DashboardTopic[] = [
    {
      topic_id: 'd1',
      name: 'Story',
    },
  ];

  // Add mock variables for cache and other dependencies
  let mockGetCache: Mock;
  let mockSetCache: Mock;
  let mockClearCache: Mock;
  let mockSet: Mock;
  let mockApiError: Mock;
  let mockShow: Mock;

  let account: MockAccount;

  beforeEach(() => {
    vi.clearAllMocks();
    account = new MockAccount();

    // Initialize mocks
    mockGetCache = vi.fn();
    mockSetCache = vi.fn();
    mockClearCache = vi.fn();
    mockSet = vi.fn();
    mockApiError = vi.fn();
    mockShow = vi.fn();

    // Optionally, assign these mocks to the relevant modules if needed
    // For example:
    // (account as any).cache = { GetCache: mockGetCache, SetCache: mockSetCache, ClearCache: mockClearCache };
    // (account as any).toast = { show: mockShow };
    // (account as any).errors = { api_error: mockApiError };
    // (account as any).store = { set: mockSet };
  });

  it('me() uses cached user', async () => {
    mockGetCache.mockReturnValueOnce(mockUser);
    await account.me();
    expect(mockSet).toHaveBeenCalledWith(mockUser);
  });

  it('me() fetches user from API and caches', async () => {
    mockGetCache.mockReturnValueOnce(null);
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: '',
      data: mockUser,
    });
    await account.me();
    expect(mockSetCache).toHaveBeenCalledWith('user', mockUser, 3600);
    expect(mockSet).toHaveBeenCalledWith(mockUser);
  });

  it('me() handles error status', async () => {
    mockGetCache.mockReturnValueOnce(null);
    mockAPI.mockResolvedValueOnce({
      status: 'error',
      message: 'fail',
      data: null,
    });
    await account.me();
    expect(mockApiError).toHaveBeenCalledWith('fail', false);
  });

  it('me() handles missing data', async () => {
    mockGetCache.mockReturnValueOnce(null);
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: '',
      data: null,
    });
    await account.me();
    expect(mockShow).toHaveBeenCalledWith(
      'Error getting current user',
      'error',
    );
    expect(mockClearCache).toHaveBeenCalledWith('auth');
  });

  it('getUser() returns user', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: '',
      data: mockUser,
    });
    const user = await Account.getUser();
    expect(mockSetCache).toHaveBeenCalledWith('user', mockUser, 3600);
    expect(mockSet).toHaveBeenCalledWith(mockUser);
    expect(user).toEqual(mockUser);
  });

  it('getUser() handles error', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'error',
      message: 'fail',
      data: null,
    });
    const user = await Account.getUser();
    expect(mockApiError).toHaveBeenCalledWith('fail');
    expect(user).toBeNull();
  });

  it('getUser() handles missing data', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: '',
      data: null,
    });
    const user = await Account.getUser();
    expect(mockClearCache).toHaveBeenCalledWith('auth');
    expect(user).toBeNull();
  });

  it('confirmEmail() success', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
    });
    const result = await account.confirmEmail('token');
    expect(mockShow).toHaveBeenCalledWith('ok', 'info');
    expect(result).toBe(true);
  });

  it('confirmEmail() error', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'error',
      message: 'fail',
    });
    const result = await account.confirmEmail('token');
    expect(mockApiError).toHaveBeenCalledWith('fail');
    expect(result).toBe(false);
  });

  it('changePassword() success', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
    });
    await account.changePassword({
      old_password: 'old',
      new_password: 'new',
    });
    expect(mockShow).toHaveBeenCalledWith('ok', 'info');
  });

  it('changePassword() error', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'error',
      message: 'fail',
    });
    await account.changePassword({
      old_password: 'old',
      new_password: 'new',
    });
    expect(mockApiError).toHaveBeenCalledWith('fail');
  });

  it('changeUsername() success', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
    });
    await account.changeUsername('newuser');
    expect(mockShow).toHaveBeenCalledWith('ok', 'info');
  });

  it('changeUsername() error', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'error',
      message: 'fail',
    });
    await account.changeUsername('newuser');
    expect(mockApiError).toHaveBeenCalledWith('fail');
  });

  it('changeAvatar() success', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
    });
    await account.changeAvatar('url', new File([''], 'avatar.png'));
    expect(mockShow).toHaveBeenCalledWith('ok', 'info');
  });

  it('changeAvatar() error', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'error',
      message: 'fail',
    });
    await account.changeAvatar('url', new File([''], 'avatar.png'));
    expect(mockApiError).toHaveBeenCalledWith('fail');
  });

  it('generateReferralCode() success', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: 'code',
    });
    const code = await account.generateReferralCode();
    expect(mockShow).toHaveBeenCalledWith('ok', 'info');
    expect(code).toBe('code');
  });

  it('generateReferralCode() error', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'error',
      message: 'fail',
      data: null,
    });
    const code = await account.generateReferralCode();
    expect(mockApiError).toHaveBeenCalledWith('fail');
    expect(code).toBeNull();
  });

  it('generateReferralCode() missing data', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: '',
      data: null,
    });
    const code = await account.generateReferralCode();
    expect(mockShow).toHaveBeenCalledWith(
      'Error generating referral codes',
      'error',
    );
    expect(code).toBeNull();
  });

  it('getReferralCodes() uses cache', async () => {
    mockGetCache.mockReturnValueOnce(mockReferralCodes);
    await account.getReferralCodes();
    expect(mockSet).toHaveBeenCalledWith(mockReferralCodes);
  });

  it('getReferralCodes() fetches and caches', async () => {
    mockGetCache.mockReturnValueOnce(null);
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: '',
      data: mockReferralCodes,
    });
    await account.getReferralCodes();
    expect(mockSet).toHaveBeenCalledWith(mockReferralCodes);
    expect(mockSetCache).toHaveBeenCalledWith(
      'ref_codes',
      mockReferralCodes,
      60,
    );
  });

  it('getReferralCodes() error', async () => {
    mockGetCache.mockReturnValueOnce(null);
    mockAPI.mockResolvedValueOnce({
      status: 'error',
      message: 'fail',
      data: null,
    });
    await account.getReferralCodes();
    expect(mockApiError).toHaveBeenCalledWith('fail');
  });

  it('useReferralCode() success', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
    });
    await account.useReferralCode('code');
    expect(mockShow).toHaveBeenCalledWith('ok', 'info');
  });

  it('useReferralCode() error', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'error',
      message: 'fail',
    });
    await account.useReferralCode('code');
    expect(mockApiError).toHaveBeenCalledWith('fail');
  });

  it('subscribeNewsletter() success', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
    });
    await account.subscribeNewsletter('email');
    expect(mockShow).toHaveBeenCalledWith('ok', 'info');
    expect(mockSetCache).toHaveBeenCalledWith('sub_status', true, 60);
  });

  it('subscribeNewsletter() error', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'error',
      message: 'fail',
    });
    await account.subscribeNewsletter('email');
    expect(mockApiError).toHaveBeenCalledWith('fail');
  });

  it('unsubscribeNewsletter() success', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
    });
    await account.unsubscribeNewsletter('email');
    expect(mockShow).toHaveBeenCalledWith('ok', 'info');
    expect(mockSetCache).toHaveBeenCalledWith('sub_status', false, 60);
  });

  it('unsubscribeNewsletter() error', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'error',
      message: 'fail',
    });
    await account.unsubscribeNewsletter('email');
    expect(mockApiError).toHaveBeenCalledWith('fail');
  });

  it('subscriptionStatus() uses cache', async () => {
    mockGetCache.mockReturnValueOnce(true);
    const result = await account.subscriptionStatus('email');
    expect(result).toBe(true);
  });

  it('subscriptionStatus() fetches and caches', async () => {
    mockGetCache.mockReturnValueOnce(null);
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: '',
      data: true,
    });
    const result = await account.subscriptionStatus('email');
    expect(mockSetCache).toHaveBeenCalledWith('sub_status', true, 60);
    expect(result).toBe(true);
  });

  it('subscriptionStatus() error', async () => {
    mockGetCache.mockReturnValueOnce(null);
    mockAPI.mockResolvedValueOnce({
      status: 'error',
      message: 'fail',
      data: null,
    });
    const result = await account.subscriptionStatus('email');
    expect(mockApiError).toHaveBeenCalledWith('fail');
    expect(mockShow).toHaveBeenCalledWith('fail');
    expect(result).toBe(false);
  });

  it('createBookmarkFolder() success', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
    });
    await account.createBookmarkFolder('folder');
    expect(mockShow).toHaveBeenCalledWith('ok', 'info');
  });

  it('createBookmarkFolder() error', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'error',
      message: 'fail',
    });
    await account.createBookmarkFolder('folder');
    expect(mockApiError).toHaveBeenCalledWith('fail');
  });

  it('getBookmarkFolders() success', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: mockBookmarkFolders,
    });
    const folders = await account.getBookmarkFolders();
    expect(mockShow).toHaveBeenCalledWith('ok', 'info');
    expect(folders).toEqual(mockBookmarkFolders);
  });

  it('getBookmarkFolders() error', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'error',
      message: 'fail',
      data: null,
    });
    const folders = await account.getBookmarkFolders();
    expect(mockApiError).toHaveBeenCalledWith('fail');
    expect(folders).toBeNull();
  });

  it('getBookmarkFolders() missing data', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: '',
      data: null,
    });
    const folders = await account.getBookmarkFolders();
    expect(mockShow).toHaveBeenCalledWith(
      'Error getting bookmark folders',
      'error',
    );
    expect(folders).toBeNull();
  });

  it('getBookmarkFolderTopic() success', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: mockBookmarks,
    });
    const bookmarks = await account.getBookmarkFolderTopic('f1');
    expect(mockShow).toHaveBeenCalledWith('ok', 'info');
    expect(bookmarks).toEqual(mockBookmarks);
  });

  it('getBookmarkFolderTopic() error', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'error',
      message: 'fail',
      data: null,
    });
    const bookmarks = await account.getBookmarkFolderTopic('f1');
    expect(mockApiError).toHaveBeenCalledWith('fail');
    expect(bookmarks).toBeNull();
  });

  it('getBookmarkFolderTopic() missing data', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: '',
      data: null,
    });
    const bookmarks = await account.getBookmarkFolderTopic('f1');
    expect(mockShow).toHaveBeenCalledWith(
      'Error getting bookmark folder topics',
      'error',
    );
    expect(bookmarks).toBeNull();
  });

  it('createBookmarkTag() success', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
    });
    await account.createBookmarkTag('tag');
    expect(mockShow).toHaveBeenCalledWith('ok', 'info');
  });

  it('createBookmarkTag() error', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'error',
      message: 'fail',
    });
    await account.createBookmarkTag('tag');
    expect(mockApiError).toHaveBeenCalledWith('fail');
  });

  it('getBookmarkTags() success', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: mockBookmarkTags,
    });
    const tags = await account.getBookmarkTags();
    expect(mockShow).toHaveBeenCalledWith('ok', 'info');
    expect(tags).toEqual(mockBookmarkTags);
  });

  it('getBookmarkTags() error', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'error',
      message: 'fail',
      data: null,
    });
    const tags = await account.getBookmarkTags();
    expect(mockApiError).toHaveBeenCalledWith('fail');
    expect(tags).toBeNull();
  });

  it('getBookmarkTags() missing data', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: '',
      data: null,
    });
    const tags = await account.getBookmarkTags();
    expect(mockShow).toHaveBeenCalledWith(
      'Error getting bookmark tags',
      'error',
    );
    expect(tags).toBeNull();
  });

  it('getBookmarkTagsTopic() success', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: mockBookmarks,
    });
    const bookmarks = await account.getBookmarkTagsTopic('t1');
    expect(mockShow).toHaveBeenCalledWith('ok', 'info');
    expect(bookmarks).toEqual(mockBookmarks);
  });

  it('getBookmarkTagsTopic() error', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'error',
      message: 'fail',
      data: null,
    });
    const bookmarks = await account.getBookmarkTagsTopic('t1');
    expect(mockApiError).toHaveBeenCalledWith('fail');
    expect(bookmarks).toBeNull();
  });

  it('getBookmarkTagsTopic() missing data', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: '',
      data: null,
    });
    const bookmarks = await account.getBookmarkTagsTopic('t1');
    expect(mockShow).toHaveBeenCalledWith(
      'Error getting bookmark folder topics',
      'error',
    );
    expect(bookmarks).toBeNull();
  });

  it('bookmarkTopic() success', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
    });
    await account.bookmarkTopic({ id: 'b1' } as any);
    expect(mockShow).toHaveBeenCalledWith('ok', 'info');
  });

  it('bookmarkTopic() error', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'error',
      message: 'fail',
    });
    await account.bookmarkTopic({ id: 'b1' } as any);
    expect(mockApiError).toHaveBeenCalledWith('fail');
  });

  it('getBookmark() success', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: mockBookmarks[0],
    });
    const bookmark = await account.getBookmark('b1');
    expect(mockShow).toHaveBeenCalledWith('ok', 'info');
    expect(bookmark).toEqual(mockBookmarks[0]);
  });

  it('getBookmark() error', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'error',
      message: 'fail',
      data: null,
    });
    const bookmark = await account.getBookmark('b1');
    expect(mockApiError).toHaveBeenCalledWith('fail');
    expect(bookmark).toBeNull();
  });

  it('getBookmark() missing data', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: '',
      data: null,
    });
    const bookmark = await account.getBookmark('b1');
    expect(mockShow).toHaveBeenCalledWith('Error getting bookmark', 'error');
    expect(bookmark).toBeNull();
  });

  it('updateBookmark() success', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
    });
    await account.updateBookmark('b1', { name: 'updated' });
    expect(mockShow).toHaveBeenCalledWith('ok', 'info');
  });

  it('updateBookmark() error', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'error',
      message: 'fail',
    });
    await account.updateBookmark('b1', { name: 'updated' });
    expect(mockApiError).toHaveBeenCalledWith('fail');
  });

  it('deleteBookmark() success', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
    });
    await account.deleteBookmark('b1');
    expect(mockShow).toHaveBeenCalledWith('ok', 'info');
  });

  it('deleteBookmark() error', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'error',
      message: 'fail',
    });
    await account.deleteBookmark('b1');
    expect(mockApiError).toHaveBeenCalledWith('fail');
  });

  it('getUserStories() success', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: 'ok',
      data: mockDashboardTopics,
    });
    const stories = await account.getUserStories(false, {
      from: '',
      to: '',
    } as any);
    expect(mockShow).toHaveBeenCalledWith('ok', 'info');
    expect(stories).toEqual(mockDashboardTopics);
  });

  it('getUserStories() error', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'error',
      message: 'fail',
      data: null,
    });
    const stories = await account.getUserStories(false, {
      from: '',
      to: '',
    } as any);
    expect(mockApiError).toHaveBeenCalledWith('fail');
    expect(stories).toBeNull();
  });

  it('getUserStories() missing data', async () => {
    mockAPI.mockResolvedValueOnce({
      status: 'success',
      message: '',
      data: null,
    });
    const stories = await account.getUserStories(false, {
      from: '',
      to: '',
    } as any);
    expect(mockShow).toHaveBeenCalledWith('Error getting stories', 'error');
    expect(stories).toBeNull();
  });
});
