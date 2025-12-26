import { describe, it, expect, vi, beforeEach } from 'vitest';

import CategoryAPI from '../category';

const mockRequest = vi.fn();

class MockCategoryAPI extends CategoryAPI {
  request = mockRequest;
}

describe('CategoryAPI', () => {
  let api: MockCategoryAPI;
  const category = {
    name: 'Category',
    description: 'Description',
    dashboard_sort_order: 1,
  } as any;

  beforeEach(() => {
    api = new MockCategoryAPI();
    mockRequest.mockReset();
  });

  it('createAdminCategory posts payload', async () => {
    await api.createAdminCategory('section-1', category);
    expect(mockRequest).toHaveBeenCalledWith('/category/admin/section-1', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  });

  it('listAdminCategories fetches section categories', async () => {
    await api.listAdminCategories('section-2');
    expect(mockRequest).toHaveBeenCalledWith('/category/admin/section-2');
  });

  it('createCreatorCategory posts payload', async () => {
    await api.createCreatorCategory(category);
    expect(mockRequest).toHaveBeenCalledWith('/category/creator', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  });

  it('listCreatorCategories fetches creator categories', async () => {
    await api.listCreatorCategories();
    expect(mockRequest).toHaveBeenCalledWith('/category/creator');
  });

  it('deleteAdminCategory sends delete request', async () => {
    await api.deleteAdminCategory('cat-1');
    expect(mockRequest).toHaveBeenCalledWith('/category/admin/cat-1', {
      method: 'DELETE',
    });
  });

  it('deleteCreatorCategory sends delete request', async () => {
    await api.deleteCreatorCategory('cat-2');
    expect(mockRequest).toHaveBeenCalledWith('/category/creator/cat-2', {
      method: 'DELETE',
    });
  });

  it('updateAdmin category field helpers post payloads', async () => {
    await api.updateAdminCategoryName('cat-1', 'New');
    expect(mockRequest).toHaveBeenCalledWith('/category/admin/cat-1/name', {
      method: 'PUT',
      body: JSON.stringify({ name: 'New' }),
    });

    mockRequest.mockClear();
    await api.updateAdminCategoryDescription('cat-1', 'New description');
    expect(mockRequest).toHaveBeenCalledWith(
      '/category/admin/cat-1/description',
      {
        method: 'PUT',
        body: JSON.stringify({ description: 'New description' }),
      },
    );

    mockRequest.mockClear();
    await api.updateAdminCategoryOrder('cat-1', 5);
    expect(mockRequest).toHaveBeenCalledWith('/category/admin/cat-1/order', {
      method: 'PUT',
      body: JSON.stringify({ dashboard_sort_order: 5 }),
    });
  });

  it('updateCreator category field helpers post payloads', async () => {
    await api.updateCreatorCategoryName('cat-2', 'New');
    expect(mockRequest).toHaveBeenCalledWith('/category/creator/cat-2/name', {
      method: 'PUT',
      body: JSON.stringify({ name: 'New' }),
    });

    mockRequest.mockClear();
    await api.updateCreatorCategoryDescription('cat-2', 'New description');
    expect(mockRequest).toHaveBeenCalledWith(
      '/category/creator/cat-2/description',
      {
        method: 'PUT',
        body: JSON.stringify({ description: 'New description' }),
      },
    );

    mockRequest.mockClear();
    await api.updateCreatorCategoryOrder('cat-2', 7);
    expect(mockRequest).toHaveBeenCalledWith('/category/creator/cat-2/order', {
      method: 'PUT',
      body: JSON.stringify({ dashboard_sort_order: 7 }),
    });
  });
});
