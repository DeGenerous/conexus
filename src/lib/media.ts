// import { IMAGE_UPLOAD_DIR, MUSIC_UPLOAD_DIR } from '@/config';

import { serveUrl, blankImage } from '@constants/media';
import { tracks } from '@constants/tracks';
import { MediaAPI } from '@service/v1';
import { toastStore } from '@stores/toast.svelte';
import { game } from '@stores/conexus.svelte';

/**
 * Manages media assets tied to topics and game state.
 */
class MediaManager {
  private mediaAPI: MediaAPI;

  /**
   * Instantiate the media manager with the configured API client.
   */
  constructor() {
    this.mediaAPI = new MediaAPI(import.meta.env.PUBLIC_BACKEND);
  }

  /**
   * Request a media file by its identifier.
   * @param file_id - The media file identifier to serve.
   * @returns A promise resolving to the server response.
   */
  async serveFile(file_id: string) {
    return this.mediaAPI.serveFile(file_id);
  }

  /**
   * Upload a media asset for a topic.
   * @param file - The file to upload.
   * @param topic_id - The topic receiving the media.
   * @param media_type - The type of media being uploaded.
   * @returns A list of uploaded media identifiers, or an empty array on failure.
   */
  async uploadTopicMedia(file: File, topic_id: number, media_type: MediaType) {
    const { status, message, data, error } = await this.mediaAPI.uploadFile(
      file,
      topic_id,
      media_type,
    );

    if (status === 'error') {
      const detail =
        error?.details || message || 'Unable to process media upload';
      if (
        detail.includes('pq: duplicate key value violates unique constraint')
      ) {
        toastStore.show('This file already exists', 'error');
        return [];
      }
      toastStore.show(detail, 'error');
      return [];
    }

    return data || [];
  }

  /**
   * Fetch media identifiers for the given topic.
   * @param topic_id - The topic identifier to fetch media for.
   * @param media_type - The type of media to retrieve.
   * @returns A list of media identifiers, or an empty array when not found.
   */
  async fetchTopicMedia(
    topic_id: string,
    media_type: MediaType,
  ): Promise<string[]> {
    const { status, message, data } = await this.mediaAPI.getFile(
      topic_id,
      media_type,
    );

    if (status === 'error') {
      toastStore.show(message || 'Unable to fetch media', 'error');
      return [];
    }

    return data || [];
  }

  /**
   * Delete media previously uploaded to a topic.
   * @param topic_id - The topic identifier.
   * @param file_id - The media identifier to remove.
   * @param media_type - The media type of the file.
   */
  async deleteTopicMedia(
    topic_id: number,
    file_id: string,
    media_type: MediaType,
  ) {
    // const KEY = `${MEDIA_CACHE_KEY}_${topic_id}_${media_type}`;

    const { status, message, error } = await this.mediaAPI.DeleteFile(
      topic_id,
      file_id,
      media_type,
    );

    if (status === 'error') {
      throw new Error(error?.details || message || 'Unable to delete media');
    }

    // ClearCache(KEY);
  }

  /**
   * Convenience wrapper to fetch media using a numeric topic id.
   * @param topic_id - The topic identifier.
   * @param media_type - The media type to retrieve.
   * @returns A list of media identifiers, or an empty array when not found.
   */
  async fetchMedia(topic_id: number, media_type: MediaType): Promise<string[]> {
    return this.fetchTopicMedia(topic_id.toString(), media_type);
  }

  /**
   * Resolve the primary story image for display.
   * @param topid_id - The topic identifier.
   * @param media_type - The media type to request.
   * @returns A served URL to the image or a fallback placeholder.
   */
  async fetchStoryImage(
    topid_id: number,
    media_type: MediaType,
  ): Promise<string> {
    const images = await this.fetchMedia(topid_id, media_type);
    if (images.length === 0) {
      return blankImage;
    }

    return serveUrl(images[0]);
  }

  /**
   * Assign a random background image from the topic media to the game state.
   * @param topic_id - The topic identifier to load media for.
   */
  async setBackgroundImage(topic_id: number): Promise<void> {
    const images = await this.fetchMedia(topic_id, 'background');
    if (images.length > 0) {
      let randomImage = images[Math.floor(Math.random() * images.length)];
      game.background_image = serveUrl(randomImage);

      console.log('bg image is set');
      console.log(game.background_image);
    }
  }

  /**
   * Configure background music for the game, falling back to default tracks when needed.
   * @param topic_id - The topic identifier to load media for.
   */
  async playBackgroundMusic(topic_id: number): Promise<void> {
    let queue: string[] = JSON.parse(localStorage.getItem('queue') ?? '[]');

    const audios = await this.fetchMedia(topic_id, 'audio');
    if (audios.length > 0) {
      let randomAudio = audios[Math.floor(Math.random() * audios.length)];
      game.background_music = serveUrl(randomAudio);
      return;
    }

    /**
     * Shuffle the default audio tracks to vary the playlist.
     */
    const shuffle = <T>(array: T[]): T[] => {
      let currentIndex = array.length,
        randomIndex: number;

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }

      return array;
    };

