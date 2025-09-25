import { api_error } from '@errors/index';
import CategoryAPI from '@service/v2/category';
import { toastStore } from '@stores/toast.svelte';

export default class CategoryView {
  protected api: CategoryAPI;

  constructor() {
    this.api = new CategoryAPI(import.meta.env.PUBLIC_BACKEND);
  }

  async createAdminCategory(section_id: string, data: Category): Promise<void> {
    const { status, message } = await this.api.createAdminCategory(
      section_id,
      data,
    );

    if (status == 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Category created successfully', 'info');
  }

  async listAdminCategories(section_id: string): Promise<Category[]> {
    const {
      status,
      message,
      data: categories,
    } = await this.api.listAdminCategories(section_id);

    if (status === 'error') {
      api_error(message);
      return [];
    }

    return categories || [];
  }

  async updateAdminCategory(
    category_id: string,
    data: Category,
  ): Promise<void> {
    const { status, message } = await this.api.updateAdminCategory(
      category_id,
      data,
    );

    if (status == 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Category updated successfully', 'info');
  }

  async createCreatorCategory(data: Category): Promise<void> {
    const { status, message } = await this.api.createCreatorCategory(data);

    if (status == 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Category created successfully', 'info');
  }

  async listCreatorCategories(): Promise<Category[]> {
    const {
      status,
      message,
      data: categories,
    } = await this.api.listCreatorCategories();

    if (status === 'error') {
      api_error(message);
      return [];
    }

    return categories || [];
  }

  async updateCreatorCategory(
    category_id: string,
    data: Category,
  ): Promise<void> {
    const { status, message } = await this.api.updateCreatorCategory(
      category_id,
      data,
    );

    if (status == 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Category updated successfully', 'info');
  }
}
