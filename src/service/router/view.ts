import Fetcher from '../fetcher';

export default class ViewAPI extends Fetcher {
  protected adminGroup: string = '/admin';
  protected topicGroup: string = '/topic';

  /**
   * Retrieves a list of sections.
   * @returns A promise that resolves to an array of Section objects.
   */
  async sections() {
    return this.request<Section[]>(`${this.adminGroup}/sections`);
  }

  /**
   * Retrieves a list of genres.
   * @returns A promise that resolves to an array of Genre objects.
   */
  async genres() {
    return this.request<Genre[]>(`${this.adminGroup}/genres`);
  }

  /**
   * Searches for genres based on a query string.
   * @param query The search query string.
   * @returns A promise that resolves to an array of matching Genre objects.
   */
  async searchGenre(query: string) {
    return this.request<Genre[]>(`${this.adminGroup}/genres/search`, {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }

  /**
   * Retrieves a list of topics within a specific category.
   * @param category_id The ID of the category.
   * @param page The page number to retrieve.
   * @param pageSize The number of topics per page.
   * @returns A promise that resolves to an array of Topic objects.
   */
  async categoryTopics(category_id: string, page: number, pageSize: number) {
    return this.request<CategoryTopics[]>(
      `${this.topicGroup}/category-topics/${category_id}?page=${page}&page_size=${pageSize}`,
    );
  }

  /**
   * Retrieves a list of topics within a specific section.
   * @param section_id The ID of the section.
   * @param page The page number to retrieve.
   * @param pageSize The number of topics per page.
   * @returns A promise that resolves to an array of Topic objects.
   */
  async sectionTopics(section_id: string, page: number, pageSize: number) {
    return this.request<SectionCategoryTopics[]>(
      `${this.topicGroup}/section-topics/${section_id}?page=${page}&page_size=${pageSize}`,
    );
  }

  /**
   * Searches for topics within a specific section.
   * @param section_id The ID of the section.
   * @param query The search query string.
   * @param sort_order The sort order for the results.
   * @param page The page number to retrieve.
   * @param pageSize The number of topics per page.
   * @param search_kind The kind of search to perform.
   * @returns A promise that resolves to an array of Topic objects.
   */
  async searchSectionForTopic(
    section_id: string,
    query: string,
    sort_order: TopicSortOrder = 'name',
    page: number = 1,
    pageSize: number = 5,
    search_kind: '1' | '2' = '1',
  ) {
    return this.request<CategoryTopics[]>(`${this.topicGroup}/search`, {
      method: 'POST',
      body: JSON.stringify({
        section_id,
        query,
        sort_order,
        page,
        pageSize,
        search_kind,
      }),
    });
  }

  /**
   * Retrieves a list of topics for a creator.
   * @param account_id The ID of the creator.
   * @param page The page number to retrieve.
   * @param pageSize The number of topics per page.
   * @returns A promise that resolves to an array of Topic objects.
   */
  async creatorTopics(account_id: string, page: number, pageSize: number) {
    return this.request<SectionCategoryTopics[]>(
      `${this.topicGroup}/creator-topics/${account_id}?page=${page}&page_size=${pageSize}`,
    );
  }

  /**
   * Searches for topics within a specific section.
   * @param account_id The ID of the creator.
   * @param query The search query string.
   * @param sort_order The sort order for the results.
   * @param page The page number to retrieve.
   * @param pageSize The number of topics per page.
   * @param search_kind The kind of search to perform.
   * @returns A promise that resolves to an array of Topic objects.
   */
  async searchCreatorForTopic(
    account_id: string,
    query: string,
    sort_order: TopicSortOrder = 'name',
    page: number = 1,
    pageSize: number = 5,
    search_kind: '1' | '2' = '2',
  ) {
    return this.request<CategoryTopics[]>(`${this.topicGroup}/search`, {
      method: 'POST',
      body: JSON.stringify({
        account_id,
        query,
        sort_order,
        page,
        pageSize,
        search_kind,
      }),
    });
  }

  /**
   * Retrieves a list of topics within a specific genre.
   * @param section_id The ID of the section.
   * @param genre_id The ID of the genre.
   * @param page The page number to retrieve.
   * @param pageSize The number of topics per page.
   * @returns A promise that resolves to an array of Topic objects.
   */
  async genreTopics(
    section_id: string,
    genre_id: string,
    page: number = 1,
    pageSize: number = 5,
    sort_order: TopicSortOrder = 'name',
  ) {
    return this.request<CategoryTopics[]>(`${this.topicGroup}/genre-topics`, {
      method: 'POST',
      body: JSON.stringify({
        section_id,
        genre_id,
        page,
        pageSize,
        sort_order,
      }),
    });
  }

  /**
   * Retrieves the details of a specific topic.
   * @param topic_id The ID of the topic to retrieve.
   * @param account_id The ID of the account making the request.
   * @returns A promise that resolves to the TopicPage object.
   */
  async topicView(topic_id: string, account_id?: string) {
    return this.request<TopicPage>(`${this.topicGroup}/view/${topic_id}`, {
      headers: {
        'X-Requester-ID': account_id || '',
      },
    });
  }

  async getFile(topic_id: string, media_type: MediaType) {
    return this.request<string[]>(
      `${this.topicGroup}/get-media/${topic_id}?media_type=${media_type}`,
    );
  }

  /**
   * Serves media content for a specific file.
   * @param file_id The ID of the file to serve.
   * @returns A promise that resolves to a Blob representing the media content.
   */
  async serveMedia(file_id: string) {
    return this.request<Blob>(
      `${this.topicGroup}/serve-media/${file_id}`,
      {},
      'blob',
    );
  }
}
