
// import { IMAGE_UPLOAD_DIR, MUSIC_UPLOAD_DIR } from '@/config';

import { MediaAPI } from '@service/routes';



class MediaManager {
  private mediaAPI: MediaAPI;

  constructor() {
    this.mediaAPI = new MediaAPI();
  }

  async uploadFile(file: File, parent_id?: string) {

    return this.mediaAPI.uploadFile(file, parent_id);
  }

  async getFolderContents(folder_id: string): Promise<FolderContent | null> {
    const { data, error} = await this.mediaAPI.getFolderContent(folder_id);

    if (!data) {
      if (error) {
        throw new Error(error.details);
      }

      return null;
    }

    const folderContent =  data;

    console.log('Folder content:', folderContent.name);
    return folderContent;
  }

  async serveFile(file_id: string) {
    return this.mediaAPI.serveFile(file_id);
  }

  // static getFolderList(directory: string) {
  //   try {
  //     return fs
  //       .readdirSync(directory)
  //       .filter((folder) =>
  //         fs.lstatSync(`${directory}/${folder}`).isDirectory(),
  //       );
  //   } catch (error) {
  //     console.error('Error:', error);
  //     return [];
  //   }
  // }

  // static async deleteFolder(folderPath: string) {
  //   try {
  //     const files = await fs.promises.readdir(folderPath);
  //     for (const file of files) {
  //       const filePath = path.resolve(folderPath, file);
  //       const stat = await fs.promises.stat(filePath);
  //       stat.isDirectory()
  //         ? await MediaManager.deleteFolder(filePath)
  //         : await fs.promises.unlink(filePath);
  //     }
  //     await fs.promises.rmdir(folderPath);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // static async createFolder(type: 'music' | 'image', folderName: string) {
  //   if (!type || !folderName) throw new Error('Type or folder name missing');
  //   const sanitizedFolder = folderName.toLowerCase().replace(/[^a-z0-9]/g, '');
  //   const uploadDir = `${type === 'image' ? IMAGE_UPLOAD_DIR : MUSIC_UPLOAD_DIR}/${sanitizedFolder}`;
  //   await fs.promises.mkdir(uploadDir, { recursive: true });
  //   if (type === 'image') {
  //     await fs.promises.mkdir(path.join(uploadDir, 'backgrounds'), {
  //       recursive: true,
  //     });
  //     await fs.promises.mkdir(path.join(uploadDir, 'description'), {
  //       recursive: true,
  //     });
  //   }
  // }

  // static async renameFolder(
  //   type: 'music' | 'image',
  //   oldFolderName: string,
  //   newFolderName: string,
  // ) {
  //   const sanitizedOld = oldFolderName.toLowerCase().replace(/[^a-z0-9]/g, '');
  //   const sanitizedNew = newFolderName.toLowerCase().replace(/[^a-z0-9]/g, '');
  //   const baseDir = type === 'image' ? IMAGE_UPLOAD_DIR : MUSIC_UPLOAD_DIR;
  //   await fs.promises.rename(
  //     `${baseDir}/${sanitizedOld}`,
  //     `${baseDir}/${sanitizedNew}`,
  //   );
  // }

  // static async handleFileUpload(
  //   file: File,
  //   uploadDir: string,
  //   allowedExt: string,
  // ) {
  //   if (!file) throw new Error('File not found');
  //   const fileName = file.name;
  //   if (path.extname(fileName.toLowerCase()) !== allowedExt)
  //     throw new Error(`Invalid file type. Only ${allowedExt} allowed.`);
  //   const buffer = Buffer.from(await file.arrayBuffer());
  //   fs.mkdirSync(uploadDir, { recursive: true });
  //   fs.writeFileSync(path.resolve(uploadDir, fileName), buffer);
  // }

  // static async deleteFile(
  //   type: 'music' | 'image',
  //   folder: string,
  //   folderPath: string,
  //   fileName: string,
  // ) {
  //   if (!type || !folder || !fileName) throw new Error('Missing parameters');
  //   const baseDir = type === 'image' ? IMAGE_UPLOAD_DIR : MUSIC_UPLOAD_DIR;
  //   const filePath = folderPath
  //     ? path.resolve(baseDir, folder, folderPath, fileName)
  //     : path.resolve(baseDir, folder, fileName);
  //   fs.unlinkSync(filePath);
  // }
}

export default MediaManager;
