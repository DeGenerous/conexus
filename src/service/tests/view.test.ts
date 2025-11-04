import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';

import ViewAPI from '../view';

const mockRequest = vi.fn();

class MockViewAPI extends ViewAPI {
  request = mockRequest;
}

describe('ViewAPI', () => {
  let api: MockViewAPI;

  beforeEach(() => {
    api = new MockViewAPI();
    mockRequest.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('getSection fetches section details', async () => {
    await api.getSection('discover');
    expect(mockRequest).toHaveBeenCalledWith('/admin/sections/discover');
  });

  it('getCreator fetches creator', async () => {
    await api.getCreator('user');
    expect(mockRequest).toHaveBeenCalledWith('account/creators/user');
  });

  it('sections fetches list', async () => {
    await api.sections();
    expect(mockRequest).toHaveBeenCalledWith('/admin/sections');
  });

  it('genres fetches list', async () => {
    await api.genres();
    expect(mockRequest).toHaveBeenCalledWith('/admin/genres');
  });

  it('searchGenre posts query payload', async () => {
    await api.searchGenre('fiction');
    expect(mockRequest).toHaveBeenCalledWith('/admin/genres/search', {
      method: 'POST',
      body: JSON.stringify({ query: 'fiction' }),
    });
  });

  it('categoryTopics passes pagination params', async () => {
    await api.categoryTopics('category-1', 3, 15);
    expect(mockRequest).toHaveBeenCalledWith(
      '/topic/category-topics/category-1?page=3&page_size=15',
    );
  });

  it('sectionTopics passes pagination params', async () => {
    await api.sectionTopics('section-1', 2, 25);
    expect(mockRequest).toHaveBeenCalledWith(
      '/topic/section-topics/section-1?page=2&page_size=25',
    );
  });

  it('searchSectionForTopic posts defaults and custom options', async () => {
    await api.searchSectionForTopic('section-1', 'dragon');
    expect(mockRequest).toHaveBeenCalledWith('/topic/search', {
      method: 'POST',
      body: JSON.stringify({
        section_id: 'section-1',
        query: 'dragon',
        sort_order: 'name',
        page: 1,
        pageSize: 5,
        search_kind: 1,
      }),
    });

    mockRequest.mockClear();
    await api.searchSectionForTopic('section-2', 'robot', 'popular', 4, 12, 2);
    expect(mockRequest).toHaveBeenCalledWith('/topic/search', {
      method: 'POST',
      body: JSON.stringify({
        section_id: 'section-2',
        query: 'robot',
        sort_order: 'popular',
        page: 4,
        pageSize: 12,
        search_kind: 2,
      }),
    });
  });

  it('creatorTopics passes pagination params', async () => {
    await api.creatorTopics('account-1', 5, 20);
    expect(mockRequest).toHaveBeenCalledWith(
      '/topic/creator-topics/account-1?page=5&page_size=20',
    );
  });

  it('searchCreatorForTopic posts payload', async () => {
    await api.searchCreatorForTopic('account-1', 'space');
    expect(mockRequest).toHaveBeenCalledWith('/topic/search', {
      method: 'POST',
      body: JSON.stringify({
        account_id: 'account-1',
        query: 'space',
        sort_order: 'name',
        page: 1,
        pageSize: 5,
        search_kind: 2,
      }),
    });
  });

  it('sectionGenreTopics posts with section context', async () => {
    await api.sectionGenreTopics('section-1', 'genre-1', 2, 8, 'popular');
    expect(mockRequest).toHaveBeenCalledWith('/topic/genre-topics', {
      method: 'POST',
      body: JSON.stringify({
        section_id: 'section-1',
        genre_id: 'genre-1',
        page: 2,
        page_size: 8,
        sort_order: 'popular',
        search_kind: 1,
      }),
    });
  });

  it('creatorGenreTopics posts with creator context', async () => {
    await api.creatorGenreTopics('account-1', 'genre-1', 3, 9, 'popular');
    expect(mockRequest).toHaveBeenCalledWith('/topic/genre-topics', {
      method: 'POST',
      body: JSON.stringify({
        account_id: 'account-1',
        genre_id: 'genre-1',
        page: 3,
        pageSize: 9,
        sort_order: 'popular',
        search_kind: 2,
      }),
    });
  });

  it('topicNeighbors requests neighbor data', async () => {
    await api.topicNeighbors('topic-1', 2, 6);
    expect(mockRequest).toHaveBeenCalledWith(
      '/topic/neighbors/topic-1?page=2&page_size=6',
    );
  });

  it('topicView sends requester header when provided', async () => {
    await api.topicView('topic-1', 'account-1');
    expect(mockRequest).toHaveBeenCalledWith('/topic/view/topic-1', {
      headers: { 'X-Requester-ID': 'account-1' },
    });

    mockRequest.mockClear();
    await api.topicView('topic-2');
    expect(mockRequest).toHaveBeenCalledWith('/topic/view/topic-2', {
      headers: { 'X-Requester-ID': '' },
    });
  });

  it('getFile forwards parameters', async () => {
    await api.getFile('topic-1', 'cover' as any);
    expect(mockRequest).toHaveBeenCalledWith(
      '/topic/get-media/topic-1?media_type=cover',
    );
  });

  it('serveMedia requests blob response', async () => {
    await api.serveMedia('file-1');
    expect(mockRequest).toHaveBeenCalledWith(
      '/topic/serve-media/file-1',
      {},
      'blob',
    );
  });
});
