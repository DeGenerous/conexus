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
    return this.request<number>('/admin/create-new-prompt', {
      method: 'POST',
      body: JSON.stringify(prompt),
    });
  }

  async demoStoryPrompt(prompt_id: number) {
    return this.request<GameData>('/admin/demo-story-prompt', {
      method: 'POST',
      body: JSON.stringify({ prompt_id }),
    });
  }

  async editTopicPrompt(prompt: string, topic_id: number, prompt_id: number) {
    return this.request<APISTDResposne>('/admin/edit-topic-prompt', {
      method: 'PATCH',
      body: JSON.stringify({ prompt, topic_id, prompt_id }),
    });
  }

  async editTopicImagePrompt(topic_id: number, image_prompt: string) {
    return this.request<APISTDResposne>('/admin/edit-topic-image-prompt', {
      method: 'PATCH',
      body: JSON.stringify({ topic_id, image_prompt }),
    });
  }

  async changePromptAvailability(prompt_id: number, availability: string) {
    return this.request<APISTDResposne>('/admin/change-prompt-availability', {
      method: 'PATCH',
      body: JSON.stringify({ prompt_id, availability }),
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
  //     method: 'PATCH',
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
  //     method: 'PATCH',
  //     body: JSON.stringify(category),
  //   });
  // }

  async changeTopicCategorySection(section_id: number, category_id: number) {
    return this.request<APISTDResposne>(
      '/admin/change-topic-category-section',
      {
        method: 'PATCH',
        body: JSON.stringify({ section_id, category_id }),
      },
    );
  }

  async changeCategoryOrder(category_id: number, order: number) {
    return this.request<APISTDResposne>('/admin/change-category-order', {
      method: 'PATCH',
      body: JSON.stringify({ category_id, order }),
    });
  }

  async changeTopicsName(old_name: string, new_name: string) {
    return this.request<APISTDResposne>('/admin/change-topics-name', {
      method: 'PATCH',
      body: JSON.stringify({ old_name, new_name }),
    });
  }

  async changeTopicsOrder(topic_id: number, order: number) {
    return this.request<APISTDResposne>('/admin/change-topics-order', {
      method: 'PATCH',
      body: JSON.stringify({ topic_id, order }),
    });
  }

  async changeTopicsCategory(topic_id: number, category_id: number) {
    return this.request<APISTDResposne>('/admin/change-topics-category', {
      method: 'PATCH',
      body: JSON.stringify({ topic_id, category_id }),
    });
  }

  async changeTopicsDescription(topic_id: number, description: string) {
    return this.request<APISTDResposne>('/admin/change-topics-description', {
      method: 'PATCH',
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

  async deleteTopic(topic_id: number) {
    return this.request<APISTDResposne>(`/admin/delete-topic`, {
      method: 'DELETE',
      body: JSON.stringify({ topic_id }),
    });
  }

  async gateTopicWithNFT(
    topic_id: number,
    contract_name: SupportedContracts,
    token_ids?: number[],
  ) {
    return this.request<APISTDResposne>('/admin/gate-topic', {
      method: 'POST',
      body: JSON.stringify({ topic_id, contract_name, token_ids }),
    });
  }
  async removeTopicNFTGate(topic_id: number, contract_names: SupportedContracts[], token_ids?: number[]) {
    return this.request<APISTDResposne>('/admin/remove-topic-gate', {
      method: 'POST',
      body: JSON.stringify({ topic_id, contract_names, token_ids }),
    });
  }
  
  async getTopicNFTGates(topic_id: number) {
    return this.request<TopicNFTGate[]>(`/view/get-topic-gates/${topic_id}`);
  }
}
