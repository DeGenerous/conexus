import {
  GENRES_KEY,
  TTL_MONTH,
  SECTIONS_KEY,
  TTL_DAY,
  GetCache,
  SetCache,
} from '@constants/cache';
import { api_error } from '@errors/index';
import { ViewAPI } from '@service/routes';
import { toastStore } from '@stores/toast.svelte';
import { availableGenres } from '@stores/view.svelte';
import contracts from '@constants/contracts';

class CoNexusApp extends ViewAPI {
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
    const cachedData = GetCache<Section[]>(SECTIONS_KEY);
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
    SetCache(SECTIONS_KEY, data, TTL_DAY);

    return data;
  }

  async getGenres(): Promise<Genre[]> {
    const cachedData = GetCache<Genre[]>(GENRES_KEY);
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

    SetCache(GENRES_KEY, data, TTL_MONTH);

    availableGenres.splice(0, availableGenres.length, ...data); // Update state

    return data;
  }

  async getSectionCategories(
    section: string,
    page: number,
    pageSize: number,
  ): Promise<CategoryInSection[]> {
    const { data, error } = await this.sectionCategories(
      section,
      page,
      pageSize,
    );

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

  async getCategoryTopics(
    category_id: number,
    page: number,
    pageSize: number,
  ): Promise<TopicInCategory[]> {
    const { data, error } = await this.categoryTopics(
      category_id,
      page,
      pageSize,
    );

    if (!data) {
      if (error) {
        api_error(error);
      }
      return [];
    }

    return data;
  }

  async searchSectionCategories(
    section: string,
    topic: string,
    page: number = 1,
    pageSize: number = 5,
    sort_order: TopicSortOrder = 'name',
  ): Promise<TopicInCategory[]> {
    const { data, error } = await this.searchSectionByTopic(
      section,
      topic,
      page,
      pageSize,
      sort_order,
    );

    if (!data) {
      if (error) {
        api_error(error);
      }
      return [];
    }

    return data;
  }

  async getGenreTopics(
    section: string,
    genre: string,
    page: number = 1,
    pageSize: number = 5,
    sort_order: TopicSortOrder = 'category',
  ): Promise<TopicInCategory[]> {
    const { data, error } = await this.genreTopics(
      section,
      genre,
      page,
      pageSize,
      sort_order,
    );

    if (!data) {
      if (error) {
        api_error(error);
      }
      return [];
    }

    return data;
  }

  /**
   * Fetches the NFT gates for a specific topic.
   *
   * @param topic_id - The ID of the topic to fetch gates for.
   * @returns A promise that resolves to an array of TopicNFTGateWithContract objects.
   */
  async fetchTopicGates(topic_id: number): Promise<TopicNFTGateWithContract[]> {
    const { data, error } = await this.getTopicNFTGates(topic_id);
    if (!data) {
      if (error) {
        api_error(error);
      }
      return [];
    }

    data.map((gate: TopicNFTGate) => {
      const gateWithContract = gate as TopicNFTGateWithContract;
      const gatingContract = contracts.get(gate.contract_name);
      if (gatingContract) {
        gateWithContract.name = gatingContract.name;
        gateWithContract.link = gatingContract.link;
        return gateWithContract;
      }
    });

    return data;
  }

  async fetchClassGates(): Promise<ClassGate[]> {
    const { data, error } = await this.getClassGates();

    if (!data) {
      if (error) {
        api_error(error);
      }
      return [];
    }

    return data;
  }

  async fetchClassGate(class_ID: number): Promise<ClassGate | null> {
    const { data, error } = await this.getGateClass(class_ID);
    if (!data) {
      if (error) {
        api_error(error);
      }
      return null;
    }
    return data;
  }
}

export default CoNexusApp;
