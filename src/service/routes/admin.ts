import Fetcher from '@service/fetcher';

export default class AdminAPI extends Fetcher {
  async collections() {
    return this.request<Collection[]>('/admin/collections');
  }

  async categories() {
    return this.request<Category[]>('/admin/categories');
  }

  async topics() {
    return this.request<CollectionTopic[]>('/admin/topics');
  }

  async generatePrompt(prompt: TestPromptRequest) {
    return this.request<{ full: string; short: string; image_prompt: string }>(
      '/admin/generate-prompt',
      {
        method: 'POST',
        body: JSON.stringify(prompt),
      },
    );
  }

  async createNewPrompt(prompt: CreatePrompt) {
    return this.request<{ topic_id: string; prompt_id: string }>(
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
    return this.request<APISTDResposne>('/admin/create-new-section', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async editSection(section: Section) {
    return this.request<APISTDResposne>('/admin/edit-section', {
      method: 'POST',
      body: JSON.stringify(section),
    });
  }

  async createNewCategory(category: Category) {
    return this.request<{ category: Category }>('/admin/create-new-category', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  async editCategory(category: Category) {
    return this.request<{ category: Category }>('/admin/edit-category', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  async changeTopicCategorySection(topic: Topic) {
    return this.request<{ topic: Topic }>(
      '/admin/change-topic-category-section',
      {
        method: 'POST',
        body: JSON.stringify(topic),
      },
    );
  }

  async changeTopicsName(topic: Topic) {
    return this.request<{ topic: Topic }>('/admin/change-topics-name', {
      method: 'POST',
      body: JSON.stringify(topic),
    });
  }

  async changeTopicsOrder(topic: Topic) {
    return this.request<{ topic: Topic }>('/admin/change-topics-order', {
      method: 'POST',
      body: JSON.stringify(topic),
    });
  }

  async changeTopicsCategory(topic: Topic) {
    return this.request<{ topic: Topic }>('/admin/change-topics-category', {
      method: 'POST',
      body: JSON.stringify(topic),
    });
  }

  async changeTopicsDescription(topic: Topic) {
    return this.request<{ topic: Topic }>('/admin/change-topics-description', {
      method: 'POST',
      body: JSON.stringify(topic),
    });
  }

  async addTopicGenre(topic: Topic) {
    return this.request<{ topic: Topic }>('/admin/add-topic-genre', {
      method: 'GET',
      body: JSON.stringify(topic),
    });
  }

  async removeTopicGenre(topic: Topic) {
    return this.request<{ topic: Topic }>('/admin/remove-topic-genre', {
      method: 'POST',
      body: JSON.stringify(topic),
    });
  }
}
