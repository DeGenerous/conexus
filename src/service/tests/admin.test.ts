import { describe, it, expect, beforeEach, vi } from 'vitest';

import AdminAPI from '../admin';

const mockRequest = vi.fn();

class MockAdminAPI extends AdminAPI {
  request = mockRequest;
}

describe('AdminAPI', () => {
  let api: MockAdminAPI;

  beforeEach(() => {
    api = new MockAdminAPI();
    mockRequest.mockReset();
  });

  it('listAccounts queries accounts endpoint', async () => {
    await api.listAccounts(2, 25);
    expect(mockRequest).toHaveBeenCalledWith(
      '/admin/accounts?page=2&page_size=25',
    );
  });

  it('getRoles performs GET request', async () => {
    await api.getRoles();
    expect(mockRequest).toHaveBeenCalledWith('/admin/roles?refresh=false', {
      method: 'GET',
    });
  });

  it('changeRole sends patch body', async () => {
    await api.changeRole('account-1', 'role-2');
    expect(mockRequest).toHaveBeenCalledWith('/admin/accounts/change-role', {
      method: 'PATCH',
      body: JSON.stringify({ account_id: 'account-1', new_role_id: 'role-2' }),
    });
  });

  it('disableAccount sends patch payload', async () => {
    await api.disableAccount('account-1');
    expect(mockRequest).toHaveBeenCalledWith('/admin/accounts/disable', {
      method: 'PATCH',
      body: JSON.stringify({ account_id: 'account-1' }),
    });
  });

  it('createSection posts JSON body', async () => {
    const section = { name: 'Section' } as any;
    await api.createSection(section);
    expect(mockRequest).toHaveBeenCalledWith('/admin/sections', {
      method: 'POST',
      body: JSON.stringify(section),
    });
  });

  it('deleteSection hits delete endpoint', async () => {
    await api.deleteSection('section-1');
    expect(mockRequest).toHaveBeenCalledWith('/admin/sections/section-1', {
      method: 'DELETE',
    });
  });

  it('createGenre posts JSON body', async () => {
    const genre = { name: 'Genre' } as any;
    await api.createGenre(genre);
    expect(mockRequest).toHaveBeenCalledWith('/admin/genres', {
      method: 'POST',
      body: JSON.stringify(genre),
    });
  });

  it('deleteGenre deletes genre', async () => {
    await api.deleteGenre('genre-1');
    expect(mockRequest).toHaveBeenCalledWith('/admin/genres/genre-1', {
      method: 'DELETE',
    });
  });

  it('metric count endpoints post payloads', async () => {
    const filter = { foo: 'bar' } as any;

    await api.accountCount(filter);
    expect(mockRequest).toHaveBeenCalledWith('/admin/metrics/count/accounts', {
      method: 'POST',
      body: JSON.stringify(filter),
    });

    mockRequest.mockClear();
    await api.walletCount(filter);
    expect(mockRequest).toHaveBeenCalledWith('/admin/metrics/count/wallets', {
      method: 'POST',
      body: JSON.stringify(filter),
    });

    mockRequest.mockClear();
    await api.topicCount(filter);
    expect(mockRequest).toHaveBeenCalledWith('/admin/metrics/count/topics', {
      method: 'POST',
      body: JSON.stringify(filter),
    });

    mockRequest.mockClear();
    await api.storyCount(filter);
    expect(mockRequest).toHaveBeenCalledWith('/admin/metrics/count/stories', {
      method: 'POST',
      body: JSON.stringify(filter),
    });
  });

  it('metric growth endpoints post payloads', async () => {
    const filter = { foo: 'bar' } as any;

    await api.accountGrowth(filter);
    expect(mockRequest).toHaveBeenCalledWith('/admin/metrics/growth/accounts', {
      method: 'POST',
      body: JSON.stringify(filter),
    });

    mockRequest.mockClear();
    await api.walletGrowth(filter);
    expect(mockRequest).toHaveBeenCalledWith('/admin/metrics/growth/wallets', {
      method: 'POST',
      body: JSON.stringify(filter),
    });

    mockRequest.mockClear();
    await api.topicGrowth(filter);
    expect(mockRequest).toHaveBeenCalledWith('/admin/metrics/growth/topics', {
      method: 'POST',
      body: JSON.stringify(filter),
    });

    mockRequest.mockClear();
    await api.storyGrowth(filter);
    expect(mockRequest).toHaveBeenCalledWith('/admin/metrics/growth/stories', {
      method: 'POST',
      body: JSON.stringify(filter),
    });
  });

  it('top N endpoints post payloads', async () => {
    const filter = { n: 5 } as any;

    await api.accountTopN(filter);
    expect(mockRequest).toHaveBeenCalledWith(
      '/admin/metrics/top-n/active-accounts',
      {
        method: 'POST',
        body: JSON.stringify(filter),
      },
    );

    mockRequest.mockClear();
    await api.topicTopN(filter);
    expect(mockRequest).toHaveBeenCalledWith(
      '/admin/metrics/top-n/played-topics',
      {
        method: 'POST',
        body: JSON.stringify(filter),
      },
    );
  });
});
