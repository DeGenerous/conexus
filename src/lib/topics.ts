import { api_error } from '@errors/index';
import TopicAPI from '@service/topic';
import { toastStore } from '@stores/toast.svelte';

/**
 * Provides high-level helpers for topic lifecycle management and media operations.
 */
export default class Topic {
  protected api: TopicAPI;

  /**
   * Initialize the topic service with the configured backend endpoint.
   */
  constructor() {
    this.api = new TopicAPI(import.meta.env.PUBLIC_BACKEND);
  }

  /**
   * Create a new topic.
   * @param body - The topic payload to send.
   * @returns The newly created topic identifier, or null on failure.
   */
  async newTopic(body: TopicRequest): Promise<string | null> {
    const { status, message, data } = await this.api.new(body);

    if (status === 'error') {
      api_error(message);
      return null;
    }

    return data ?? null;
  }

  /**
   * Submit a topic for review.
   * @param topic_id - The identifier of the topic to submit.
   */
  async submitTopic(topic_id: string): Promise<void> {
    const { status, message } = await this.api.submit(topic_id);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(
      message || `Story ${topic_id} submitted successfully`,
      'info',
    );
  }

  /**
   * Delete an existing topic.
   * @param topic_id - The identifier of the topic to delete.
   */
  async deleteTopic(topic_id: string): Promise<void> {
    const { status, message } = await this.api.delete(topic_id);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(
      message || `Story ${topic_id} deleted successfully`,
      'info',
    );
  }

  /**
   * Save a new draft for a topic.
   * @param body - The draft payload to persist.
   * @returns The draft identifier or null on failure.
   */
  async saveNewTopicDraft(body: DraftPayload): Promise<string | null> {
    const { status, message, data } = await this.api.newDraft(body);

    if (status === 'error') {
      api_error(message);
      return null;
    }

    return data ?? null;
  }

