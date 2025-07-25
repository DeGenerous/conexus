import {
  GetCache,
  SetCache,
  ClearCache,
  CATEGORIES_KEY,
  TTL_DAY,
} from '@constants/cache';
import { api_error } from '@errors/index';
import { AdminAPI } from '@service/routes';
import { toastStore } from '@stores/toast.svelte';

class AdminApp extends AdminAPI {
  // Constructor
  constructor() {
    super(import.meta.env.PUBLIC_BACKEND);
  }

  /**
   * Fetches collections from the server.
   *
   * @returns {Promise<Collection[]>} A promise that resolves to an array of collections.
   * If there is an error fetching the collections, it will handle the error by either
   * showing an API error or displaying a toast notification with an error message.
   */
  async fetchCollections(): Promise<Collection[]> {
    const { data, error } = await this.collections();

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error fetching view', 'error');
      }
      return [];
    }

    const orderedCollections = data.sort((a: Collection, b: Collection) => {
      if (a.category_order < b.category_order) return -1;
      if (a.category_order > b.category_order) return 1;
      return 0;
    });

    return orderedCollections;
  }

  /**
   * Fetches the list of categories.
   *
   * This method asynchronously retrieves the categories by calling the `categories` method.
   * If the data is successfully fetched, it returns an array of `CategoryView` objects.
   * If there is an error during the fetch, it handles the error by either calling `api_error`
   * with the error message or showing a toast notification with an error message.
   *
   * @returns {Promise<CategoryView[]>} A promise that resolves to an array of `CategoryView` objects.
   */
  async fetchCategories(): Promise<CategoryView[]> {
    const cached = GetCache<CategoryView[]>(CATEGORIES_KEY);
    if (cached) {
      return cached;
    }

    const { data, error } = await this.categories();

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error fetching view', 'error');
      }
      return [];
    }

    SetCache(CATEGORIES_KEY, data, TTL_DAY);

    return data;
  }

  /**
   * Fetches a topic by its name.
   *
   * @param topic_name - The name of the topic to fetch.
   * @returns A promise that resolves to a `ViewTopic` object if the topic is found, or `null` if not.
   * @throws Will call `api_error` if there is an error fetching the topic.
   */
  async fetchTopic(topic_name: string): Promise<ViewTopic | null> {
    const { data, error } = await this.topic(topic_name);

    if (!data) {
      if (error) {
        api_error(error);
      }
      return null;
    }

    return data;
  }

  /**
   * Creates a new story based on the provided prompt.
   *
   * @param {CreatePrompt} prompt - The prompt data used to create the new story.
   * @returns {Promise<void>} A promise that resolves when the story creation process is complete.
   *
   * @throws Will show an error toast if the story creation fails.
   */
  async createNewStory(prompt: CreatePrompt): Promise<void> {
    const { data, error } = await this.createNewPrompt(prompt);

    if (!data) {
      if (error) {
        api_error(error);
      }
      toastStore.show('Error creating new story', 'error');
    }

    toastStore.show(`${prompt.topic} story created`, 'info');

    return;
  }

  /**
   * Demos a story prompt by its prompt ID.
   *
   * @param prompt_id - The ID of the prompt to demo.
   * @returns A promise that resolves when the prompt is successfully demoed.
   */
  async demoPrompt(prompt_id: number): Promise<GameData | null> {
    const { data, error } = await this.demoStoryPrompt(prompt_id);

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error demoing prompt', 'error');
      }
      return null;
    }

    return data;
  }

  /**
   * Edits a prompt for a given topic.
   *
   * @param prompt - The new prompt text to be updated.
   * @param topic_id - The ID of the topic to which the prompt belongs.
   * @param prompt_id - The ID of the prompt to be edited.
   * @returns A promise that resolves when the prompt is successfully edited.
   * @throws Will show an error toast if the prompt editing fails.
   * @throws Will show an info toast with the success message if the prompt editing succeeds.
   */
  async editPrompt(
    prompt: string,
    topic_id: number,
    prompt_id: number,
  ): Promise<void> {
    const { data, error } = await this.editTopicPrompt(
      prompt,
      topic_id,
      prompt_id,
    );

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error editing prompt', 'error');
      }

      return;
    }

    toastStore.show(data.message, 'info');
  }

  /**
   * Edits the image prompt for a given topic.
   *
   * @param topic_id - The ID of the topic to edit.
   * @param image_prompt - The new image prompt to set for the topic.
   * @returns A promise that resolves when the image prompt has been edited.
   *
   * @throws Will show an error toast if the edit operation fails.
   * @throws Will show an info toast with the success message if the edit operation succeeds.
   */
  async editImagePrompt(topic_id: number, image_prompt: string): Promise<void> {
    const { data, error } = await this.editTopicImagePrompt(
      topic_id,
      image_prompt,
    );

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error editing image prompt', 'error');
      }

      return;
    }

    toastStore.show(data.message, 'info');
  }

  /**
   * Deletes a topic by its ID.
   *
   * @param {number} topic_id - The ID of the topic which will be removed.
   * @returns {Promise<void>} A promise that resolves when the topic is removed.
   *
   * @throws Will show an error message if the topic could not be removed.
   */
  async deleteStory(topic_id: number): Promise<void> {
    const { data, error } = await this.deleteTopic(topic_id);

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error deleting story', 'error');
      }
      return;
    }

    this.clearCache();

    toastStore.show(data.message, 'info');
  }

  /**
   * Changes the availability status of a prompt.
   *
   * @param {number} topic_id - The ID of the prompt to change availability for.
   * @param {'available' | 'unavailable'} available - The new availability status to set.
   * @returns {Promise<void>} A promise that resolves when the availability status has been changed.
   *
   * @throws Will show an error message if the availability change fails.
   */
  async changeAvailability(
    topic_id: number,
    available: 'available' | 'unavailable',
  ): Promise<void> {
    const { data, error } = await this.changePromptAvailability(
      topic_id,
      available,
    );

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error changing availability', 'error');
      }
      return;
    }

    this.clearCache();

    toastStore.show(data.message, 'info');
  }

  /**
   * Creates a new section with the given name.
   *
   * @param name - The name of the new section to be created.
   * @returns A promise that resolves to the ID of the newly created section.
   *          If an error occurs, it returns -1.
   */
  async newSection(name: string): Promise<number> {
    const { data, error } = await this.createNewSection(name);

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error creating new section', 'error');
      }
      return -1;
    }

    return data;
  }

  // async editSection(section: Section) {
  //   const { data, error } = await this.editSectionData(section);

  //   if (!data) {
  //     if (error) {
  //       api_error(error);
  //     }
  //     return [];
  //   }

  //   return data;
  // }

  /**
   * Creates a new category with the given name.
   *
   * @param name - The name of the new category.
   * @returns A promise that resolves to the ID of the newly created category.
   *          If an error occurs, it returns -1.
   */
  async newCategory(name: string): Promise<number> {
    const { data, error } = await this.createNewCategory(name);

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error creating new category', 'error');
      }
      return -1;
    }

    ClearCache(CATEGORIES_KEY);

    toastStore.show(`Created new category - ID: ${data}`, 'info');

    return data;
  }

  // async editCategory(category: Category) {
  //   const { data, error } = await this.editCategoryData(category);

  //   if (!data) {
  //     if (error) {
  //       api_error(error);
  //     }
  //     return [];
  //   }

  //   return data;
  // }

  /**
   * Changes the section a category belongs to for a given section and category.
   *
   * @param section_id - The ID of the section to change.
   * @param category_id - The ID of the category to change to.
   * @returns A promise that resolves to void.
   *
   * @throws Will show an error toast if the operation fails.
   * @throws Will show an info toast with the success message if the operation succeeds.
   */
  async changeCategorySection(
    section_id: number,
    category_id: number,
  ): Promise<void> {
    const { data, error } = await this.changeTopicCategorySection(
      section_id,
      category_id,
    );

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error changing category section', 'error');
      }
      return;
    }

    this.clearCache();

    toastStore.show(data.message, 'info');
  }

  /**
   * Change category order in section.
   *
   * @param category_id - The ID of the category to change order.
   * @param order - The new order value for the category.
   * @returns A promise that resolves to void.
   *
   * @throws Will show an error toast if the operation fails.
   * @throws Will show an info toast with the success message if the operation succeeds.
   */
  async changeSectionCategoryOrder(
    category_id: number,
    order: number,
    showToast: boolean = true,
  ): Promise<void> {
    const { data, error } = await this.changeCategoryOrder(category_id, order);

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error changing category order', 'error');
      }
      return;
    }

    this.clearCache();

    if (showToast) toastStore.show(data.message, 'info');
  }

  /**
   * Edits the name of a topic.
   *
   * @param old_name - The current name of the topic.
   * @param new_name - The new name to assign to the topic.
   * @returns A promise that resolves when the topic name has been changed.
   *
   * @throws Will show an error message if the topic name change fails.
   */
  async editTopicName(old_name: string, new_name: string): Promise<void> {
    const { data, error } = await this.changeTopicsName(old_name, new_name);

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error changing topic name', 'error');
      }
      return;
    }

    this.clearCache();

    toastStore.show(data.message, 'info');
  }

  /**
   * Edits the order of a topic.
   *
   * This function changes the order of a topic by calling the `changeTopicsOrder` method
   * with the provided `topic_id` and `order`. If the operation is successful, it displays
   * a success message using `toastStore.show`. If there is an error, it handles the error
   * by either calling `api_error` with the error message or displaying a generic error message.
   *
   * @param {number} topic_id - The ID of the topic to be reordered.
   * @param {number} order - The new order value for the topic.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  async editTopicOrder(
    topic_id: number,
    order: number,
    showToast: boolean = true,
  ): Promise<void> {
    const { data, error } = await this.changeTopicsOrder(topic_id, order);

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error changing topic order', 'error');
      }
      return;
    }

    this.clearCache();

    if (showToast) toastStore.show(data.message, 'info');
  }

  /**
   * Edits the category of a given topic by its ID.
   *
   * @param topic_id - The ID of the topic to be edited.
   * @param category_id - The ID of the new category to assign to the topic.
   * @returns A promise that resolves to void.
   *
   * @throws Will show an error message if the category change fails.
   */
  async editTopicCategory(
    topic_id: number,
    category_id: number,
    showToast: boolean = true,
  ): Promise<void> {
    const { data, error } = await this.changeTopicsCategory(
      topic_id,
      category_id,
    );

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error changing topic category', 'error');
      }
      return;
    }

    this.clearCache();

    if (showToast) toastStore.show(data.message, 'info');
  }

  /**
   * Edits the description of a topic.
   *
   * @param {number} topic_id - The ID of the topic to edit.
   * @param {string} description - The new description for the topic.
   * @returns {Promise<void>} A promise that resolves when the description has been edited.
   *
   * @throws Will show an error toast if there is an error changing the topic description.
   */
  async editTopicDescription(
    topic_id: number,
    description: string,
  ): Promise<void> {
    const { data, error } = await this.changeTopicsDescription(
      topic_id,
      description,
    );

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error changing topic description', 'error');
      }
      return;
    }

    this.clearCache();

    toastStore.show(data.message, 'info');
  }

  /**
   * Adds a genre to a topic by their respective IDs.
   *
   * @param topic_id - The ID of the topic to which the genre will be added.
   * @param genre_id - The ID of the genre to be added to the topic.
   * @returns A promise that resolves to void.
   *
   * @throws Will show an error toast if the genre could not be added.
   * @throws Will show an info toast with a success message if the genre was added successfully.
   */
  async addGenre(topic_id: number, genre_id: number): Promise<void> {
    const { data, error } = await this.addTopicGenre(topic_id, genre_id);

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error adding genre', 'error');
      }
      return;
    }

    this.clearCache();

    toastStore.show(data.message, 'info');
  }

  /**
   * Removes a genre from a topic.
   *
   * @param {number} topic_id - The ID of the topic from which the genre will be removed.
   * @param {number} genre_id - The ID of the genre to be removed.
   * @returns {Promise<void>} A promise that resolves when the genre is removed.
   *
   * @throws Will show an error message if the genre could not be removed.
   */
  async removeGenre(topic_id: number, genre_id: number): Promise<void> {
    const { data, error } = await this.removeTopicGenre(topic_id, genre_id);

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error removing genre', 'error');
      }
      return;
    }

    this.clearCache();

    toastStore.show(data.message, 'info');
  }

  /**
   * Gate a topic by its ID with an NFT.
   *
   * @param topic_id - The ID of the topic to remove the gate from.
   * @param contract_name - The name of the contracts to remove the gate from.
   * @param token_id - The ID of the tokens to remove the gate from.
   * @returns A promise that resolves to void.
   */
  async gateTopic(gate_obj: TopicNFTGate): Promise<void> {
    const { data, error } = await this.gateTopicWithNFT(
      gate_obj.topic_id,
      gate_obj.contract_name,
      gate_obj.class_id,
      gate_obj.token_ids,
    );

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error gating topic', 'error');
      }
      return;
    }

    this.clearCache();

    toastStore.show(data.message, 'info');
  }

  /**
   * Removes the NFT gate from a topic.
   *
   * @param topic_id - The ID of the topic to remove the gate from.
   * @param contract_name - The name of the contracts to remove the gate from.
   * @param token_id - The ID of the tokens to remove the gate from.
   * @returns A promise that resolves to void.
   */
  async removeTopicGate(
    topic_id: number,
    contract_name: SupportedContracts,
    token_ids?: number[],
  ): Promise<void> {
    const contract_names = [contract_name];

    const { data, error } = await this.removeTopicNFTGate(
      topic_id,
      contract_names,
      token_ids,
    );
    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error removing topic gate', 'error');
      }
      return;
    }
    this.clearCache();
    toastStore.show(data.message, 'info');
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

  async createNewClassGate(
    name: string,
    start_token_id: number,
    end_token_id: number,
  ) {
    const { data, error } = await this.createClassGate(
      name,
      start_token_id,
      end_token_id,
    );

    if (!data) {
      if (error) {
        api_error(error);
      }
      return;
    }

    this.clearCache();

    toastStore.show(data.message, 'info');
  }

  async deleteClassGate(class_ID: number): Promise<void> {
    const { data, error } = await this.deleteClassGater(class_ID);
    if (!data) {
      if (error) {
        api_error(error);
      }
      return;
    }
    this.clearCache();
    toastStore.show(data.message, 'info');
  }

  private clearCache() {
    ClearCache('view');
  }
}

export default AdminApp;
