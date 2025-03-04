import Fetcher from '@service/fetcher';

export default class MediaAPI extends Fetcher {
  async uploadFile(file: File, parent_id?: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('parent_id', parent_id || '');

    return this.request<APISTDResposne>('/media/upload', {
      method: 'POST',
      body: formData,
    });
  }

  async serveFile(file_id: string) {
    return this.request<Blob>(`/media/serve/${file_id}`);
  }

  async moveFile(parent_id: string, file_id: string) {
    return this.request<APISTDResposne>('/media/move', {
      method: 'POST',
      body: JSON.stringify({ parent_id, file_id }),
    });
  }

  async deleteFile(file_id: string) {
    return this.request<APISTDResposne>(`/media/delete/${file_id}`, {
      method: 'DELETE',
    });
  }

  async createNewFolder(parent_id: string, name: string, description?: string) {
    return this.request<APISTDResposne>('/media/new-folder', {
      method: 'POST',
      body: JSON.stringify({ parent_id, name, description }),
    });
  }

  async getFolderContent(folder_id: string) {
    return this.request<FolderContent>(`/media/folder_content/${folder_id}`);
  }
}
