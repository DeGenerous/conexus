import { describe, it, expect, beforeEach, vi } from 'vitest';

import MediaAPI from '../media';

const mockRequest = vi.fn();

class MockMediaAPI extends MediaAPI {
  request = mockRequest;
}

describe('MediaAPI', () => {
  let api: MockMediaAPI;

  beforeEach(() => {
    api = new MockMediaAPI();
    mockRequest.mockReset();
  });

  it('serveFile fetches media', async () => {
    await api.serveFile('file-1');
    expect(mockRequest).toHaveBeenCalledWith('/media/serve/file-1');
  });

  it('uploadFile posts form data', async () => {
    const file = new File(['content'], 'file.png');
    await api.uploadFile(file, 1, 'cover' as any);
    const [url, options] = mockRequest.mock.calls[0];
    expect(url).toBe('/media/upload-media');
    expect(options.method).toBe('POST');
    expect(options.body).toBeInstanceOf(FormData);
  });

  it('getFile fetches by topic and type', async () => {
    await api.getFile('topic-1', 'cover' as any);
    expect(mockRequest).toHaveBeenCalledWith(
      '/media/get-media/topic-1?media_type=cover',
    );
  });

  it('DeleteFile sends delete payload', async () => {
    await api.DeleteFile(1, 'file-1', 'cover' as any);
    expect(mockRequest).toHaveBeenCalledWith('/media/delete-media', {
      method: 'DELETE',
      body: JSON.stringify({ topic_id: 1, file_id: 'file-1', media_type: 'cover' }),
    });
  });

  it('moveFile posts JSON payload', async () => {
    await api.moveFile('parent-1', 'file-1');
    expect(mockRequest).toHaveBeenCalledWith('/media/move', {
      method: 'POST',
      body: JSON.stringify({ parent_id: 'parent-1', file_id: 'file-1' }),
    });
  });

  it('deleteFile deletes by id', async () => {
    await api.deleteFile('file-1');
    expect(mockRequest).toHaveBeenCalledWith('/media/delete/file-1', {
      method: 'DELETE',
    });
  });

  it('createNewFolder posts folder payload', async () => {
    await api.createNewFolder('parent-1', 'Folder', 'desc');
    expect(mockRequest).toHaveBeenCalledWith('/media/new-folder', {
      method: 'POST',
      body: JSON.stringify({
        parent_id: 'parent-1',
        name: 'Folder',
        description: 'desc',
      }),
    });
  });

  it('getFolderContent fetches folder', async () => {
    await api.getFolderContent('folder-1');
    expect(mockRequest).toHaveBeenCalledWith('/media/folder_content/folder-1');
  });
});
