import Fetcher from '@service/fetcher';

export default class MediaAPI extends Fetcher {
  async upload(file: File, parent_id: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('parent_id', parent_id);

    return this.request<APISTDResposne>('/media/upload', {
      method: 'POST',
      body: formData,
    });
  }

  async serve(file_id: string) {
    return this.request<Blob>(`/media/serve/${file_id}`);
  }

  async delete(file_id: string) {
    return this.request<APISTDResposne>(`/media/delete/${file_id}`, {
      method: 'DELETE',
    });
  }

  async createNewFolder(name: string, parent_id: string, description?: string) {
    return this.request<APISTDResposne>('/media/create-new-folder', {
      method: 'POST',
      body: JSON.stringify({ name, parent_id, description }),
    });
  }

  async folderContent(folder_id: string) {
    return this.request<FolderContent[]>(`/media/folder-content/${folder_id}`);
  }
}

type FolderContent = {
    id: string;
    name: string;
    description: string;
    user_id: string;
    parent_id: string;
    path: string;
    folders: FolderContent[];
    files: FileContent[];
}

type FileContent = {
    id: string;
    name: string;
    path: string;
    content_type: string;
    size: number;
    parent_id: string;
    hash: string;
    data: string;
}
