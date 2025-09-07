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

  it('listAccounts calls correct endpoint', async () => {
    mockRequest.mockResolvedValue({ accounts: [], count: 0 });
    await api.listAccounts(1, 10);
    expect(mockRequest).toHaveBeenCalledWith(
      '/admin/accounts?page=1&page_size=10',
    );
  });

  it('changeRole calls correct endpoint and payload', async () => {
    await api.changeRole('acc123', 'role456');
    expect(mockRequest).toHaveBeenCalledWith('/admin/accounts/change-role', {
      method: 'PATCH',
      body: JSON.stringify({ account_id: 'acc123', new_role_id: 'role456' }),
    });
  });

  it('disableAccount calls correct endpoint and payload', async () => {
    await api.disableAccount('acc123');
    expect(mockRequest).toHaveBeenCalledWith('/admin/accounts/disable', {
      method: 'PATCH',
      body: JSON.stringify({ account_id: 'acc123' }),
    });
  });

  it('createSection calls correct endpoint and payload', async () => {
    const section = { name: 'Section1' } as any;
    await api.createSection(section);
    expect(mockRequest).toHaveBeenCalledWith('/admin/sections', {
      method: 'POST',
      body: JSON.stringify(section),
    });
  });

  it('deleteSection calls correct endpoint', async () => {
    await api.deleteSection('sec123');
    expect(mockRequest).toHaveBeenCalledWith('/admin/sections/sec123', {
      method: 'DELETE',
    });
  });

  it('createGenre calls correct endpoint and payload', async () => {
    const genre = { name: 'Genre1' } as any;
    await api.createGenre(genre);
    expect(mockRequest).toHaveBeenCalledWith('/admin/genres', {
      method: 'POST',
      body: JSON.stringify(genre),
    });
  });

  it('deleteGenre calls correct endpoint', async () => {
    await api.deleteGenre('gen123');
    expect(mockRequest).toHaveBeenCalledWith('/admin/genres/gen123', {
      method: 'DELETE',
    });
  });

  it('createContract calls correct endpoint and payload', async () => {
    const contract = { title: 'Contract1' } as any;
    await api.createContract(contract);
    expect(mockRequest).toHaveBeenCalledWith('/admin/contracts', {
      method: 'POST',
      body: JSON.stringify(contract),
    });
  });

  it('deleteContract calls correct endpoint', async () => {
    await api.deleteContract('con123');
    expect(mockRequest).toHaveBeenCalledWith('/admin/contracts/con123', {
      method: 'DELETE',
    });
  });

  it('createGate calls correct endpoint and payload', async () => {
    const gate = { name: 'Gate1' } as any;
    await api.createGate(gate);
    expect(mockRequest).toHaveBeenCalledWith('/admin/gates', {
      method: 'POST',
      body: JSON.stringify(gate),
    });
  });

  it('deleteGate calls correct endpoint', async () => {
    await api.deleteGate('gate123');
    expect(mockRequest).toHaveBeenCalledWith('/admin/gates/gate123', {
      method: 'DELETE',
    });
  });

  it('getGate calls correct endpoint', async () => {
    await api.getGate('gate123');
    expect(mockRequest).toHaveBeenCalledWith('/admin/gates/gate123', {
      method: 'GET',
    });
  });

  it('getGates calls correct endpoint', async () => {
    await api.getGates();
    expect(mockRequest).toHaveBeenCalledWith('/admin/gates', {
      method: 'GET',
    });
  });

  it('accountCount calls correct endpoint and payload', async () => {
    const filter = { foo: 'bar' } as any;
    await api.accountCount(filter);
    expect(mockRequest).toHaveBeenCalledWith('/admin/metrics/count/account', {
      method: 'POST',
      body: JSON.stringify(filter),
    });
  });

  it('walletCount calls correct endpoint and payload', async () => {
    const filter = { foo: 'bar' } as any;
    await api.walletCount(filter);
    expect(mockRequest).toHaveBeenCalledWith('/admin/metrics/count/wallet', {
      method: 'POST',
      body: JSON.stringify(filter),
    });
  });

  it('topicCount calls correct endpoint and payload', async () => {
    const filter = { foo: 'bar' } as any;
    await api.topicCount(filter);
    expect(mockRequest).toHaveBeenCalledWith('/admin/metrics/count/topic', {
      method: 'POST',
      body: JSON.stringify(filter),
    });
  });

  it('storyCount calls correct endpoint and payload', async () => {
    const filter = { foo: 'bar' } as any;
    await api.storyCount(filter);
    expect(mockRequest).toHaveBeenCalledWith('/admin/metrics/count/story', {
      method: 'POST',
      body: JSON.stringify(filter),
    });
  });

  it('accountGrowth calls correct endpoint and payload', async () => {
    const filter = { foo: 'bar' } as any;
    await api.accountGrowth(filter);
    expect(mockRequest).toHaveBeenCalledWith('/admin/metrics/growth/account', {
      method: 'POST',
      body: JSON.stringify(filter),
    });
  });

  it('walletGrowth calls correct endpoint and payload', async () => {
    const filter = { foo: 'bar' } as any;
    await api.walletGrowth(filter);
    expect(mockRequest).toHaveBeenCalledWith('/admin/metrics/growth/wallet', {
      method: 'POST',
      body: JSON.stringify(filter),
    });
  });

  it('topicGrowth calls correct endpoint and payload', async () => {
    const filter = { foo: 'bar' } as any;
    await api.topicGrowth(filter);
    expect(mockRequest).toHaveBeenCalledWith('/admin/metrics/growth/topic', {
      method: 'POST',
      body: JSON.stringify(filter),
    });
  });

  it('storyGrowth calls correct endpoint and payload', async () => {
    const filter = { foo: 'bar' } as any;
    await api.storyGrowth(filter);
    expect(mockRequest).toHaveBeenCalledWith('/admin/metrics/growth/story', {
      method: 'POST',
      body: JSON.stringify(filter),
    });
  });

  it('accountTopN calls correct endpoint and payload', async () => {
    const filter: TopNMetricFilter = {
      n: 5,
      start_date: '2023-01-01',
      end_date: '2023-12-31',
    };
    await api.accountTopN(filter);
    expect(mockRequest).toHaveBeenCalledWith(
      '/admin/metrics/top-n/active-accounts',
      {
        method: 'POST',
        body: JSON.stringify(filter),
      },
    );
  });

  it('topicTopN calls correct endpoint and payload', async () => {
    const filter: TopNMetricFilter = {
      n: 5,
      start_date: '2023-01-01',
      end_date: '2023-12-31',
    };
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
