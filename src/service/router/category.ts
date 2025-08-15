import Fetcher from '../fetcher';

export default class CategoryAPI extends Fetcher {
  protected group: string = '/category';

  async createAdminCategory(section_id: string, data: Category) {
    return await this.request(`${this.group}/admin/${section_id}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async listAdminCategories(section_id: string) {
    return this.request<Category[]>(`${this.group}/admin/${section_id}`);
  }

  async updateAdminCategory(category_id: string, data: Category) {
    return await this.request(`${this.group}/admin/${category_id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async createCreatorCategory(data: Category) {
    return await this.request(`${this.group}/creator`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async listCreatorCategories() {
    return await this.request<Category[]>(`${this.group}/creator`);
  }

  async updateCreatorCategory(category_id: string, data: Category) {
    return await this.request(`${this.group}/creator/${category_id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}
