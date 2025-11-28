import { api_error } from '@errors/index';
import CategoryAPI from '@service/category';
import { toastStore } from '@stores/toast.svelte';

/**
 * Wraps Category API calls with convenience methods and user feedback.
 */
export default class CategoryView {
  protected api: CategoryAPI;

  /**
   * Initialize the category service with the configured backend endpoint.
   */
  constructor() {
    this.api = new CategoryAPI(import.meta.env.PUBLIC_BACKEND);
  }

  /**
   * Create a new category managed by the tenant admin.
   * @param section_id - The identifier of the section to add the category to.
   * @param data - The category payload to create.
   */
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

  /**
   * Retrieve all admin-managed categories within a section.
   * @param section_id - The identifier of the section whose categories to list.
   * @returns A list of categories or an empty array on error.
   */
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

  /**
   * Create a new creator-owned category.
   * @param data - The category payload to create.
   */
  async createCreatorCategory(data: Category): Promise<void> {
    const { status, message } = await this.api.createCreatorCategory(data);

    if (status == 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Category created successfully', 'info');
  }

  /**
   * Retrieve all categories owned by the current creator.
   * @returns A list of categories or an empty array on error.
   */
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

  /**
   * Update the name of an admin-managed category.
   * @param category_id - The identifier of the category to update.
   * @param name - The new name to assign.
   */
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

  /**
   * Update the description of an admin-managed category.
   * @param category_id - The identifier of the category to update.
   * @param description - The new description to assign.
   */
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

  /**
   * Update the dashboard sort order of an admin-managed category.
   * @param category_id - The identifier of the category to update.
   * @param dashboard_sort_order - The new sort order index.
   * @param options - Optional control flags (e.g., silent mode).
   * @returns A success message when available, otherwise null.
   */
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

  /**
   * Update the name of a creator-owned category.
   * @param category_id - The identifier of the category to update.
   * @param name - The new name to assign.
   */
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

  /**
   * Update the description of a creator-owned category.
   * @param category_id - The identifier of the category to update.
   * @param description - The new description to assign.
   */
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

  /**
   * Update the dashboard sort order of a creator-owned category.
   * @param category_id - The identifier of the category to update.
   * @param dashboard_sort_order - The new sort order index.
   * @param options - Optional control flags (e.g., silent mode).
   * @returns A success message when available, otherwise null.
   */
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
