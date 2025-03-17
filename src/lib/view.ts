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
    const CACHE_KEY = 'sections';
    const CACHE_EXPIRY_KEY = 'sections_expiry';
    const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

    const cachedData = localStorage.getItem(CACHE_KEY);
    const cacheExpiry = localStorage.getItem(CACHE_EXPIRY_KEY);
    const now = Date.now();

    // Return cached data if valid
    if (cachedData && cacheExpiry && now < parseInt(cacheExpiry)) {
      return JSON.parse(cachedData);
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

    // Store in localStorage with expiry timestamp
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(
      CACHE_EXPIRY_KEY,
      (now + CACHE_DURATION_MS).toString(),
    );

    return data;
  }

  async getSectionCategories(section: string): Promise<CategoryInSection[]> {
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
    const CACHE_KEY = 'genres';
    const CACHE_EXPIRY_KEY = 'genres_expiry';
    const CACHE_DURATION_MS = 5 * 60 * 60 * 1000; // 5 hours

    const cachedData = localStorage.getItem(CACHE_KEY);
    const cacheExpiry = localStorage.getItem(CACHE_EXPIRY_KEY);
    const now = Date.now();

    // Return cached data if valid
    if (cachedData && cacheExpiry && now < parseInt(cacheExpiry)) {
      const genres = JSON.parse(cachedData);
      availableGenres.set(genres); // Update store with cached data
      return genres;
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

    // Store in localStorage with expiry timestamp
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(
      CACHE_EXPIRY_KEY,
      (now + CACHE_DURATION_MS).toString(),
    );

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
}
