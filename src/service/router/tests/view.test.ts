import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';

import ViewAPI from '../view';

const mockRequest = vi.fn();

class MockFetcher extends ViewAPI {
  request = mockRequest;
}

describe('ViewAPI', () => {
  let api: MockFetcher;

  beforeEach(() => {
    mockRequest.mockReset();
    api = new MockFetcher();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls request with correct URL for sections', async () => {
    mockRequest.mockResolvedValue([]);
    await api.sections();
    expect(mockRequest).toHaveBeenCalledWith('/admin/sections');
  });

  it('calls request with correct URL for genres', async () => {
    mockRequest.mockResolvedValue([]);
    await api.genres();
    expect(mockRequest).toHaveBeenCalledWith('/admin/genres');
  });

  it('calls request with correct URL and body for searchGenre', async () => {
    mockRequest.mockResolvedValue([]);
    const query = 'fiction';
    await api.searchGenre(query);
    expect(mockRequest).toHaveBeenCalledWith('/admin/genres/search', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  });

  it('calls request with correct URL for getRoles', async () => {
    mockRequest.mockResolvedValue([]);
    await api.getRoles();
    expect(mockRequest).toHaveBeenCalledWith('/admin/roles');
  });

  it('calls request with correct URL for sectionTopics', async () => {
    mockRequest.mockResolvedValue([]);
    await api.sectionTopics('sec1', 2, 10);
    expect(mockRequest).toHaveBeenCalledWith(
      '/topic/section-categories/sec1?page=2&page_size=10',
    );
  });

  it('calls request with correct URL for categoryTopics', async () => {
    mockRequest.mockResolvedValue([]);
    await api.categoryTopics(5, 1, 20);
    expect(mockRequest).toHaveBeenCalledWith(
      '/topic/category-topics/5?page=1&page_size=20',
    );
  });

  it('calls request with correct URL and default params for genreTopics', async () => {
    mockRequest.mockResolvedValue([]);
    await api.genreTopics('genre1');
    expect(mockRequest).toHaveBeenCalledWith(
      '/topic/genre-topics/genre1?page=1&page_size=5',
    );
  });

  it('calls request with correct URL and custom params for genreTopics', async () => {
    mockRequest.mockResolvedValue([]);
    await api.genreTopics('genre2', 3, 15);
    expect(mockRequest).toHaveBeenCalledWith(
      '/topic/genre-topics/genre2?page=3&page_size=15',
    );
  });

  it('calls request with correct URL and body for searchSectionForTopic with defaults', async () => {
    mockRequest.mockResolvedValue([]);
    await api.searchSectionForTopic('sec2', 'query');
    expect(mockRequest).toHaveBeenCalledWith('/topic/search', {
      method: 'POST',
      body: JSON.stringify({
        section_id: 'sec2',
        query: 'query',
        sort_order: 'name',
        page: 1,
        pageSize: 5,
        search_kind: '1',
      }),
    });
  });

  it('calls request with correct URL and body for searchSectionForTopic with custom params', async () => {
    mockRequest.mockResolvedValue([]);
    await api.searchSectionForTopic('sec3', 'topic', 'name', 2, 10, '2');
    expect(mockRequest).toHaveBeenCalledWith('/topic/search', {
      method: 'POST',
      body: JSON.stringify({
        section_id: 'sec3',
        query: 'topic',
        sort_order: 'name',
        page: 2,
        pageSize: 10,
        search_kind: '2',
      }),
    });
  });

  it('calls request with correct URL and header for topicView with account_id', async () => {
    mockRequest.mockResolvedValue({});
    await api.topicView(42, 'acc123');
    expect(mockRequest).toHaveBeenCalledWith('/topic/view/42', {
      headers: {
        'X-Requester-ID': 'acc123',
      },
    });
  });

  it('calls request with correct URL and header for topicView without account_id', async () => {
    mockRequest.mockResolvedValue({});
    await api.topicView(99);
    expect(mockRequest).toHaveBeenCalledWith('/topic/view/99', {
      headers: {
        'X-Requester-ID': '',
      },
    });
  });

  it('calls request with correct URL and blob responseType for serveMedia', async () => {
    mockRequest.mockResolvedValue(new Blob());
    await api.serveMedia('file123');
    expect(mockRequest).toHaveBeenCalledWith(
      '/topic/serve-media/file123',
      {},
      'blob',
    );
  });

  // ...repeat for other tests, replacing api.request with mockRequest
});
