import Fetcher from '@service/fetcher';

export default class MediaAPI extends Fetcher {
  async serveFile(file_id: string) {
    return this.request<Blob>(`/media/serve/${file_id}`);
  }

  async uploadFile(file: File, topic_id: number, media_type: MediaType) {
    let url = '/media/upload-media';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('topic_id', topic_id.toString() || '');
    formData.append('media_type', media_type);

    return this.request<string[]>(url, {
      method: 'POST',
      body: formData,
    });
  }

  async getFile(topic_id: string, media_type: MediaType) {
    let url = '/media/get-media';

    return this.request<string[]>(
      `${url}/${topic_id}?media_type=${media_type}`,
    );
  }

  async DeleteFile(topic_id: number, file_id: string, media_type: MediaType) {
    let url = '/media/delete-media';

    return this.request<APISTDResposne>(url, {
      method: 'DELETE',
      body: JSON.stringify({ topic_id, file_id, media_type }),
    });
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
