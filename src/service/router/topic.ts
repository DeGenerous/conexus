import Fetcher from '../fetcher';

/**
 * The API class for handling topic-related requests
 */
/**
 * TopicAPI provides methods for interacting with topics-related endpoints.
 *
 * This class extends the Fetcher base class to provide a set of methods for
 * managing topics, including creating, updating, and deleting topics.
 * - Create a new topic
 * - Get the topic manager data
 * - Add a category to a topic
 * - Remove a category from a topic
 * - Add a genre to a topic
 * - Remove a genre from a topic
 * - Add a gate to a topic
 * - Remove a gate from a topic
 * - Upload a file to a topic
 * - Delete a file from a topic
 *
 * Each method returns a Promise resolving to type APIResponse containing the relevant data or error.
 */
export default class TopicAPI extends Fetcher {
  protected group: string = '/topic';
  protected draftGroup: string = `${this.group}/drafts`;

  /**
   * Create a new topic
   * @param request The topic request data
   * @returns The created topic ID
   */
  async new(request: TopicRequest) {
    return this.request<string>(`${this.group}/new`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Delete a topic
   * @param topic_id The ID of the topic to delete
   * @returns The response from the API
   */
  async delete(topic_id: string) {
    return this.request(`${this.group}/delete`, {
      method: 'DELETE',
      body: JSON.stringify({ topic_id }),
    });
  }

  /**
   * Get the section collection data
   * @param page The page number
   * @param pageSize The number of items per page
   * @param refresh Whether to refresh the data
   * @returns The section collection data
   */
  async sectionCollection(
    page: number = 1,
    pageSize: number = 10,
    refresh: boolean = false,
  ) {
    return this.request<CollectionSection[]>(
      `${this.group}/collection-section?page=${page}&page_size=${pageSize}&refresh=${refresh}`,
    );
  }

  /**
   * Get the creator collection data
   * @param page The page number
   * @param pageSize The number of items per page
   * @param refresh Whether to refresh the data
   * @returns The creator collection data
   */
  async creatorCollection(
    page: number = 1,
    pageSize: number = 10,
    refresh: boolean = false,
  ) {
    return this.request<CollectionCreator[]>(
      `${this.group}/collection-creator?page=${page}&page_size=${pageSize}&refresh=${refresh}`,
    );
  }

  /**
   * Get the section category collection data
   * @param section_id The ID of the section
   * @param page The page number
   * @param pageSize The number of items per page
   * @param refresh Whether to refresh the data
   * @returns The section category collection data
   */
  async sectionCategoryCollection(
    section_id: string,
    page: number = 1,
    pageSize: number = 10,
    refresh: boolean = false,
  ) {
    return this.request<CollectionCategory[]>(
      `${this.group}/collection-category/section/${section_id}?page=${page}&page_size=${pageSize}&refresh=${refresh}`,
    );
  }

  /**
   * Get the creator category collection data
   * @param creator_id The ID of the creator
   * @param page The page number
   * @param pageSize The number of items per page
   * @param refresh Whether to refresh the data
   * @returns The creator category collection data
   */
  async creatorCategoryCollection(
    creator_id: string,
    page: number = 1,
    pageSize: number = 10,
    refresh: boolean = false,
  ) {
    return this.request<CollectionCategory[]>(
      `${this.group}/collection-category/creator/${creator_id}?page=${page}&page_size=${pageSize}&refresh=${refresh}`,
    );
  }

  /**
   * Get the topic collection data
   * @param category_id The ID of the category
   * @param page The page number
   * @param pageSize The number of items per page
   * @param refresh Whether to refresh the data
   * @returns The topic collection data
   */
  async topicCollection(
    category_id: string,
    page: number = 1,
    pageSize: number = 10,
    refresh: boolean = false,
  ) {
    return this.request<CollectionTopic[]>(
      `${this.group}/collection-topic/${category_id}?page=${page}&page_size=${pageSize}&refresh=${refresh}`,
    );
  }

  // /**
  //  * Get the admin collection data
  //  * @returns The admin collection data
  //  */
  // async adminCollection(page: number = 1, pageSize: number = 10) {
  //   return this.request<CollectionSection[]>(
  //     `${this.group}/admin-collection?page=${page}&pageSize=${pageSize}`,
  //   );
  // }

  // /**
  //  * Get the creator collection data
  //  * @returns The creator collection data
  //  */
  // async creatorCollection(page: number = 1, pageSize: number = 10) {
  //   return this.request<CollectionCategory[]>(
  //     `${this.group}/creator-collection?page=${page}&pageSize=${pageSize}`,
  //   );
  // }

  /**
   * Get the topic manager data
   * @param topic_id The ID of the topic
   * @returns The topic manager data
   */
  async topicManager(topic_id: string) {
    return this.request<TopicManager>(`${this.group}/manager/${topic_id}`);
  }

  /**
   * Add a category to a topic
   * @param topic_id The ID of the topic
   * @param category_id The ID of the category
   * @param sort_order The sort order of the category
   * @returns The added category data
   */
  async addCategory(
    topic_id: string,
    category_id: string,
    sort_order?: number,
  ) {
    return this.request(`${this.group}/add-category`, {
      method: 'PATCH',
      body: JSON.stringify({ topic_id, category_id, sort_order }),
    });
  }

  /**
   * Change the sort order of a topic within a category
   * @param topic_id The ID of the topic
   * @param category_id The ID of the category
   * @param sort_order The new sort order for the category
   * @returns The response from the API
   */
  async changeTopicSortOrder(
    topic_id: string,
    category_id: string,
    sort_order: number,
  ) {
    return this.request(`${this.group}/change-sortorder`, {
      method: 'PATCH',
      body: JSON.stringify({ topic_id, category_id, sort_order }),
    });
  }

  /**
   * Remove a category from a topic
   * @param topic_id The ID of the topic
   * @param category_id The ID of the category
   * @returns The removed category data
   */
  async removeCategory(topic_id: string, category_id: string) {
    return this.request(`${this.group}/remove-category`, {
      method: 'PATCH',
      body: JSON.stringify({ topic_id, category_id }),
    });
  }

  /**
   * Add a genre to a topic
   * @param topic_id The ID of the topic
   * @param genre_id The ID of the genre
   * @returns The added genre data
   */
  async addGenre(topic_id: string, genre_id: string) {
    return this.request(`${this.group}/add-genre`, {
      method: 'PATCH',
      body: JSON.stringify({ topic_id, genre_id }),
    });
  }

  /**
   * Remove a genre from a topic
   * @param topic_id The ID of the topic
   * @param genre_id The ID of the genre
   * @returns The removed genre data
   */
  async removeGenre(topic_id: string, genre_id: string) {
    return this.request(`${this.group}/remove-genre`, {
      method: 'PATCH',
      body: JSON.stringify({ topic_id, genre_id }),
    });
  }

  /**
   * Add a gate to a topic
   * @param topic_id The ID of the topic
   * @param gate_id The ID of the gate
   * @returns The added gate data
   */
  async addGate(topic_id: string, gate_id: string) {
    return this.request(`${this.group}/add-gate`, {
      method: 'PATCH',
      body: JSON.stringify({ topic_id, gate_id }),
    });
  }

  /**
   * Remove a gate from a topic
   * @param topic_id The ID of the topic
   * @param gate_id The ID of the gate
   * @returns The removed gate data
   */
  async removeGate(topic_id: string, gate_id: string) {
    return this.request(`${this.group}/remove-gate`, {
      method: 'PATCH',
      body: JSON.stringify({ topic_id, gate_id }),
    });
  }

  /**
   * Change the availability of a topic
   * @param topic_id The ID of the topic
   * @param available Whether the topic is available
   * @returns The response from the API
   */
  async changeAvailability(topic_id: string, available: boolean) {
    return this.request(`${this.group}/change-availability`, {
      method: 'PATCH',
      body: JSON.stringify({ topic_id, available }),
    });
  }

  /**
   * Change the visibility of a topic
   * @param topic_id The ID of the topic
   * @param visible Whether the topic is visible
   * @returns The response from the API
   */
  async changeVisibility(topic_id: string, visible: 'public' | 'private') {
    return this.request(`${this.group}/change-visibility`, {
      method: 'PATCH',
      body: JSON.stringify({ topic_id, visible }),
    });
  }

  /**
   * Upload a file to a topic
   * @param topic_id The ID of the topic
   * @param media_type The type of media being uploaded
   * @param file The file to upload
   * @returns The response from the upload request
   */
  async uploadFile(topic_id: string, media_type: MediaType, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('topic_id', topic_id.toString() || '');
    formData.append('media_type', media_type);

    return this.request<string[]>(`${this.group}/upload-media`, {
      method: 'POST',
      body: formData,
    });
  }

  /**
   * Delete a media file from a topic
   * @param topic_id The ID of the topic
   * @param file_id The ID of the file
   * @param media_type The type of media being deleted
   * @returns The response from the delete request
   */
  async deleteMediaFile(
    topic_id: string,
    file_id: string,
    media_type: MediaType,
  ) {
    return this.request(`${this.group}/delete-media`, {
      method: 'DELETE',
      body: JSON.stringify({ topic_id, file_id, media_type }),
    });
  }

  /**
   * Create a new draft
   * @param request The draft payload
   * @returns The created draft
   */
  async newDraft(request: DraftPayload) {
    return this.request<string>(this.draftGroup, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Get a draft by ID
   * @param draft_id The ID of the draft
   * @returns The draft data
   */
  async getDraft(draft_id: string) {
    return this.request<DraftPayload>(`${this.draftGroup}/${draft_id}`, {
      method: 'GET',
    });
  }

  /**
   * Get all drafts
   * @returns An array of draft data
   */
  async getDrafts() {
    return this.request<DraftPayload[]>(this.draftGroup, {
      method: 'GET',
    });
  }

  /**
   * Search drafts
   * @param query The search query
   * @param page The page number
   * @param page_size The number of items per page
   * @returns An array of draft data
   */
  async searchDrafts(query: string, page: number, page_size: number) {
    return this.request<DraftPayload[]>(
      `${this.draftGroup}/search?query=${query}&page=${page}&page_size=${page_size}`,
    );
  }

  /**
   * Update a draft by ID
   * @param draft_id The ID of the draft
   * @param request The updated draft payload
   * @returns The updated draft data
   */
  async updateDraft(draft_id: string, request: DraftPayload) {
    return this.request(`${this.draftGroup}/${draft_id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  }

  /**
   * Delete a draft by ID
   * @param draft_id The ID of the draft
   * @returns The deleted draft data
   */
  async deleteDraft(draft_id: string) {
    return this.request(`${this.draftGroup}/${draft_id}`, {
      method: 'DELETE',
    });
  }
}
