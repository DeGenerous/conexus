import { describe, it, expect, beforeEach, vi } from 'vitest';

import AccountAPI from '../account';

const mockRequest = vi.fn();

class MockAccountAPI extends AccountAPI {
  request = mockRequest;
}

describe('AccountAPI', () => {
  let api: MockAccountAPI;

  beforeEach(() => {
    api = new MockAccountAPI();
    mockRequest.mockReset();
  });

  it('me includes optional token and refresh flag', async () => {
    await api.me();
    expect(mockRequest).toHaveBeenCalledWith('/account/me', {
      headers: {},
    });

    mockRequest.mockClear();
    await api.me(true, 'token123');
    expect(mockRequest).toHaveBeenCalledWith('/account/me?refresh=true', {
      headers: { Authorization: 'Bearer token123' },
    });
  });

  it('confirmEmail hits confirm endpoint', async () => {
    await api.confirmEmail('tok');
    expect(mockRequest).toHaveBeenCalledWith(
      '/account/confirm-email?token=tok',
    );
  });

  it('changePassword posts form data', async () => {
    await api.changePassword('old', 'new');
    const [url, options] = mockRequest.mock.calls[0];
    expect(url).toBe('/account/change-password');
    expect(options.method).toBe('POST');
    expect(options.body).toBeInstanceOf(FormData);
  });

  it('changeUsername sends query param', async () => {
    await api.changeUsername('newuser');
    expect(mockRequest).toHaveBeenCalledWith(
      '/account/change-username?new_username=newuser',
    );
  });

  it('changeAvatar posts optional payload', async () => {
    const file = new File(['avatar'], 'avatar.png');
    await api.changeAvatar('https://img', file);
    const [url, options] = mockRequest.mock.calls[0];
    expect(url).toBe('/account/change-avatar');
    expect(options.method).toBe('POST');
    expect(options.body).toBeInstanceOf(FormData);
  });

  it('changeBio posts JSON body', async () => {
    await api.changeBio('Hello world');
    expect(mockRequest).toHaveBeenCalledWith('/account/change-bio', {
      method: 'POST',
      body: JSON.stringify({ bio: 'Hello world' }),
    });
  });

  it('createReferralCodes hits expected endpoint', async () => {
    mockRequest.mockResolvedValue({ status: 'success' });
    const result = await api.createReferralCodes();
    expect(mockRequest).toHaveBeenCalledWith('/account/new-referral-code');
    expect(result).toEqual({ status: 'success' });
  });

  it('getReferralCode fetches referral data', async () => {
    await api.getReferralCode();
    expect(mockRequest).toHaveBeenCalledWith('/account/get-referral-code');
  });

  it('useReferralCode posts form data', async () => {
    await api.useReferralCode('CODE');
    const [url, options] = mockRequest.mock.calls[0];
    expect(url).toBe('/account/use-referral-code');
    expect(options.method).toBe('POST');
    expect(options.body).toBeInstanceOf(FormData);
  });

  it('changeReferralCode updates query parameter', async () => {
    await api.changeReferralCode('NEWCODE');
    expect(mockRequest).toHaveBeenCalledWith(
      '/account/change-referral-code?new_code=NEWCODE',
    );
  });

  it('newsletter helpers call correct endpoints', async () => {
    await api.subscribeNewsletter('mail@test.com');
    expect(mockRequest).toHaveBeenCalledWith(
      '/account/subscribe-newsletter?email=mail@test.com',
    );

    mockRequest.mockClear();
    await api.unsubscribeNewsletter('mail@test.com');
    expect(mockRequest).toHaveBeenCalledWith(
      '/account/unsubscribe-newsletter?email=mail@test.com',
    );

    mockRequest.mockClear();
    await api.isSubscribed('mail@test.com');
    expect(mockRequest).toHaveBeenCalledWith(
      '/account/is-subscribed-newsletter?email=mail@test.com',
    );
  });

  it('bookmark folder helpers hit the right endpoints', async () => {
    await api.createBookmarkFolder('Folder');
    expect(mockRequest).toHaveBeenCalledWith(
      '/account/new-bookmark-folder?name=Folder',
    );

    mockRequest.mockClear();
    await api.getBookmarkFolders();
    expect(mockRequest).toHaveBeenCalledWith('/account/get-bookmark-folders');

    mockRequest.mockClear();
    await api.getFolderBookmarks('folder-1');
    expect(mockRequest).toHaveBeenCalledWith(
      '/account/get-folder-bookmarks/folder-1',
    );

    mockRequest.mockClear();
    await api.deleteBookmarkFolder('folder-1');
    expect(mockRequest).toHaveBeenCalledWith(
      '/account/delete-bookmark-folder/folder-1',
      { method: 'DELETE' },
    );
  });

  it('bookmark tag helpers hit correct endpoints', async () => {
    await api.createBookmarkTag('tag');
    expect(mockRequest).toHaveBeenCalledWith(
      '/account/new-bookmark-tag?name=tag',
    );

    mockRequest.mockClear();
    await api.getBookmarkTags();
    expect(mockRequest).toHaveBeenCalledWith('/account/get-bookmark-tags');

    mockRequest.mockClear();
    await api.getTagBookmarks('tag-id');
    expect(mockRequest).toHaveBeenCalledWith(
      '/account/get-tag-bookmarks/tag-id',
    );
  });

  it('bookmark CRUD uses correct payloads', async () => {
    const bookmark = { topic_id: 'topic-1' } as any;
    await api.bookmarkTopic(bookmark);
    expect(mockRequest).toHaveBeenCalledWith('/account/bookmark-topic', {
      method: 'POST',
      body: JSON.stringify(bookmark),
    });

    mockRequest.mockClear();
    await api.getBookmark('bookmark-1');
    expect(mockRequest).toHaveBeenCalledWith(
      '/account/get-bookmark/bookmark-1',
    );

    mockRequest.mockClear();
    await api.getBookmarks();
    expect(mockRequest).toHaveBeenCalledWith('/account/get-bookmarks');

    mockRequest.mockClear();
    await api.checkBookmark('topic-1');
    expect(mockRequest).toHaveBeenCalledWith('/account/check-bookmark/topic-1');

    mockRequest.mockClear();
    await api.updateBookmark('bookmark-1', { name: 'Updated' });
    expect(mockRequest).toHaveBeenCalledWith(
      '/account/update-bookmark/bookmark-1',
      {
        method: 'PATCH',
        body: JSON.stringify({ name: 'Updated' }),
      },
    );

    mockRequest.mockClear();
    await api.deleteBookmark('bookmark-1');
    expect(mockRequest).toHaveBeenCalledWith(
      '/account/delete-bookmark/bookmark-1',
      {
        method: 'DELETE',
      },
    );
  });

  it('getStories posts provided filter', async () => {
    const filter = { ended: false } as any;
    await api.getStories(filter);
    expect(mockRequest).toHaveBeenCalledWith('/account/stories', {
      method: 'POST',
      body: JSON.stringify(filter),
    });
  });

  it('streak posts action payload', async () => {
    await api.streak('login', true);
    expect(mockRequest).toHaveBeenCalledWith('/account/streak', {
      method: 'POST',
      body: JSON.stringify({ action: 'login', restore: true }),
    });
  });

  it('prompt settings helper posts and fetches correctly', async () => {
    const settings = { language: 'en' } as any;
    await api.createOrUpdatePromptSettings(settings);
    expect(mockRequest).toHaveBeenCalledWith('/account/prompt-settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });

    mockRequest.mockClear();
    await api.getPromptSettings();
    expect(mockRequest).toHaveBeenCalledWith(
      '/account/prompt-settings?refresh=false',
    );
  });

  it('custom theme helper posts and fetches correctly', async () => {
    const theme = { primary: '#fff' } as any;
    await api.createOrUpdateCustomTheme(theme);
    expect(mockRequest).toHaveBeenCalledWith('/account/custom-theme', {
      method: 'POST',
      body: JSON.stringify(theme),
    });

    mockRequest.mockClear();
    await api.getCustomTheme();
    expect(mockRequest).toHaveBeenCalledWith(
      '/account/custom-theme?refresh=false',
    );
  });

  it('notification inbox and read helpers use correct endpoints', async () => {
    await api.notificationInbox(1, 10);
    expect(mockRequest).toHaveBeenCalledWith(
      '/account/notification/inbox?page=1&pageSize=10',
    );

    mockRequest.mockClear();
    await api.markNotificationRead('notif-1');
    expect(mockRequest).toHaveBeenCalledWith(
      '/account/notification/notif-1/read',
      {
        method: 'POST',
      },
    );
  });

  it('getRoles proxies to admin endpoint', async () => {
    await api.getRoles();
    expect(mockRequest).toHaveBeenCalledWith('/admin/roles?refresh=false', {
      method: 'GET',
    });
  });
});
