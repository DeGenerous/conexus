import Fetcher from '@service/fetcher';

export default class ViewAPI extends Fetcher {
  async sections() {
    return this.request<Section[]>('/view/sections');
  }

  async sectionCategories(section: string) {
    return this.request<CategoryInSection[]>(
      `/view/section-categories/${section}`,
    );
  }

  async searchSectionByTopic(section: string, topic: string) {
    return this.request<CategoryInSection[]>(
      `/view/topics/search/${section}?name=${topic}`,
    );
  }

  async genres() {
    return this.request<Genre[]>('/view/genres');
  }

  async genreTopics(genre: string, section: string) {
    return this.request<CategoryInSection[]>(
      `/view/genre-topics/${section}?name=${genre}`,
    );
  }

  async getTopicNFTGates(topic_id: number) {
    return this.request<TopicNFTGate[]>(`/view/get-topic-gates/${topic_id}`);
  }

  async getClassGates() {
    return this.request<ClassGate[]>('/view/get-class-gates');
  }

  async getGateClass(class_ID: number) {
    return this.request<ClassGate>(`/view/get-class-gate/${class_ID}`);
  }
}
