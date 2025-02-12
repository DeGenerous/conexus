import Fetcher from '@service/fetcher';

export default class ViewAPI extends Fetcher {
  async sections() {
    return this.request<{ sections: Section[] }>('/view/sections');
  }

  async sectionCategories(section: string) {
    return this.request<{ categories: SectionCategory[] }>(
      `/view/section-categories/${section}`,
    );
  }

  async topicByName(name: string) {
    return this.request<{ topic: SectionTopic }>(`/view/topic/${name}`);
  }

  async searchSectionByTopic(section: string, topic: string) {
    return this.request<{ category: SectionCategory }>(
      `/view/topics/section/${section}/${topic}`,
    );
  }

  async genres() {
    return this.request<{ genres: Genre[] }>('/view/genres');
  }

  async genreTopics(genre: string) {
    return this.request<{ topics: SectionCategory[] }>(
      `/view/genre-topics/${genre}`,
    );
  }
}
