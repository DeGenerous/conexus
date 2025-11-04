import { describe, it, expect, beforeEach, vi } from 'vitest';

import GovernAPI from '../curation';

const mockRequest = vi.fn();

class MockGovernAPI extends GovernAPI {
  request = mockRequest;
}

describe('GovernAPI', () => {
  let api: MockGovernAPI;

  beforeEach(() => {
    api = new MockGovernAPI();
    mockRequest.mockReset();
  });

  it('fetches omnihub data', async () => {
    await api.omnihub('contract-1', true);
    expect(mockRequest).toHaveBeenCalledWith(
      '/govern/omnihub/contract-1?refresh=true',
    );
  });

  it('fetches active sessions with pagination', async () => {
    await api.activeSessions(2, 15);
    expect(mockRequest).toHaveBeenCalledWith(
      '/govern/active-sessions?page=2&pageSize=15',
    );
  });

  it('posts neYonVotes payload', async () => {
    const payload = { topic_id: 'topic-1' } as any;
    await api.neYonVotes(payload);
    expect(mockRequest).toHaveBeenCalledWith('/govern/ne-yon-votes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  });

  it('posts regularVotes payload', async () => {
    const payload = { topic_id: 'topic-1' } as any;
    await api.regularVotes(payload);
    expect(mockRequest).toHaveBeenCalledWith('/govern/regular-votes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  });
});
