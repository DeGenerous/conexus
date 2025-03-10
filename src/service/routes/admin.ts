import Fetcher from '@service/fetcher';

export default class AdminAPI extends Fetcher {
  async collections() {
    return this.request<Collection[]>('/admin/collections');
  }

  async categories() {
    return this.request<CategoryView[]>('/admin/categories');
  }

  async topic(name: string) {
    return this.request<ViewTopic>(`/admin/topic/${name}`);
  }

  async createNewPrompt(prompt: CreatePrompt) {
    return this.request<number>(
      '/admin/create-new-prompt',
      {
        method: 'POST',
        body: JSON.stringify(prompt),
      },
    );
  }

  async editTopicPrompt(prompt: string, topic_id: number, prompt_id: number) {
    return this.request<APISTDResposne>('/admin/edit-topic-prompt', {
      method: 'POST',
      body: JSON.stringify({ prompt, topic_id, prompt_id }),
    });
  }

  async editTopicImagePrompt(topic_id: string, image_prompt: string) {
    return this.request<APISTDResposne>('/admin/edit-topic-image-prompt', {
      method: 'POST',
      body: JSON.stringify({ topic_id, image_prompt }),
    });
  }

  async deleteTopicPrompt(id: string) {
    return this.request<APISTDResposne>(`/admin/delete-topic-prompt/${id}`, {
      method: 'DELETE',
    });
  }

  async changePromptAvailability(prompt_id: number, available: string) {
    return this.request<APISTDResposne>('/admin/change-prompt-availability', {
      method: 'PUT',
      body: JSON.stringify({ prompt_id, available }),
    });
  }

  async createNewSection(name: string) {
    return this.request<number>('/admin/create-new-section', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  // async editSectionData(section: Section) {
  //   return this.request<APISTDResposne>('/admin/edit-section', {
  //     method: 'POST',
  //     body: JSON.stringify(section),
  //   });
  // }

  async createNewCategory(name: string) {
    return this.request<number>('/admin/create-new-category', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  // async editCategoryData(category: Category) {
  //   return this.request<{ category: Category }>('/admin/edit-category', {
  //     method: 'POST',
  //     body: JSON.stringify(category),
  //   });
  // }

  async changeTopicCategorySection(section_id: number, category_id: number) {
    return this.request<APISTDResposne>(
      '/admin/change-topic-category-section',
      {
        method: 'POST',
        body: JSON.stringify({ section_id, category_id }),
      },
    );
  }

  async changeTopicsName(old_name: string, new_name: string) {
    return this.request<APISTDResposne>('/admin/change-topics-name', {
      method: 'POST',
      body: JSON.stringify({ old_name, new_name }),
    });
  }

  async changeTopicsOrder(topic_id: number, order: number) {
    return this.request<APISTDResposne>('/admin/change-topics-order', {
      method: 'POST',
      body: JSON.stringify({ topic_id, order }),
    });
  }

  async changeTopicsCategory(topic_id: number, category_id: number) {
    return this.request<APISTDResposne>('/admin/change-topics-category', {
      method: 'POST',
      body: JSON.stringify({ topic_id, category_id }),
    });
  }

  async changeTopicsDescription(topic_id: number, description: string) {
    return this.request<APISTDResposne>('/admin/change-topics-description', {
      method: 'POST',
      body: JSON.stringify({ topic_id, description }),
    });
  }

  async addTopicGenre(topic_id: number, genre_id: number) {
    return this.request<APISTDResposne>('/admin/add-topic-genre', {
      method: 'PATCH',
      body: JSON.stringify({ topic_id, genre_id }),
    });
  }

  async removeTopicGenre(topic_id: number, genre_id: number) {
    return this.request<APISTDResposne>('/admin/remove-topic-genre', {
      method: 'PATCH',
      body: JSON.stringify({ topic_id, genre_id }),
    });
  }
}
