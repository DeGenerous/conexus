import Fetcher from './fetcher';

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

  async createCreatorCategory(data: Category) {
    return await this.request(`${this.group}/creator`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async listCreatorCategories() {
    return await this.request<Category[]>(`${this.group}/creator`);
  }

  async deleteAdminCategory(category_id: string) {
    return await this.request(`${this.group}/admin/${category_id}`, {
      method: 'DELETE',
    });
  }

  async deleteCreatorCategory(category_id: string) {
    return await this.request(`${this.group}/creator/${category_id}`, {
      method: 'DELETE',
    });
  }

  async updateAdminCategoryName(category_id: string, name: string) {
    return await this.request(`${this.group}/admin/${category_id}/name`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  }

  async updateAdminCategoryDescription(
    category_id: string,
    description: string,
  ) {
    return await this.request(
      `${this.group}/admin/${category_id}/description`,
      {
        method: 'PUT',
        body: JSON.stringify({ description }),
      },
    );
  }

  async updateAdminCategoryOrder(
    category_id: string,
    dashboard_sort_order: number,
  ) {
    return await this.request(`${this.group}/admin/${category_id}/order`, {
      method: 'PUT',
      body: JSON.stringify({ dashboard_sort_order }),
    });
  }

  async updateCreatorCategoryName(category_id: string, name: string) {
    return await this.request(`${this.group}/creator/${category_id}/name`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  }

  async updateCreatorCategoryDescription(
    category_id: string,
    description: string,
  ) {
    return await this.request(
      `${this.group}/creator/${category_id}/description`,
      {
        method: 'PUT',
        body: JSON.stringify({ description }),
      },
    );
  }

  async updateCreatorCategoryOrder(
    category_id: string,
    dashboard_sort_order: number,
  ) {
    return await this.request(`${this.group}/creator/${category_id}/order`, {
      method: 'PUT',
      body: JSON.stringify({ dashboard_sort_order }),
    });
  }
}
