import Fetcher from '@service/fetcher';

export default class ViewAPI extends Fetcher {
  async sections() {
    return this.request<Section[]>('/view/sections');
  }

  async genres() {
    return this.request<Genre[]>('/view/genres');
  }

  async sectionCategories(section: string, page: number, pageSize: number) {
    return this.request<CategoryInSection[]>(
      `/view/section-categories/${section}?page=${page}&limit=${pageSize}`,
    );
  }

  async categoryTopics(category_id: number, page: number, pageSize: number) {
    return this.request<TopicInCategory[]>(
      `/view/category-topics/${category_id}?page=${page}&limit=${pageSize}`,
    );
  }

  async searchSectionByTopic(
    section: string,
    topic: string,
    page: number = 1,
    pageSize: number = 5,
    sort_order: TopicSortOrder = 'name',
  ) {
    return this.request<TopicInCategory[]>(
      `/view/topics/search/${section}/${topic}?page=${page}&limit=${pageSize}&sort_order=${sort_order}`,
    );
  }

  async genreTopics(
    section: string,
    genre: string,
    page: number = 1,
    pageSize: number = 5,
    sort_order: TopicSortOrder = 'name',
  ) {
    return this.request<TopicInCategory[]>(
      `/view/genre-topics/${section}/${genre}?page=${page}&limit=${pageSize}&sort_order=${sort_order}`,
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
