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
}
