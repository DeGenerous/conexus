import { describe, it, expect, vi, beforeEach } from 'vitest';
import CategoryAPI from '../category';

// Mock Category type
const mockRequest = vi.fn();

// Mock Fetcher base class
class MockFetcher extends CategoryAPI {
  request = mockRequest;
}

describe('CategoryAPI', () => {
  let api: MockFetcher;
  
  const category: Category = {
    name: 'Test Category',
    description: 'Test Description',
    dashboard_sort_order: 1,
  };

  beforeEach(() => {
    api = new MockFetcher();
    api.request.mockClear();
  });

  it('createAdminCategory calls request with correct args', async () => {
    await api.createAdminCategory('section1', category);
    expect(api.request).toHaveBeenCalledWith('/category/admin/section1', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  });

  it('listAdminCategories calls request with correct args', async () => {
    await api.listAdminCategories('section2');
    expect(api.request).toHaveBeenCalledWith('/category/admin/section2');
  });

  it('updateAdminCategory calls request with correct args', async () => {
    await api.updateAdminCategory('cat123', category);
    expect(api.request).toHaveBeenCalledWith('/category/admin/cat123', {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  });

  it('createCreatorCategory calls request with correct args', async () => {
    await api.createCreatorCategory(category);
    expect(api.request).toHaveBeenCalledWith('/category/creator', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  });

  it('listCreatorCategories calls request with correct args', async () => {
    await api.listCreatorCategories();
    expect(api.request).toHaveBeenCalledWith('/category/creator');
  });

  it('updateCreatorCategory calls request with correct args', async () => {
    await api.updateCreatorCategory('cat456', category);
    expect(api.request).toHaveBeenCalledWith('/category/creator/cat456', {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  });
});
