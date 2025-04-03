import Fetcher from '@service/fetcher';

export default class ViewAPI extends Fetcher {
  async sections() {
    return this.request<Section[]>('/view/sections');
  }

  async sectionCategories(section: string, page: number, pageSize: number) {
    return this.request<CategoriesInSection[]>(
      `/view/section-categories/${section}?page=${page}&limit=${pageSize}`,
    );
  }

  async categoryTopics(category_id: number, page: number, pageSize: number) {
    return this.request<TopicInCategory[]>(
      `/view/category-topics/${category_id}?page=${page}&limit=${pageSize}`,
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
    return this.request<ClassGate>(`/view/get-gate-class/${class_ID}`);
  }
}
