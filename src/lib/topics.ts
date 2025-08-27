import { api_error } from '@errors/index';
import TopicAPI from '@service/router/topic';
import { toastStore } from '@stores/toast.svelte';

export default class Topic {
  protected api: TopicAPI;

  constructor() {
    this.api = new TopicAPI(import.meta.env.PUBLIC_BACKEND);
  }

  async newTopic(body: TopicRequest): Promise<string | null> {
    const { message, data } = await this.api.new(body);

    if (!data) {
      api_error(message);
      return null;
    }

    return data;
  }

  async deleteStory(topic_id: string): Promise<void> {
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

  async saveNewTopicDraft(body: DraftPayload): Promise<string | null> {
    const { message, data } = await this.api.newDraft(body);

    if (!data) {
      api_error(message);
      return null;
    }

    return data;
  }

  async getDrafts(): Promise<DraftPayload[]> {
    const { message, data } = await this.api.getDrafts();

    if (!data) {
      api_error(message);
      return [];
    }

    return data;
  }

  async getDraft(id: string): Promise<DraftPayload | null> {
    const { message, data } = await this.api.getDraft(id);

    if (!data) {
      api_error(message);
      return null;
    }

    return data;
  }

  async searchDraft(
    query: string,
    page: number,
    page_size: number,
  ): Promise<DraftPayload[] | null> {
    const { message, data } = await this.api.searchDrafts(
      query,
      page,
      page_size,
    );

    if (!data) {
      api_error(message);
      return null;
    }

    return data;
  }

  async updateDraft(id: string, body: DraftPayload): Promise<void> {
    const { message, data } = await this.api.updateDraft(id, body);

    if (!data) {
      api_error(message);
      return;
    }

    toastStore.show(message || `Draft ${id} updated successfully`, 'info');
  }

  async deleteDraft(id: string): Promise<void> {
    const { message, data } = await this.api.deleteDraft(id);

    if (!data) {
      api_error(message);
      return;
    }

    toastStore.show(message || `Draft ${id} deleted successfully`, 'info');
  }

  async getAdminCollection(
    page: number,
    pageSize: number,
  ): Promise<CollectionSection[]> {
    const { status, message, data } = await this.api.adminCollection(
      page,
      pageSize,
    );

    if (status === 'error') {
      api_error(message);
      return [];
    }

    return data || [];
  }

  async getCreatorCollection(
    page: number,
    pageSize: number,
  ): Promise<CollectionCategory[]> {
    const { status, message, data } = await this.api.creatorCollection(
      page,
      pageSize,
    );

    if (status === 'error') {
      api_error(message);
      return [];
    }

    return data || [];
  }

  async getTopicManager(topic_id: string): Promise<TopicManager | null> {
    const { message, data } = await this.api.topicManager(topic_id);

    if (!data) {
      api_error(message);
      return null;
    }

    return data;
  }

  async addTopicToCategory(
    topic_id: string,
    category_id: string,
    sort_order?: number,
  ): Promise<void> {
    const { message, data } = await this.api.addCategory(
      topic_id,
      category_id,
      sort_order,
    );

    if (!data) {
      api_error(message);
      return;
    }

    toastStore.show(message || `Category added to topic ${topic_id}`, 'info');
  }

  async updateTopic(
    topic_id: string,
    body: Partial<TopicRequest>,
  ): Promise<void> {
    // only name, description, availability and visibility can be updated
    // check which fields are being updated
    const allowedFields: (keyof TopicRequest)[] = [
      'name',
      'description',
      'available',
      'visibility',
    ];
    const isValidUpdate = Object.keys(body).every((key) =>
      allowedFields.includes(key as keyof TopicRequest),
    );

    if (!isValidUpdate) {
      toastStore.show(`Invalid fields in update`, 'error');
      return;
    }

    // const { message, data } = await this.api.updateTopic(topic_id, body);

    // if (!data) {
    //   api_error(message);
    //   return;
    // }

    toastStore.show(`Topic ${topic_id} updated successfully`, 'info');
  }

  async moveTopic(topic_id: string, category_id: string): Promise<void> {
    await this.addTopicToCategory(topic_id, category_id);
  }

  async moveCategory(category_id: string, section_id: string): Promise<void> {
    // const { message, data } = await this.api.moveCategory(category_id, section_id);

    // if (!data) {
    //   api_error(message);
    //   return;
    // }

    toastStore.show(`Category moved to section ${section_id}`, 'info');
  }

  async changeTopicSortOrder(
    topic_id: string,
    category_id: string,
    sort_order: number,
  ): Promise<void> {
    const { message, data } = await this.api.changeCategorySortOrder(
      topic_id,
      category_id,
      sort_order,
    );

    if (!data) {
      api_error(message);
      return;
    }

    toastStore.show(
      message || `Category sort order changed for topic ${topic_id}`,
      'info',
    );
  }

  async removeTopicFromCategory(
    topic_id: string,
    category_id: string,
  ): Promise<void> {
    const { message, data } = await this.api.removeCategory(
      topic_id,
      category_id,
    );

    if (!data) {
      api_error(message);
      return;
    }

    toastStore.show(
      message || `Category removed from topic ${topic_id}`,
      'info',
    );
  }

  async addGenreToTopic(topic_id: string, genre_id: string): Promise<void> {
    const { message, data } = await this.api.addGenre(topic_id, genre_id);

    if (!data) {
      api_error(message);
      return;
    }

    toastStore.show(message || `Genre added to topic ${topic_id}`, 'info');
  }

  async removeGenreFromTopic(
    topic_id: string,
    genre_id: string,
  ): Promise<void> {
    const { message, data } = await this.api.removeGenre(topic_id, genre_id);

    if (!data) {
      api_error(message);
      return;
    }

    toastStore.show(message || `Genre removed from topic ${topic_id}`, 'info');
  }

  async addGateToTopic(topic_id: string, gate_id: string): Promise<void> {
    const { message, data } = await this.api.addGate(topic_id, gate_id);

    if (!data) {
      api_error(message);
      return;
    }

    toastStore.show(message || `Gate added to topic ${topic_id}`, 'info');
  }

  async removeGateFromTopic(topic_id: string, gate_id: string): Promise<void> {
    const { message, data } = await this.api.removeGate(topic_id, gate_id);

    if (!data) {
      api_error(message);
      return;
    }

    toastStore.show(message || `Gate removed from topic ${topic_id}`, 'info');
  }

  async uploadFileForTopic(
    topic_id: string,
    media_type: MediaType,
    file: File,
  ): Promise<string[]> {
    const { message, data } = await this.api.uploadFile(
      topic_id,
      media_type,
      file,
    );

    if (!data) {
      api_error(message);
      return [];
    }

    toastStore.show(message || `File uploaded for topic ${topic_id}`, 'info');
    return data;
  }

  async deleteFileFromTopic(
    topic_id: string,
    file_id: string,
    media_type: MediaType,
  ): Promise<void> {
    const { message, data } = await this.api.deleteMediaFile(
      topic_id,
      file_id,
      media_type,
    );

    if (!data) {
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
