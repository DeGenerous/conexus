import {
  GENRES_KEY,
  TTL_MONTH,
  SECTIONS_KEY,
  TTL_DAY,
  GetCache,
  SetCache,
  ClearCache,
} from '@constants/cache';
import { serveUrl } from '@constants/media';
import { api_error } from '@errors/index';
import ViewAPI from '@service/v2/view';
import { availableGenres } from '@stores/view.svelte';

/**
 * Provides read-only helpers for fetching view data and caching responses.
 */
export default class AppView {
  protected api: ViewAPI;

  private static instance: AppView;

  /**
   * Initialize the view service with the configured backend endpoint.
   */
  constructor() {
    this.api = new ViewAPI(import.meta.env.PUBLIC_BACKEND);
  }

  /**
   * Get or create the singleton AppView instance.
   * @returns The shared AppView instance.
   */
  static getInstance(): AppView {
    if (!AppView.instance) {
      AppView.instance = new AppView();
    }
    return AppView.instance;
  }

  /**
   * Retrieves a specific section by name.
   * @param section_name The name of the section to retrieve.
   * @returns A promise that resolves to the requested Section object.
   */
  async getSection(section_name: string): Promise<Section | null> {
    const { status, message, data } = await this.api.getSection(section_name);

    if (status === 'error') {
      api_error(message);
      return null;
    }

    return data || null;
  }

  /**
   * Retrieves a specific creator by username.
   * @param username The username of the creator to retrieve.
   * @returns A promise that resolves to the requested Creator object.
   */
  async getCreator(username: string): Promise<Creator | null> {
    const { status, message, data } = await this.api.getCreator(username);

    if (status === 'error') {
      api_error(message);
      return null;
    }

    return data || null;
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

    const { status, message, data } = await this.api.sections();

    if (status === 'error') {
      api_error(message);
      return [];
    }

    if (data) {
      SetCache(SECTIONS_KEY, data, TTL_DAY);
    }

    return data || [];
  }

