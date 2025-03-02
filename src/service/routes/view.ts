import Fetcher from '@service/fetcher';

export default class ViewAPI extends Fetcher {
  async sections() {
    return this.request<Section[]>('/view/sections');
  }

  async sectionCategories(section: string) {
    return this.request<SectionCategory[]>(
      `/view/section-categories/${section}`,
    );
  }

  async searchSectionByTopic(section: string, topic: string) {
    return this.request<SectionCategory[]>(
      `/view/topics/search/${section}?name=${topic}`,
    );
  }

  async genres() {
    return this.request<Genre[]>('/view/genres');
  }

  async genreTopics(genre: string, section: string) {
    return this.request<SectionCategory[]>(
      `/view/genre-topics/${section}?name=${genre}`,
    );
  }
}