  /**
   * Process an uploaded draft document and attach it to a category.
   * @param file - The draft document file.
   * @param category_id - The category identifier for context.
   */
  async processDraftDocument(file: File, category_id: string): Promise<void> {
    const { status, message } = await this.api.draftDocument(file, category_id);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || `Document processed successfully`, 'info');
  }

  /**
   * Retrieve all draft topics created by the current user.
   * @returns A list of drafts or an empty array on failure.
   */
  async getDrafts(): Promise<DraftView[]> {
    const { status, message, data } = await this.api.getDrafts();

    if (status === 'error') {
      api_error(message);
      return [];
    }

    return data || [];
  }

  /**
   * Retrieve a single draft by identifier.
   * @param id - The draft identifier to fetch.
   * @returns The draft payload or null on failure.
   */
  async getDraft(id: string): Promise<DraftPayload | null> {
    const { status, message, data } = await this.api.getDraft(id);

    if (status === 'error') {
      api_error(message);
      return null;
    }

    return data ?? null;
  }

  /**
   * Search draft topics using pagination.
   * @param query - The search term to apply.
   * @param page - The page number to request.
   * @param page_size - The number of results per page.
   * @returns The matching drafts or null on failure.
   */
  async searchDraft(
    query: string,
    page: number,
    page_size: number,
  ): Promise<DraftPayload[] | null> {
    const { status, message, data } = await this.api.searchDrafts(
      query,
      page,
      page_size,
    );

    if (status === 'error') {
      api_error(message);
      return null;
    }

    return data ?? null;
  }

  /**
   * Update a draft with new content.
   * @param id - The draft identifier to update.
   * @param body - The new draft payload.
   */
  async updateDraft(id: string, body: DraftPayload): Promise<void> {
    const { status, message } = await this.api.updateDraft(id, body);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || `Draft ${id} updated successfully`, 'info');
  }

  /**
   * Delete a draft topic.
   * @param id - The draft identifier to delete.
   */
  async deleteDraft(id: string): Promise<void> {
    const { status, message } = await this.api.deleteDraft(id);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || `Draft ${id} deleted successfully`, 'info');
  }

  /**
   * Fetch the section-level collection overview.
   * @param page - The page number to request.
   * @param pageSize - The number of items per page.
   * @param refresh - Whether to bypass cached data.
   * @returns A list of section collections, or an empty array on failure.
   */
  async getSectionCollection(
    page: number = 1,
    pageSize: number = 10,
    refresh: boolean = false,
  ): Promise<CollectionSection[]> {
    const { status, message, data } = await this.api.sectionCollection(
      page,
      pageSize,
      refresh,
    );

    if (status === 'error') {
      api_error(message);
      return [];
    }

    return data || [];
  }

  /**
   * Fetch the creator-level collection overview.
   * @param page - The page number to request.
   * @param pageSize - The number of items per page.
   * @param refresh - Whether to bypass cached data.
   * @returns A list of creator collections, or an empty array on failure.
   */
  async getCreatorCollection(
    page: number = 1,
    pageSize: number = 10,
    refresh: boolean = false,
  ): Promise<CollectionCreator[]> {
    const { status, message, data } = await this.api.creatorCollection(
      page,
      pageSize,
      refresh,
    );

    if (status === 'error') {
      api_error(message);
      return [];
    }

    return data || [];
  }

  /**
   * Fetch collections of categories within a section.
   * @param section_id - The section identifier.
   * @param page - The page number to request.
   * @param pageSize - The number of items per page.
   * @param refresh - Whether to bypass cached data.
   * @returns A list of collections, or an empty array on failure.
   */
  async getSectionCategoryCollection(
    section_id: string,
    page: number = 1,
    pageSize: number = 10,
    refresh: boolean = false,
  ): Promise<CollectionCategory[]> {
    const { status, message, data } = await this.api.sectionCategoryCollection(
      section_id,
      page,
      pageSize,
      refresh,
    );

    if (status === 'error') {
      api_error(message);
      return [];
    }

    return data || [];
  }

  /**
   * Fetch collections of categories for a creator.
   * @param creator_id - The creator identifier.
   * @param page - The page number to request.
   * @param pageSize - The number of items per page.
   * @param refresh - Whether to bypass cached data.
   * @returns A list of collections, or an empty array on failure.
   */
  async getCreatorCategoryCollection(
    creator_id: string,
    page: number = 1,
    pageSize: number = 10,
    refresh: boolean = false,
  ): Promise<CollectionCategory[]> {
    const { status, message, data } = await this.api.creatorCategoryCollection(
      creator_id,
      page,
      pageSize,
      refresh,
    );

    if (status === 'error') {
      api_error(message);
      return [];
    }

    return data || [];
  }

  /**
   * Fetch the topic collection for a category.
   * @param category_id - The category identifier.
   * @param page - The page number to request.
   * @param pageSize - The number of items per page.
   * @param refresh - Whether to bypass cached data.
   * @returns A list of collection topics, or an empty array on failure.
   */
  async getTopicCollection(
    category_id: string,
    page: number = 1,
    pageSize: number = 10,
    refresh: boolean = false,
  ): Promise<CollectionTopic[]> {
    const { status, message, data } = await this.api.topicCollection(
      category_id,
      page,
      pageSize,
      refresh,
    );

    if (status === 'error') {
      api_error(message);
      return [];
    }

    return data || [];
  }

  /**
   * Fetch the topic manager summary for the given topic.
   * @param topic_id - The topic identifier.
   * @returns The topic manager data or null on failure.
   */
  async getTopicManager(
    topic_id: string,
    refresh: boolean = false,
  ): Promise<TopicManager | null> {
    const { status, message, data } = await this.api.topicManager(
      topic_id,
      refresh,
    );

    if (status === 'error') {
      api_error(message);
      return null;
    }

    return data ?? null;
  }

  /**
   * Attach a topic to a category with an optional sort order.
   * @param topic_id - The topic identifier to add.
   * @param category_id - The category identifier to attach to.
   * @param sort_order - Optional sort order override.
   */
  async addTopicToCategory(
    topic_id: string,
    category_id: string,
    sort_order?: number,
  ): Promise<void> {
    const { status, message } = await this.api.addCategory(
      topic_id,
      category_id,
      sort_order,
    );

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || `Category added to topic ${topic_id}`, 'info');
  }

  /**
   * Update the sort order for a topic within a category.
   * @param topic_id - The topic identifier.
   * @param category_id - The enclosing category identifier.
   * @param sort_order - The desired position index.
   * @param options - Optional extra flags such as silent notifications.
   * @returns A success message or null on failure.
   */
  async changeSortOrderInCategory(
    topic_id: string,
    category_id: string,
    sort_order: number,
    options: { silent?: boolean } = {},
  ): Promise<string | null> {
    const response = await this.api.changeTopicSortOrder(
      topic_id,
      category_id,
      sort_order,
    );

    if (response.status === 'error') {
      api_error(response.message);
      return null;
    }

    const successMessage =
      response.message || `Category sort order changed for topic ${topic_id}`;

    if (!options.silent) {
      toastStore.show(successMessage, 'info');
    }

    return successMessage;
  }

  /**
   * Remove a topic from a category.
   * @param topic_id - The topic identifier.
   * @param category_id - The category identifier.
   */
  async removeTopicFromCategory(
    topic_id: string,
    category_id: string,
  ): Promise<void> {
    const { status, message } = await this.api.removeCategory(
      topic_id,
      category_id,
    );

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(
      message || `Category removed from topic ${topic_id}`,
      'info',
    );
  }

  /**
   * Associate a genre with a topic.
   * @param topic_id - The topic identifier.
   * @param genre_id - The genre identifier.
   */
  async addGenreToTopic(topic_id: string, genre_id: string): Promise<void> {
    const { status, message } = await this.api.addGenre(topic_id, genre_id);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || `Genre added to topic ${topic_id}`, 'info');
  }

  /**
   * Remove a genre association from a topic.
   * @param topic_id - The topic identifier.
   * @param genre_id - The genre identifier to remove.
   */
  async removeGenreFromTopic(
    topic_id: string,
    genre_id: string,
  ): Promise<void> {
    const { status, message } = await this.api.removeGenre(topic_id, genre_id);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || `Genre removed from topic ${topic_id}`, 'info');
  }

  /**
   * Attach an access gate to a topic.
   * @param topic_id - The topic identifier.
   * @param gate_id - The gate identifier to attach.
   */
  async addGateToTopic(topic_id: string, gate_id: string): Promise<void> {
    const { status, message } = await this.api.addGate(topic_id, gate_id);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || `Gate added to topic ${topic_id}`, 'info');
  }

  /**
   * Remove an access gate from a topic.
   * @param topic_id - The topic identifier.
   * @param gate_id - The gate identifier to remove.
   */
  async removeGateFromTopic(topic_id: string, gate_id: string): Promise<void> {
    const { status, message } = await this.api.removeGate(topic_id, gate_id);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || `Gate removed from topic ${topic_id}`, 'info');
  }

  /**
   * Change the display name of a topic.
   * @param topic_id - The topic identifier.
   * @param new_name - The name to apply.
   */
  async changeName(topic_id: string, new_name: string): Promise<void> {
    const { status, message } = await this.api.changeName(topic_id, new_name);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || `Topic ${topic_id} name changed`, 'info');
  }

  /**
   * Change the description of a topic.
   * @param topic_id - The topic identifier.
   * @param new_description - The description to apply.
   */
  async changeDescription(
    topic_id: string,
    new_description: string,
  ): Promise<void> {
    const { status, message } = await this.api.changeDescription(
      topic_id,
      new_description,
    );

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || `Topic ${topic_id} description changed`, 'info');
  }

  /**
   * Toggle topic availability.
   * @param topic_id - The topic identifier.
   * @param available - Whether the topic should be available.
   */
  async changeAvailability(
    topic_id: string,
    available: boolean,
  ): Promise<void> {
    const { status, message } = await this.api.changeAvailability(
      topic_id,
      available,
    );

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(
      message || `Topic ${topic_id} availability changed`,
      'info',
    );
  }

  /**
   * Change the visibility for a topic.
   * @param topic_id - The topic identifier.
   * @param visible - The desired visibility setting.
   */
  async changeVisibility(
    topic_id: string,
    visible: 'public' | 'private',
  ): Promise<void> {
    const { status, message } = await this.api.changeVisibility(
      topic_id,
      visible,
    );

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || `Topic ${topic_id} visibility changed`, 'info');
  }

  /**
   * Update the text prompt for a topic.
   * @param topic_id - The topic identifier.
   * @param prompt - The prompt text to store.
   */
  async editPrompt(topic_id: string, prompt: string): Promise<void> {
    const { status, message } = await this.api.editPrompt(topic_id, prompt);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(
      message || `Topic ${topic_id} updated successfully`,
      'info',
    );
  }

  /**
   * Update the image prompt for a topic.
   * @param topic_id - The topic identifier.
   * @param image_prompt - The image prompt text to store.
   */
  async editImagePrompt(topic_id: string, image_prompt: string): Promise<void> {
    const { status, message } = await this.api.editImagePrompt(
      topic_id,
      image_prompt,
    );

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(
      message || `Topic ${topic_id} updated successfully`,
      'info',
    );
  }

  /**
   * Update the prompt settings for a topic.
   * @param topic_id - The topic identifier.
   * @param prompt_settings - The prompt settings to store.
   */
  async editPromptSettings(
    topic_id: string,
    prompt_settings: PromptSettings,
  ): Promise<void> {
    const { status, message } = await this.api.editPromptSettings(
      topic_id,
      prompt_settings,
    );

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(
      message || `Topic ${topic_id} updated successfully`,
      'info',
    );
  }

  /**
   * Move a topic into another category.
   * @param topic_id - The topic identifier.
   * @param category_id - The target category identifier.
   */
  // async moveTopic(topic_id: string, category_id: string): Promise<void> {
  //   await this.addTopicToCategory(topic_id, category_id);
  // }

  /**
   * Move a category into a different section.
   * @param category_id - The category identifier.
   * @param section_id - The destination section identifier.
   */
  // async moveCategory(category_id: string, section_id: string): Promise<void> {
  //   // const { message, data } = await this.api.moveCategory(category_id, section_id);

  //   // if (!data) {
  //   //   api_error(message);
  //   //   return;
  //   // }

  //   toastStore.show(`Category moved to section ${section_id}`, 'info');
  // }

  /**
   * Upload a media file for a topic.
   * @param topic_id - The topic identifier.
   * @param media_type - The type of media being uploaded.
   * @param file - The file to upload.
   * @returns A list of uploaded file identifiers, or an empty array on failure.
   */
  async uploadFileForTopic(
    topic_id: string,
    media_type: MediaType,
    file: File,
  ): Promise<string[]> {
    const { status, message, data } = await this.api.uploadFile(
      topic_id,
      media_type,
      file,
    );

    if (status === 'error') {
      api_error(message);
      return [];
    }

    toastStore.show(message || `File uploaded for topic ${topic_id}`, 'info');
    return data || [];
  }

  /**
   * Delete a media file that belongs to a topic.
   * @param topic_id - The topic identifier.
   * @param file_id - The media identifier to remove.
   * @param media_type - The media type of the file.
   */
  async deleteFileFromTopic(
    topic_id: string,
    file_id: string,
    media_type: MediaType,
  ): Promise<void> {
    const { status, message } = await this.api.deleteMediaFile(
      topic_id,
      file_id,
      media_type,
    );

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || `File deleted from topic ${topic_id}`, 'info');
  }

  // /**
  //  * Demos a story prompt by its prompt ID.
  //  *
  //  * @param prompt_id - The ID of the prompt to demo.
  //  * @returns A promise that resolves when the prompt is successfully demoed.
  //  */
  // async demoPrompt(prompt_id: number): Promise<GameData | null> {
  //   const { data, error } = await this.demoStoryPrompt(prompt_id);

  //   if (!data) {
  //     if (error) {
  //       api_error(error);
  //     } else {
  //       toastStore.show('Error demoing prompt', 'error');
  //     }
  //     return null;
  //   }

  //   return data;
  // }

  // /**
  //  * Edits a prompt for a given topic.
  //  *
  //  * @param prompt - The new prompt text to be updated.
  //  * @param topic_id - The ID of the topic to which the prompt belongs.
  //  * @param prompt_id - The ID of the prompt to be edited.
  //  * @returns A promise that resolves when the prompt is successfully edited.
  //  * @throws Will show an error toast if the prompt editing fails.
  //  * @throws Will show an info toast with the success message if the prompt editing succeeds.
  //  */
  // async editPrompt(
  //   prompt: string,
  //   topic_id: number,
  //   prompt_id: number,
  // ): Promise<void> {
  //   const { data, error } = await this.editTopicPrompt(
  //     prompt,
  //     topic_id,
  //     prompt_id,
  //   );

  //   if (!data) {
  //     if (error) {
  //       api_error(error);
  //     } else {
  //       toastStore.show('Error editing prompt', 'error');
  //     }

  //     return;
  //   }

  //   toastStore.show(data.message, 'info');
  // }

  // /**
  //  * Edits the image prompt for a given topic.
  //  *
  //  * @param topic_id - The ID of the topic to edit.
  //  * @param image_prompt - The new image prompt to set for the topic.
  //  * @returns A promise that resolves when the image prompt has been edited.
  //  *
  //  * @throws Will show an error toast if the edit operation fails.
  //  * @throws Will show an info toast with the success message if the edit operation succeeds.
  //  */
  // async editImagePrompt(topic_id: number, image_prompt: string): Promise<void> {
  //   const { data, error } = await this.editTopicImagePrompt(
  //     topic_id,
  //     image_prompt,
  //   );

  //   if (!data) {
  //     if (error) {
  //       api_error(error);
  //     } else {
  //       toastStore.show('Error editing image prompt', 'error');
  //     }

  //     return;
  //   }

  //   toastStore.show(data.message, 'info');
  // }

  // /**
  //  * Changes the availability status of a prompt.
  //  *
  //  * @param {number} topic_id - The ID of the prompt to change availability for.
  //  * @param {'available' | 'unavailable'} available - The new availability status to set.
  //  * @returns {Promise<void>} A promise that resolves when the availability status has been changed.
  //  *
  //  * @throws Will show an error message if the availability change fails.
  //  */
  // async changeAvailability(
  //   topic_id: number,
  //   available: 'available' | 'unavailable',
  // ): Promise<void> {
  //   const { data, error } = await this.changePromptAvailability(
  //     topic_id,
  //     available,
  //   );

  //   if (!data) {
  //     if (error) {
  //       api_error(error);
  //     } else {
  //       toastStore.show('Error changing availability', 'error');
  //     }
  //     return;
  //   }

  //   this.clearCache();

  //   toastStore.show(data.message, 'info');
  // }

  // /**
  //  * Fetches collections from the server.
  //  *
  //  * @returns {Promise<Collection[]>} A promise that resolves to an array of collections.
  //  * If there is an error fetching the collections, it will handle the error by either
  //  * showing an API error or displaying a toast notification with an error message.
  //  */
  // async fetchCollections(): Promise<Collection[]> {
  //   const { data, error } = await this.collections();

  //   if (!data) {
  //     if (error) {
  //       api_error(error);
  //     } else {
  //       toastStore.show('Error fetching view', 'error');
  //     }
  //     return [];
  //   }

  //   const orderedCollections = data.sort((a: Collection, b: Collection) => {
  //     if (a.category_order < b.category_order) return -1;
  //     if (a.category_order > b.category_order) return 1;
  //     return 0;
  //   });

  //   return orderedCollections;
  // }
}
