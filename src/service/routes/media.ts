import Fetcher from '@service/fetcher';

export default class MediaAPI extends Fetcher {
  async uploadFile(file: File, topic_name: string, media_type: MediaType) {
    let url = '';

    switch (media_type) {
      case 'background':
        url = '/media/upload-background';
        break;
      case 'description':
        url = '/media/upload-description';
        break;
      case 'tile':
        url = '/media/upload-tile';
        break;
      case 'audio':
        url = '/media/upload-audio';
        break;
      case 'video':
        url = '/media/upload-video';
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
        url = '/media/get-background';
        break;
      case 'description':
        url = '/media/get-description';
        break;
      case 'tile':
        url = '/media/get-tile';
        break;
      case 'audio':
        url = '/media/get-audio';
        break;
      case 'video':
        url = '/media/get-video';
        break;
    }

    return this.request<string[]>(`${url}/${topic_id}`);
  }

  async DeleteFile(topic_id: number, file_id: string, media_type: MediaType) {
    let url = '';

    switch (media_type) {
      case 'background':
        url = '/media/delete-background';
        break;
      case 'description':
        url = '/media/delete-description';
        break;
      case 'tile':
        url = '/media/delete-tile';
        break;
      case 'audio':
        url = '/media/delete-audio';
        break;
      case 'video':
        url = '/media/delete-video';
        break;
    }

    return this.request<APISTDResposne>(url, {
      method: 'DELETE',
      body: JSON.stringify({ topic_id, file_id }),
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
