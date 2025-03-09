import Fetcher from '@service/fetcher';

export default class MediaAPI extends Fetcher {
  async uploadFile(file: File, topic_name: string, media_type: MediaType) {
    let url = '';

    switch (media_type) {
      case 'background':
        url = '/admin/upload-background';
        break;
      case 'description':
        url = '/admin/upload-description';
        break;
      case 'tile':
        url = '/admin/upload-tile';
        break;
      case 'audio':
        url = '/admin/upload-audio';
        break;
      case 'video':
        url = '/admin/upload-video';
        break;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('topic_name', topic_name || '');

    return this.request<{ file_id: string | { file_id: string }[] }>(url, {
      method: 'POST',
      body: formData,
    });
  }

  async GetFile(topic_id: string, media_type: MediaType) {
    let url = '';

    switch (media_type) {
      case 'background':
        url = '/admin/get-background';
        break;
      case 'description':
        url = '/admin/get-description';
        break;
      case 'tile':
        url = '/admin/get-tile';
        break;
      case 'audio':
        url = '/admin/get-audio';
        break;
      case 'video':
        url = '/admin/get-video';
        break;
    }

    return this.request<string[]>(`${url}/${topic_id}`);
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
