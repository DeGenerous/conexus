import { describe, it, expect, beforeEach, vi } from 'vitest';

import AccountAPI from '../account';

const mockRequest = vi.fn();

class MockFetcher extends AccountAPI {
  request = mockRequest;
}

describe('AccountAPI', () => {
  let api: MockFetcher;

  beforeEach(() => {
    api = new MockFetcher();
    mockRequest.mockClear();
  });

  it('calls me() with token', async () => {
    const token = 'abc123';
    await api.me(token);
    expect(api.request).toHaveBeenCalledWith('/account/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
  });

  it('calls me() without token', async () => {
    await api.me();
    expect(api.request).toHaveBeenCalledWith('/account/me', {
      headers: {},
    });
  });

  it('calls confirmEmail()', async () => {
    await api.confirmEmail('token123');
    expect(api.request).toHaveBeenCalledWith(
      '/account/confirm-email?token=token123',
    );
  });

  it('calls changePassword()', async () => {
    const oldPwd = 'old',
      newPwd = 'new';
    await api.changePassword(oldPwd, newPwd);
    const call = vi.mocked(api.request).mock.calls[0];
    expect(call[0]).toBe('/account/change-password');
    expect(call[1].method).toBe('POST');
    expect(call[1].body instanceof FormData).toBe(true);
  });

  it('calls changeUsername()', async () => {
    await api.changeUsername('newuser');
    expect(api.request).toHaveBeenCalledWith(
      '/account/change-username?new_username=newuser',
    );
  });

  it('calls changeAvatar() with image_url and file', async () => {
    const file = new File([''], 'avatar.png');
    await api.changeAvatar('http://img', file);
    const call = mockRequest.mock.calls[0];
    expect(call[0]).toBe('/account/change-avatar');
    expect(call[1].method).toBe('POST');
    expect(call[1].body instanceof FormData).toBe(true);
  });

  it('calls createReferralCodes()', async () => {
    await api.createReferralCodes();
    expect(api.request).toHaveBeenCalledWith('/account/new-referral-code');
  });

  it('calls getReferralCodes()', async () => {
    await api.getReferralCodes();
    expect(api.request).toHaveBeenCalledWith('/account/get-referral-codes');
  });

  it('calls useReferralCode()', async () => {
    await api.useReferralCode('ref123');
    const call = mockRequest.mock.calls[0];
    expect(call[0]).toBe('/account/use-referral-code');
    expect(call[1].method).toBe('POST');
    expect(call[1].body instanceof FormData).toBe(true);
  });

  it('calls subscribeNewsletter()', async () => {
    await api.subscribeNewsletter('test@email.com');
    expect(api.request).toHaveBeenCalledWith(
      '/account/subscribe-newsletter?email=test@email.com',
    );
  });

  it('calls unsubscribeNewsletter()', async () => {
    await api.unsubscribeNewsletter('test@email.com');
    expect(api.request).toHaveBeenCalledWith(
      '/account/unsubscribe-newsletter?email=test@email.com',
    );
  });

  it('calls isSubscribed()', async () => {
    await api.isSubscribed('test@email.com');
    expect(api.request).toHaveBeenCalledWith(
      '/account/is-subscribed-newsletter?email=test@email.com',
    );
  });

  it('calls createBookmarkFolder()', async () => {
    await api.createBookmarkFolder('folder1');
    expect(api.request).toHaveBeenCalledWith(
      '/account/new-bookmark-folder?name=folder1',
    );
  });

  it('calls getBookmarkFolders()', async () => {
    await api.getBookmarkFolders();
    expect(api.request).toHaveBeenCalledWith('/account/get-bookmark-folders');
  });

  it('calls getFolderBookmarks()', async () => {
    await api.getFolderBookmarks('folderId');
    expect(api.request).toHaveBeenCalledWith(
      '/account/get-bookmark-folder-topics/folderId',
    );
  });

  it('calls createBookmarkTag()', async () => {
    await api.createBookmarkTag('tag1');
    expect(api.request).toHaveBeenCalledWith(
      '/account/new-bookmark-tag?name=tag1',
    );
  });

  it('calls getBookmarkTags()', async () => {
    await api.getBookmarkTags();
    expect(api.request).toHaveBeenCalledWith('/account/get-bookmark-tags');
  });

  it('calls getTagBookmarks()', async () => {
    await api.getTagBookmarks('tagId');
    expect(api.request).toHaveBeenCalledWith(
      '/account/get-bookmark-tag-topics/tagId',
    );
  });

  it('calls bookmarkTopic()', async () => {
    const bookmark = { id: 'b1' } as any;
    await api.bookmarkTopic(bookmark);
    expect(api.request).toHaveBeenCalledWith('/account/bookmark-topic', {
      method: 'POST',
      body: JSON.stringify(bookmark),
    });
  });

  it('calls getBookmark()', async () => {
    await api.getBookmark('b1');
    expect(api.request).toHaveBeenCalledWith('/account/get-bookmark/b1');
  });

  it('calls getBookmarks()', async () => {
    await api.getBookmarks();
    expect(api.request).toHaveBeenCalledWith('/account/get-bookmarks');
  });

  it('calls updateBookmark()', async () => {
    await api.updateBookmark('b1', { name: 'updated' });
    expect(api.request).toHaveBeenCalledWith('/account/update-bookmark/b1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'updated' }),
    });
  });

  it('calls deleteBookmark()', async () => {
    await api.deleteBookmark('b1');
    expect(api.request).toHaveBeenCalledWith('/account/delete-bookmark/b1', {
      method: 'DELETE',
    });
  });

  it('calls getStories()', async () => {
    const filter = { userId: 'u1' } as any;
    await api.getStories(filter);
    expect(api.request).toHaveBeenCalledWith('/account/stories', {
      method: 'POST',
      body: JSON.stringify(filter),
    });
  });
});