  /**
   * Retrieve all available genres, caching the result for reuse.
   * @returns A list of genres or an empty array on failure.
   */
  async getGenres(refresh: boolean = false): Promise<Genre[]> {
    if (refresh) ClearCache(GENRES_KEY);

    const cachedData = GetCache<Genre[]>(GENRES_KEY);
    if (cachedData) {
      return cachedData;
    }

    const { status, message, data } = await this.api.genres();

    if (status === 'error') {
      api_error(message);
      return [];
    }

    if (data) {
      SetCache(GENRES_KEY, data, TTL_MONTH);
      availableGenres.splice(0, availableGenres.length, ...data); // Update state
    }

    return data || [];
  }
  /**
   * Fetch topics for a given category.
   * @param category_id - The category identifier.
   * @param page - The page number to request.
   * @param pageSize - The number of topics per page.
   * @returns A sorted list of category topics.
   */
  async getCategoryTopics(
    category_id: string,
    page: number,
    pageSize: number,
  ): Promise<CategoryTopic[]> {
    const { status, message, data } = await this.api.categoryTopics(
      category_id,
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

    const orderedCategoryTopics = data
      .sort((a: CategoryTopic, b: CategoryTopic) => {
        if (a.sort_order < b.sort_order) return -1;
        if (a.sort_order > b.sort_order) return 1;
        return 0;
      })
      .filter((topic) => topic.available);

    return orderedCategoryTopics;
  }

  /**
   * Fetch topics grouped by category within a section.
   * @param section_id - The section identifier.
   * @param page - The page number to request.
   * @param pageSize - The number of records per page.
   * @returns A sorted list of section category topics.
   */
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

    if (status === 'error') {
      api_error(message);
      return [];
    }

    if (!data) {
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

  /**
   * Search for categories or sections that match a topic query.
   * @param id - Section or creator identifier.
   * @param topic - The topic search term.
   * @param sort_order - The sorting strategy to apply.
   * @param page - The page number to request.
   * @param pageSize - The number of items per page.
   * @param intended - Whether to search sections ('s') or creators ('c').
   * @returns A sorted list of category topics.
   */
  async searchCategories(
    id: string,
    topic: string,
    sort_order: TopicSortOrder = 'name',
    page: number = 1,
    pageSize: number = 5,
    intended: 's' | 'c',
  ): Promise<CategoryTopic[]> {
    let response: APIResponse<CategoryTopic[]>;

    switch (intended) {
      case 's':
        response = await this.api.searchSectionForTopic(
          id,
          topic,
          sort_order,
          page,
          pageSize,
        );
        break;

      case 'c':
        response = await this.api.searchCreatorForTopic(
          id,
          topic,
          sort_order,
          page,
          pageSize,
        );
        break;

      default:
        api_error('Invalid intended type');
        return [];
    }

    const { status, message, data } = response;

    if (status === 'error') {
      api_error(message);
      return [];
    }

    if (!data) {
      return [];
    }

    return data.sort((a, b) => a.sort_order - b.sort_order);
  }

  /**
   * Fetch topics grouped by category for a creator.
   * @param creator_id - The creator identifier.
   * @param page - The page number to request.
   * @param pageSize - The number of records per page.
   * @returns A sorted list of creator category topics.
   */
  async getCreatorCategoryTopics(
    creator_id: string,
    page: number,
    pageSize: number,
  ): Promise<SectionCategoryTopics[]> {
    const { status, message, data } = await this.api.creatorTopics(
      creator_id,
      page,
      pageSize,
    );

    if (status === 'error') {
      console.error('Error fetching creator categories:', message);
      api_error(message);
      return [];
    }

    if (!data) {
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

  /**
   * Fetch topics by genre for either sections or creators.
   * @param id - The section or creator identifier.
   * @param genre_id - The genre identifier.
   * @param page - The page number to request.
   * @param pageSize - The number of items per page.
   * @param sort_order - The chosen topic sort order.
   * @param intended - Whether the id references a section ('s') or creator ('c').
   * @returns A list of category topics, or an empty array on failure.
   */
  async getGenreTopics(
    id: string,
    genre_id: string,
    page: number = 1,
    pageSize: number = 5,
    sort_order: TopicSortOrder = 'category',
    intended: 's' | 'c',
  ): Promise<CategoryTopic[]> {
    let response: APIResponse<CategoryTopic[]>;

    switch (intended) {
      case 's':
        response = await this.api.sectionGenreTopics(
          id,
          genre_id,
          page,
          pageSize,
          sort_order,
        );
        break;

      case 'c':
        response = await this.api.creatorGenreTopics(
          id,
          genre_id,
          page,
          pageSize,
          sort_order,
        );
        break;

      default:
        api_error('Invalid intended type');
        return [];
    }

    const { status, message, data } = response;

    if (status === 'error') {
      api_error(message);
      return [];
    }

    return data || [];
  }

  /**
   * Retrieve neighboring topics for a given topic.
   * @param topic_id - The topic identifier.
   * @param page - The page number to request.
   * @param pageSize - The number of neighbors per page.
   * @returns A list of neighboring topics or an empty array on failure.
   */
  async getTopicNeighbors(
    topic_id: string,
    page: number,
    pageSize: number,
  ): Promise<TopicNeighbor[]> {
    const { status, message, data } = await this.api.topicNeighbors(
      topic_id,
      page,
      pageSize,
    );

    if (status === 'error') {
      api_error(message);
      return [];
    }

    return data || [];
  }

  /**
   * Retrieve the topic page details, optionally scoped to an account.
   * @param topic_id - The topic identifier.
   * @param account_id - Optional account identifier.
   * @returns The topic page payload or null on failure.
   */
  async getTopicPage(
    topic_id: string,
    account_id?: string,
  ): Promise<TopicPage | null> {
    const { status, message, data } = await this.api.topicView(
      topic_id,
      account_id,
    );

    if (status === 'error') {
      api_error(message);
      return null;
    }

    return data || null;
  }

  /**
   * Fetch media identifiers for a topic.
   * @param topic_id - The topic identifier.
   * @param media_type - The type of media to request.
   * @returns A list of media identifiers or null on failure.
   */
  async getMediaFile(
    topic_id: string,
    media_type: MediaType,
  ): Promise<string[] | null> {
    const { status, message, data } = await this.api.getFile(
      topic_id,
      media_type,
    );

    if (status === 'error') {
      api_error(message);
      return null;
    }

    return data ?? null;
  }

  /**
   * Request a topic media file by identifier.
   * @param file_id - The media identifier to serve.
   * @returns The media blob or null on failure.
   */
  async serveTopicMedia(file_id: string): Promise<Blob | null> {
    const { status, message, data } = await this.api.serveMedia(file_id);

    if (status === 'error') {
      api_error(message);
      return null;
    }

    return data || null;
  }

  /**
   * Choose a random background image for the provided topic.
   * @param topic_id - The topic identifier.
   * @returns The resolved media URL or null when none exist.
   */
  async setBackgroundImage(topic_id: string): Promise<string | null> {
    const images = await this.getMediaFile(topic_id, 'background');
    if (images && images.length > 0) {
      let randomImage = images[Math.floor(Math.random() * images.length)];
      return serveUrl(randomImage);
    }

    return null;
  }

  /**
   * Choose a random background audio track for the provided topic.
   * @param topic_id - The topic identifier.
   * @returns The resolved media URL or null when none exist.
   */
  async playBackgroundMusic(topic_id: string): Promise<string | null> {
    const audios = await this.getMediaFile(topic_id, 'audio');
    if (audios && audios.length > 0) {
      let randomAudio = audios[Math.floor(Math.random() * audios.length)];
      return serveUrl(randomAudio);
    }

    return null;
  }
}
