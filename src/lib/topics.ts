import { api_error } from '@errors/index';
import Account from '@lib/account';
import TopicAPI from '@service/router/topic';
import openModal from '@stores/modal.svelte';
import { toastStore } from '@stores/toast.svelte';

export class CreatorTopic {
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

  async changeCategorySortOrder(
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
  ): Promise<void> {
    const { message, data } = await this.api.uploadFile(
      topic_id,
      media_type,
      file,
    );

    if (!data) {
      api_error(message);
      return;
    }

    toastStore.show(message || `File uploaded for topic ${topic_id}`, 'info');
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
  //  * Fetches the list of categories.
  //  *
  //  * This method asynchronously retrieves the categories by calling the `categories` method.
  //  * If the data is successfully fetched, it returns an array of `CategoryView` objects.
  //  * If there is an error during the fetch, it handles the error by either calling `api_error`
  //  * with the error message or showing a toast notification with an error message.
  //  *
  //  * @returns {Promise<CategoryView[]>} A promise that resolves to an array of `CategoryView` objects.
  //  */
  // async fetchCategories(): Promise<CategoryView[]> {
  //   const cached = GetCache<CategoryView[]>(CATEGORIES_KEY);
  //   if (cached) {
  //     return cached;
  //   }

  //   const { data, error } = await this.categories();

  //   if (!data) {
  //     if (error) {
  //       api_error(error);
  //     } else {
  //       toastStore.show('Error fetching view', 'error');
  //     }
  //     return [];
  //   }

  //   SetCache(CATEGORIES_KEY, data, TTL_DAY);

  //   return data;
  // }

  // /**
  //  * Fetches a topic by its name.
  //  *
  //  * @param topic_name - The name of the topic to fetch.
  //  * @returns A promise that resolves to a `ViewTopic` object if the topic is found, or `null` if not.
  //  * @throws Will call `api_error` if there is an error fetching the topic.
  //  */
  // async fetchTopic(topic_name: string): Promise<ViewTopic | null> {
  //   const { data, error } = await this.topic(topic_name);

  //   if (!data) {
  //     if (error) {
  //       api_error(error);
  //     }
  //     return null;
  //   }

  //   return data;
  // }

  // /**
  //  * Creates a new story based on the provided prompt.
  //  *
  //  * @param {CreatePrompt} prompt - The prompt data used to create the new story.
  //  * @returns {Promise<void>} A promise that resolves when the story creation process is complete.
  //  *
  //  * @throws Will show an error toast if the story creation fails.
  //  */
  // async createNewStory(prompt: CreatePrompt): Promise<void> {
  //   const { data, error } = await this.createNewPrompt(prompt);

  //   if (!data) {
  //     if (error) {
  //       api_error(error);
  //     }
  //     toastStore.show('Error creating new story', 'error');
  //   }

  //   toastStore.show(`${prompt.topic} story created`, 'info');

  //   return;
  // }

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
  //  * Deletes a topic by its ID.
  //  *
  //  * @param {number} topic_id - The ID of the topic which will be removed.
  //  * @returns {Promise<void>} A promise that resolves when the topic is removed.
  //  *
  //  * @throws Will show an error message if the topic could not be removed.
  //  */
  // async deleteStory(topic_id: number): Promise<void> {
  //   const { data, error } = await this.deleteTopic(topic_id);

  //   if (!data) {
  //     if (error) {
  //       api_error(error);
  //     } else {
  //       toastStore.show('Error deleting story', 'error');
  //     }
  //     return;
  //   }

  //   this.clearCache();

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
  //  * Creates a new section with the given name.
  //  *
  //  * @param name - The name of the new section to be created.
  //  * @returns A promise that resolves to the ID of the newly created section.
  //  *          If an error occurs, it returns -1.
  //  */
  // async newSection(name: string): Promise<number> {
  //   const { data, error } = await this.createNewSection(name);

  //   if (!data) {
  //     if (error) {
  //       api_error(error);
  //     } else {
  //       toastStore.show('Error creating new section', 'error');
  //     }
  //     return -1;
  //   }

  //   return data;
  // }

  // // async editSection(section: Section) {
  // //   const { data, error } = await this.editSectionData(section);

  // //   if (!data) {
  // //     if (error) {
  // //       api_error(error);
  // //     }
  // //     return [];
  // //   }

  // //   return data;
  // // }

  // /**
  //  * Creates a new category with the given name.
  //  *
  //  * @param name - The name of the new category.
  //  * @returns A promise that resolves to the ID of the newly created category.
  //  *          If an error occurs, it returns -1.
  //  */
  // async newCategory(name: string): Promise<number> {
  //   const { data, error } = await this.createNewCategory(name);

  //   if (!data) {
  //     if (error) {
  //       api_error(error);
  //     } else {
  //       toastStore.show('Error creating new category', 'error');
  //     }
  //     return -1;
  //   }

  //   ClearCache(CATEGORIES_KEY);

  //   toastStore.show(`Created new category - ID: ${data}`, 'info');

  //   return data;
  // }

  // // async editCategory(category: Category) {
  // //   const { data, error } = await this.editCategoryData(category);

  // //   if (!data) {
  // //     if (error) {
  // //       api_error(error);
  // //     }
  // //     return [];
  // //   }

  // //   return data;
  // // }

  // /**
  //  * Changes the section a category belongs to for a given section and category.
  //  *
  //  * @param section_id - The ID of the section to change.
  //  * @param category_id - The ID of the category to change to.
  //  * @returns A promise that resolves to void.
  //  *
  //  * @throws Will show an error toast if the operation fails.
  //  * @throws Will show an info toast with the success message if the operation succeeds.
  //  */
  // async changeCategorySection(
  //   section_id: number,
  //   category_id: number,
  // ): Promise<void> {
  //   const { data, error } = await this.changeTopicCategorySection(
  //     section_id,
  //     category_id,
  //   );

  //   if (!data) {
  //     if (error) {
  //       api_error(error);
  //     } else {
  //       toastStore.show('Error changing category section', 'error');
  //     }
  //     return;
  //   }

  //   this.clearCache();

  //   toastStore.show(data.message, 'info');
  // }

  // /**
  //  * Change category order in section.
  //  *
  //  * @param category_id - The ID of the category to change order.
  //  * @param order - The new order value for the category.
  //  * @returns A promise that resolves to void.
  //  *
  //  * @throws Will show an error toast if the operation fails.
  //  * @throws Will show an info toast with the success message if the operation succeeds.
  //  */
  // async changeSectionCategoryOrder(
  //   category_id: number,
  //   order: number,
  //   showToast: boolean = true,
  // ): Promise<void> {
  //   const { data, error } = await this.changeCategoryOrder(category_id, order);

  //   if (!data) {
  //     if (error) {
  //       api_error(error);
  //     } else {
  //       toastStore.show('Error changing category order', 'error');
  //     }
  //     return;
  //   }

  //   this.clearCache();

  //   if (showToast) toastStore.show(data.message, 'info');
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

export class AdminTopic extends CreatorTopic {
  protected api: TopicAPI;

  constructor() {
    super();
    this.api = new TopicAPI(import.meta.env.PUBLIC_BACKEND);
  }

  // Additional methods specific to admin topics can be added here.
}
