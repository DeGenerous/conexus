import {
  GENRES_KEY,
  TTL_MONTH,
  SECTIONS_KEY,
  TTL_DAY,
  GetCache,
  SetCache,
} from '@constants/cache';
import { serveUrl } from '@constants/media';
import { tracks } from '@constants/tracks';
import { api_error } from '@errors/index';
import ViewAPI from '@service/router/view';
import { availableGenres } from '@stores/view.svelte';

export default class AppView {
  protected api: ViewAPI;

  private static instance: AppView;

  // Constructor
  constructor() {
    this.api = new ViewAPI(import.meta.env.PUBLIC_BACKEND);
  }

  static getInstance(): AppView {
    if (!AppView.instance) {
      AppView.instance = new AppView();
    }
    return AppView.instance;
  }

  /**
   * Get Sections
   * @returns {Promise<Section[]>} A list of sections for the tenant
   */
  async getSections(): Promise<Section[]> {
    const cachedData = GetCache<Section[]>(SECTIONS_KEY);
    if (cachedData) {
      console.log('Using cached sections data', cachedData);
      return cachedData;
    }

    const { message, data } = await this.api.sections();

    if (!data) {
      api_error(message);
      return [];
    }

    SetCache(SECTIONS_KEY, data, TTL_DAY);

    return data;
  }

  async getGenres(): Promise<Genre[]> {
    const cachedData = GetCache<Genre[]>(GENRES_KEY);
    if (cachedData) {
      return cachedData;
    }

    const { message, data } = await this.api.genres();

    if (!data) {
      api_error(message);
      return [];
    }

    SetCache(GENRES_KEY, data, TTL_MONTH);

    availableGenres.splice(0, availableGenres.length, ...data); // Update state

    return data;
  }
  async getCategoryTopics(
    category_id: string,
    page: number,
    pageSize: number,
  ): Promise<CategoryTopics[]> {
    const { message, data } = await this.api.categoryTopics(
      category_id,
      page,
      pageSize,
    );

    if (!data) {
      api_error(message);
      return [];
    }

    const orderedCategoryTopics = data.sort(
      (a: CategoryTopics, b: CategoryTopics) => {
        if (a.sort_order < b.sort_order) return -1;
        if (a.sort_order > b.sort_order) return 1;
        return 0;
      },
    );

    return orderedCategoryTopics;
  }

  async getSectionCategoryTopics(
    section_id: string,
    page: number,
    pageSize: number,
  ): Promise<SectionCategoryTopics[]> {
    const { status, message, data } = await this.api.sectionTopics(
      section_id,
      page,
      pageSize,
    );

    if (!data || status === 'error') {
      api_error(message);
      return [];
    }

    const orderedSectionCategoriesTopics = data.sort(
      (a: SectionCategoryTopics, b: SectionCategoryTopics) => {
        if (a.sort_order < b.sort_order) return -1;
        if (a.sort_order > b.sort_order) return 1;
        return 0;
      },
    );

    return orderedSectionCategoriesTopics;
  }

  async searchSectionCategories(
    section_id: string,
    topic: string,
    sort_order: TopicSortOrder = 'name',
    page: number = 1,
    pageSize: number = 5,
  ): Promise<CategoryTopics[]> {
    const { status, message, data } = await this.api.searchSectionForTopic(
      section_id,
      topic,
      sort_order,
      page,
      pageSize,
    );

    if (status === 'error') {
      api_error(message);
      return [];
    }

    if (!data) {
      return [];
    }

    const orderedTopics = data.sort((a, b) => {
      if (a.sort_order < b.sort_order) return -1;
      if (a.sort_order > b.sort_order) return 1;
      return 0;
    });

    return orderedTopics;
  }

  async getCreatorCategoryTopics(
    creator_id: string,
    page: number,
    pageSize: number,
  ): Promise<SectionCategoryTopics[]> {
    const { message, data } = await this.api.creatorTopics(
      creator_id,
      page,
      pageSize,
    );

    if (!data) {
      api_error(message);
      return [];
    }

    const orderedSectionCategoriesTopics = data.sort(
      (a: SectionCategoryTopics, b: SectionCategoryTopics) => {
        if (a.sort_order < b.sort_order) return -1;
        if (a.sort_order > b.sort_order) return 1;
        return 0;
      },
    );

    return orderedSectionCategoriesTopics;
  }

  async searchCreatorCategories(
    creator_id: string,
    topic: string,
    sort_order: TopicSortOrder = 'name',
    page: number = 1,
    pageSize: number = 5,
  ): Promise<CategoryTopics[]> {
    const { message, data } = await this.api.searchCreatorForTopic(
      creator_id,
      topic,
      sort_order,
      page,
      pageSize,
    );

    if (!data) {
      api_error(message);
      return [];
    }

    const orderedTopics = data.sort((a, b) => {
      if (a.sort_order < b.sort_order) return -1;
      if (a.sort_order > b.sort_order) return 1;
      return 0;
    });

    return orderedTopics;
  }

  async getGenreTopics(
    section_id: string,
    genre_id: string,
    page: number = 1,
    pageSize: number = 5,
    sort_order: TopicSortOrder = 'category',
  ): Promise<CategoryTopics[]> {
    const { status, message, data } = await this.api.genreTopics(
      section_id,
      genre_id,
      page,
      pageSize,
      sort_order,
    );

    if (status === 'error') {
      api_error(message);
      return [];
    }

    return data || []
  }

  async getTopicPage(
    topic_id: string,
    account_id?: string,
  ): Promise<TopicPage | null> {
    const { message, data } = await this.api.topicView(topic_id, account_id);

    if (!data) {
      api_error(message);
      return null;
    }

    return data;
  }

  async getMediaFile(
    topic_id: string,
    media_type: MediaType,
  ): Promise<string[] | null> {
    const { message, data } = await this.api.getFile(topic_id, media_type);

    if (!data) {
      api_error(message);
      return null;
    }

    return data;
  }

  async serveTopicMedia(file_id: string): Promise<Blob | null> {
    const { message, data } = await this.api.serveMedia(file_id);

    if (!data) {
      api_error(message);
      return null;
    }

    return data;
  }

  async setBackgroundImage(topic_id: string): Promise<string | null> {
    const images = await this.getMediaFile(topic_id, 'background');
    if (images && images.length > 0) {
      let randomImage = images[Math.floor(Math.random() * images.length)];
      return serveUrl(randomImage);
    }

    return null;
  }

  async playBackgroundMusic(topic_id: string): Promise<string | null> {
    let queue: string[] = JSON.parse(localStorage.getItem('queue') ?? '[]');

    const audios = await this.getMediaFile(topic_id, 'audio');
    if (audios && audios.length > 0) {
      let randomAudio = audios[Math.floor(Math.random() * audios.length)];
      return serveUrl(randomAudio);
    }

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

    localStorage.setItem('queue', JSON.stringify(queue));

    return queue.pop() || null;
  }
}
