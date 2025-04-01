import {
  GENRE_CACHE_KEY,
  GENRE_CACHE_TTL,
  SECTION_CACHE_KEY,
  SECTION_CACHE_TTL,
  SECTION_CATEGORY_CACHE_KEY,
  SECTION_CATEGORY_CACHE_TTL,
  GetCache,
  SetCache,
} from '@constants/cache';
import { api_error } from '@errors/index';
import { ViewAPI } from '@service/routes';
import { toastStore } from '@stores/toast';
import { availableGenres } from '@stores/view';

export class CoNexusApp extends ViewAPI {
  private static instance: CoNexusApp;
  // Constructor
  constructor() {
    super(import.meta.env.PUBLIC_BACKEND);
  }

  static getInstance(): CoNexusApp {
    if (!CoNexusApp.instance) {
      CoNexusApp.instance = new CoNexusApp();
    }
    return CoNexusApp.instance;
  }

  async getSections(): Promise<Section[]> {
    // Return cached data if valid
    const cachedData = GetCache<Section[]>(SECTION_CACHE_KEY);
    if (cachedData) {
      return cachedData;
    }

    // Fetch fresh data
    const { data, error } = await this.sections();

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error fetching view', 'error');
      }
      return [];
    }

    // Store in localStorage
    SetCache(SECTION_CACHE_KEY, data, SECTION_CACHE_TTL);

    return data;
  }

  async getSectionCategories(section: string): Promise<CategoryInSection[]> {
    // type SectionCategory = {
    //   [section: string]: CategoryInSection[];
    // };

    // const cachedData = GetCache<SectionCategory>(SECTION_CATEGORY_CACHE_KEY);
    // if (cachedData) {
    //   return cachedData[section];
    // }

    const { data, error } = await this.sectionCategories(section);

    if (!data) {
      if (error) {
        api_error(error);
      }
      return [];
    }

    const orderedCategories = data.sort(
      (a: CategoryInSection, b: CategoryInSection) => {
        if (a.order < b.order) return -1;
        if (a.order > b.order) return 1;
        return 0;
      },
    );

    // SetCache(SECTION_CATEGORY_CACHE_KEY, { [section]: orderedCategories }, SECTION_CATEGORY_CACHE_TTL);

    return orderedCategories;
  }

  async searchSectionCategories(
    section: string,
    topic: string,
  ): Promise<CategoryInSection[]> {
    const { data, error } = await this.searchSectionByTopic(section, topic);

    if (!data) {
      if (error) {
        api_error(error);
      }
      return [];
    }

    return data;
  }

  async getGenres(): Promise<Genre[]> {
    const cachedData = GetCache<Genre[]>(GENRE_CACHE_KEY);
    if (cachedData) {
      return cachedData;
    }

    // Fetch fresh data
    const { data, error } = await this.genres();

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error fetching genres', 'error');
      }
      return [];
    }

    SetCache(GENRE_CACHE_KEY, data, GENRE_CACHE_TTL);

    availableGenres.set(data); // Update store

    return data;
  }

  async getGenreTopics(
    genre: string,
    section: string,
  ): Promise<CategoryInSection[]> {
    const { data, error } = await this.genreTopics(genre, section);

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error fetching genre topics', 'error');
      }
      return [];
    }

    return data;
  }

  /**
   * Fetches the NFT gates for a specific topic.
   *
   * @param topic_id - The ID of the topic to fetch gates for.
   * @returns A promise that resolves to an array of TopicNFTGate objects.
   */
    async fetchTopicGates(topic_id: number): Promise<TopicNFTGate[]> {
      const { data, error } = await this.getTopicNFTGates(topic_id);
      if (!data) {
        if (error) {
          api_error(error);
        }
        return [];
      }
      return data;
    }
}
