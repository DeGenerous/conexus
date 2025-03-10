import { api_error } from '@errors/index';
import { AdminAPI } from '@service/routes';
import { toastStore } from '@stores/toast';

export class AdminApp extends AdminAPI {
  // Constructor
  constructor() {
    super(import.meta.env.PUBLIC_BACKEND);
  }

  // Fetch the view
  async fetchCategoriesSections(): Promise<Section[]> {
    const { data, error } = await this.categories();

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error fetching view', 'error');
      }
      return [];
    }

    return data;
  }

  async fetchCategories(): Promise<CategoryView[]> {
    const { data, error } = await this.categories();

    if (!data) {
      if (error) {
        api_error(error);
      } else {
        toastStore.show('Error fetching view', 'error');
      }
      return [];
    }

    return data;
  }

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

  async createNewStory(prompt: CreatePrompt) {
    const { data, error } = await this.createNewPrompt(prompt);

    if (!data) {
      if (error) {
        api_error(error);
      }
      return [];
    }

    return data;
  }

  async editPrompt(prompt: string, topic_id: number, prompt_id: number) {
    const { data, error } = await this.editTopicPrompt(
      prompt,
      topic_id,
      prompt_id,
    );

    if (!data) {
      if (error) {
        api_error(error);
      }
      return [];
    }

    return data;
  }

  async editImagePrompt(topic_id: string, image_prompt: string) {
    const { data, error } = await this.editTopicImagePrompt(
      topic_id,
      image_prompt,
    );

    if (!data) {
      if (error) {
        api_error(error);
      }
      return [];
    }

    return data;
  }

  async deletePrompt(id: string) {
    const { data, error } = await this.deleteTopicPrompt(id);

    if (!data) {
      if (error) {
        api_error(error);
      }
      return [];
    }

    return data;
  }

  async changeAvailability(prompt_id: number, available: string) {
    const { data, error } = await this.changePromptAvailability(
      prompt_id,
      available,
    );

    if (!data) {
      if (error) {
        api_error(error);
      }
      return [];
    }

    return data;
  }

  async newSection(name: string) {
    const { data, error } = await this.createNewSection(name);

    if (!data) {
      if (error) {
        api_error(error);
      }
      return [];
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

  async newCategory(category: Category) {
    const { data, error } = await this.createNewCategory(category);

    if (!data) {
      if (error) {
        api_error(error);
      }
      return [];
    }

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

  async changeCategorySection(topic: Topic) {
    const { data, error } = await this.changeTopicCategorySection(topic);

    if (!data) {
      if (error) {
        api_error(error);
      }
      return [];
    }

    return data;
  }

  async editTopicName(old_name: string, new_name: string) {
    const { data, error } = await this.changeTopicsName(old_name, new_name);

    if (!data) {
      if (error) {
        api_error(error);
      }
      return [];
    }

    return data;
  }

  async editTopicOrder(topic_id: number, order: number) {
    const { data, error } = await this.changeTopicsOrder(topic_id, order);

    if (!data) {
      if (error) {
        api_error(error);
      }
      return [];
    }

    return data;
  }

  async editTopicCategory(topic_id: number, category_id: number) {
    const { data, error } = await this.changeTopicsCategory(topic_id, category_id);

    if (!data) {
      if (error) {
        api_error(error);
      }
      return [];
    }

    return data;
  }

  async editTopicDescription(topic: Topic) {
    const { data, error } = await this.changeTopicsDescription(topic);

    if (!data) {
      if (error) {
        api_error(error);
      }
      return [];
    }

    return data;
  }

  async addGenre(topic_id: number, genre_id: number) {
    const { data, error } = await this.addTopicGenre(topic_id, genre_id);

    if (!data) {
      if (error) {
        api_error(error);
      }
      return [];
    }

    return data;
  }

  async removeGenre(topic_id: number, genre_id: number) {
    const { data, error } = await this.removeTopicGenre(topic_id, genre_id);

    if (!data) {
      if (error) {
        api_error(error);
      }
      return [];
    }

    return data;
  }
}
