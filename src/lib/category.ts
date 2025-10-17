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

  async updateAdminCategoryName(
    category_id: string,
    name: string,
  ): Promise<void> {
    const { status, message } = await this.api.updateAdminCategoryName(
      category_id,
      name,
    );

    if (status == 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Category updated successfully', 'info');
  }

  async updateAdminCategoryDescription(
    category_id: string,
    description: string,
  ): Promise<void> {
    const { status, message } = await this.api.updateAdminCategoryDescription(
      category_id,
      description,
    );

    if (status == 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Category updated successfully', 'info');
  }

  async updateAdminCategoryOrder(
    category_id: string,
    dashboard_sort_order: number,
    options: { silent?: boolean } = {},
  ): Promise<string | null> {
    const response = await this.api.updateAdminCategoryOrder(
      category_id,
      dashboard_sort_order,
    );

    if (response.status === 'error') {
      api_error(response.message);
      return null;
    }

    const successMessage = response.message || 'Category updated successfully';

    if (!options.silent) {
      toastStore.show(successMessage, 'info');
    }

    return successMessage;
  }

  async updateCreatorCategoryName(
    category_id: string,
    name: string,
  ): Promise<void> {
    const { status, message } = await this.api.updateCreatorCategoryName(
      category_id,
      name,
    );

    if (status == 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Category updated successfully', 'info');
  }

  async updateCreatorCategoryDescription(
    category_id: string,
    description: string,
  ): Promise<void> {
    const { status, message } = await this.api.updateCreatorCategoryDescription(
      category_id,
      description,
    );

    if (status == 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Category updated successfully', 'info');
  }

  async updateCreatorCategoryOrder(
    category_id: string,
    dashboard_sort_order: number,
    options: { silent?: boolean } = {},
  ): Promise<string | null> {
    const response = await this.api.updateCreatorCategoryOrder(
      category_id,
      dashboard_sort_order,
    );

    if (response.status === 'error') {
      api_error(response.message);
      return null;
    }

    const successMessage = response.message || 'Category updated successfully';

    if (!options.silent) {
      toastStore.show(successMessage, 'info');
    }

    return successMessage;
  }
}