    if (queue.length === 0) {
      queue = shuffle([...tracks]);
    }

    game.background_music = queue.pop();

    localStorage.setItem('queue', JSON.stringify(queue));
  }

  /* OLD CODE */

  // async fetch_story_image(
  //   category: string,
  //   type: 'tile' | 'description',
  // ): Promise<string | null> {
  //   let formattedFileName = MediaManager.#formatFileName(category);
  //   let folderUrl = `https://media.dgrslabs.ink/conexus-categories/images/${formattedFileName}/description/${type}.avif`;

  //   let valid = await MediaManager.#isValidImageUrl(folderUrl);
  //   if (valid) {
  //     return folderUrl;
  //   }

  //   return null;
  // }

  // private static async playBackgroundMusic(story_name: string): Promise<void> {
  //   let queue: string[] = JSON.parse(localStorage.getItem('queue') ?? '[]');

  //   let categoryTrackURL: string | null = null;

  //   if (story_name) {
  //     categoryTrackURL = await this.#fetchRandomMusicUrl(story_name);
  //     if (categoryTrackURL) {
  //       const categoryFileExists = await fetch(categoryTrackURL).then(
  //         (res) => res.ok,
  //       );

  //       if (categoryFileExists) {
  //         background_music.set(categoryTrackURL);
  //         return;
  //       }
  //     }
  //   }

  //   if (queue.length === 0) {
  //     queue = this.#shuffle([...tracks]);
  //   }

  //   background_music.set(queue.pop());

  //   localStorage.setItem('queue', JSON.stringify(queue));
  // }

  // // Get story background image
  // private static async setBackgroundImage(story_name: string) {
  //   let url = await this.#fetch_background_image(story_name);

  //   if (url) {
  //     background_image.set(url);
  //   }
  // }

  // static #formatFileName(category: string): string {
  //   let fileName = category.toLowerCase();
  //   let formattedFileName = fileName.replace(/[^a-z0-9]/g, '');

  //   return formattedFileName;
  // }

  // static #isValidImageUrl(url: string): Promise<boolean> {
  //   return new Promise((resolve) => {
  //     const img = new Image();
  //     img.src = url;
  //     img.onload = () => resolve(true);
  //     img.onerror = () => resolve(false);
  //   });
  // }

  // static async #fetchRandomMusicUrl(category: string): Promise<string | null> {
  //   const formattedFileName = this.#formatFileName(category);

  //   const folderURL = `https://media.dgrslabs.ink/conexus-categories/music/${formattedFileName}`;

  //   const response = await fetch(folderURL);

  //   if (!response.ok) {
  //     return null;
  //   }

  //   const files = await response.json();

  //   if (Array.isArray(files) && files.length > 0) {
  //     let randomFile = files[Math.floor(Math.random() * files.length)];
  //     let url = `${folderURL}/${randomFile.name}`;

  //     return url;
  //   }

  //   return null;
  // }

  // static async #fetch_background_image(
  //   category: string,
  // ): Promise<string | null> {
  //   let formattedFileName = this.#formatFileName(category);
  //   let folderUrl = `https://media.dgrslabs.ink/conexus-categories/images/${formattedFileName}/backgrounds`;

  //   let response = await fetch(folderUrl);
  //   let files = await response.json();

  //   if (Array.isArray(files) && files.length > 0) {
  //     let randomFile = files[Math.floor(Math.random() * files.length)];
  //     let url = `${folderUrl}/${randomFile.name}`;

  //     let valid = await this.#isValidImageUrl(url);
  //     if (valid) {
  //       return url;
  //     }
  //   }

  //   return null;
  // }

  // static #shuffle = <T>(array: T[]): T[] => {
  //   let currentIndex = array.length,
  //     randomIndex: number;

  //   while (currentIndex !== 0) {
  //     randomIndex = Math.floor(Math.random() * currentIndex);
  //     currentIndex--;

  //     [array[currentIndex], array[randomIndex]] = [
  //       array[randomIndex],
  //       array[currentIndex],
  //     ];
  //   }

  //   return array;
  // };

  // async getFolderContents(folder_id: string): Promise<FolderContent | null> {
  //   const { data, error } = await this.mediaAPI.getFolderContent(folder_id);

  //   if (!data) {
  //     if (error) {
  //       throw new Error(error.details);
  //     }

  //     return null;
  //   }

  //   const folderContent = data;

  //   console.log('Folder content:', folderContent.name);
  //   return folderContent;
  // }

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
