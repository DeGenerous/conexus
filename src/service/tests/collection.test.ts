import { describe, it, expect, beforeEach, vi } from 'vitest';

import CollectionAPI from '../collection';

const mockRequest = vi.fn();

class MockCollectionAPI extends CollectionAPI {
  request = mockRequest;
}

describe('CollectionAPI', () => {
  let api: MockCollectionAPI;

  beforeEach(() => {
    api = new MockCollectionAPI();
    mockRequest.mockReset();
  });

  it('creates ERC20 collection', async () => {
    const payload = { name: 'erc20' } as any;
    await api.createERC20Collection(payload);
    expect(mockRequest).toHaveBeenCalledWith('/collection/erc20', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  });

  it('creates ERC721 collection', async () => {
    const payload = { name: 'erc721' } as any;
    await api.createERC721Collection(payload);
    expect(mockRequest).toHaveBeenCalledWith('/collection/nft', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  });

  it('lists and retrieves collections', async () => {
    await api.listCollections();
    expect(mockRequest).toHaveBeenCalledWith('/collection');

    mockRequest.mockClear();
    await api.getCollection('collection-1');
    expect(mockRequest).toHaveBeenCalledWith('/collection/collection-1');
  });

  it('updates and deletes collections', async () => {
    const payload = { name: 'Updated' } as any;
    await api.updateCollection('collection-1', payload);
    expect(mockRequest).toHaveBeenCalledWith('/collection/collection-1', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });

    mockRequest.mockClear();
    await api.deleteCollection('collection-1');
    expect(mockRequest).toHaveBeenCalledWith('/collection/collection-1', {
      method: 'DELETE',
    });
  });

  it('creates gates', async () => {
    const payload = { address: '0x0' } as any;
    await api.createERC20TokenGate(payload);
    expect(mockRequest).toHaveBeenCalledWith('/collection/gate/token', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    mockRequest.mockClear();
    await api.createERC721NFTGate(payload);
    expect(mockRequest).toHaveBeenCalledWith('/collection/gate/nft/token', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    mockRequest.mockClear();
    await api.createERC721ClassGate(payload);
    expect(mockRequest).toHaveBeenCalledWith('/collection/gate/nft/class', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  });

  it('lists, retrieves, and deletes gates', async () => {
    await api.listGates('collection-1');
    expect(mockRequest).toHaveBeenCalledWith('/collection/collection-1/gate');

    mockRequest.mockClear();
    await api.getGate('gate-1');
    expect(mockRequest).toHaveBeenCalledWith('/collection/gate/gate-1');

    mockRequest.mockClear();
    await api.deleteGate('gate-1');
    expect(mockRequest).toHaveBeenCalledWith('/collection/gate/gate-1', {
      method: 'DELETE',
    });
  });
});
