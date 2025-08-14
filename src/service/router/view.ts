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
   * Retrieves a list of roles.
   * @returns A promise that resolves to an array of TenantRole objects.
   */
  async getRoles() {
    return this.request<TenantRole[]>(`${this.adminGroup}/roles`);
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
      `${this.topicGroup}/section-categories/${section_id}?page=${page}&page_size=${pageSize}`,
    );
  }

  /**
   * Retrieves a list of topics within a specific category.
   * @param category_id The ID of the category.
   * @param page The page number to retrieve.
   * @param pageSize The number of topics per page.
   * @returns A promise that resolves to an array of Topic objects.
   */
  async categoryTopics(category_id: number, page: number, pageSize: number) {
    return this.request<CategoryTopics[]>(
      `${this.topicGroup}/category-topics/${category_id}?page=${page}&page_size=${pageSize}`,
    );
  }

  /**
   * Retrieves a list of topics within a specific genre.
   * @param genre_id The ID of the genre.
   * @param page The page number to retrieve.
   * @param pageSize The number of topics per page.
   * @returns A promise that resolves to an array of Topic objects.
   */
  async genreTopics(genre_id: string, page: number = 1, pageSize: number = 5) {
    return this.request<TopicInCategory[]>(
      `${this.topicGroup}/genre-topics/${genre_id}?page=${page}&page_size=${pageSize}`,
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
   * Retrieves the details of a specific topic.
   * @param topic_id The ID of the topic to retrieve.
   * @param account_id The ID of the account making the request.
   * @returns A promise that resolves to the TopicPage object.
   */
  async topicView(topic_id: number, account_id?: string) {
    return this.request<TopicPage>(`${this.topicGroup}/view/${topic_id}`, {
      headers: {
        'X-Requester-ID': account_id || '',
      },
    });
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
