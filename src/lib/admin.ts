import { api_error } from '@errors/index';
import AdminAPI from '@service/admin';
import { toastStore } from '@stores/toast.svelte';

/**
 * Encapsulates admin-level operations that interact with the v2 Admin API.
 */
class AdminApp {
  protected api: AdminAPI;

  /**
   * Initializes the admin service wrapper with the configured API client.
   */
  constructor() {
    this.api = new AdminAPI(import.meta.env.PUBLIC_BACKEND);
  }

  /**
   * Retrieve a paginated list of tenant accounts.
   * @param page - The page number to request.
   * @param page_size - The number of results to include per page.
   * @returns The matched accounts and total count, or null on error.
   */
  async listAccounts(
    page: number,
    page_size: number,
  ): Promise<{ users: Partial<User>[]; count: number } | null> {
    const { status, message, data } = await this.api.listAccounts(
      page,
      page_size,
    );

    if (status === 'error') {
      api_error(message);
      return null;
    }

    if (!data) {
      return null;
    }

    return { users: data.accounts, count: data.count };
  }

  /**
   * Fetch the roles available to the current tenant.
   * @returns The list of roles, or an empty array on failure.
   */
  async fetchRoles(refresh: boolean = false): Promise<TenantRole[]> {
    const { status, message, data } = await this.api.getRoles(refresh);

    if (status === 'error') {
      api_error(message);
      return [];
    }

    return data || [];
  }

  /**
   * Update the role assigned to a user account.
   * @param account_id - The identifier of the account to update.
   * @param new_role - The name of the role to assign.
   */
  async changeUserRole(account_id: string, new_role: string): Promise<void> {
    const { status, message } = await this.api.changeRole(account_id, new_role);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'User role updated successfully', 'info');
  }

  /**
   * Disable a user account to prevent further access.
   * @param account_id - The identifier of the account to disable.
   */
  async disableUserAccount(account_id: string): Promise<void> {
    const { status, message } = await this.api.disableAccount(account_id);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'User account disabled successfully', 'info');
  }

  /**
   * Create a new section for organizing topics.
   * @param name - The display name of the section.
   * @param description - Optional section description.
   */
  async createNewSection(
    name: string,
    description: string = '',
  ): Promise<void> {
    const { status, message } = await this.api.createSection({
      name,
      description,
    });

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Section created successfully', 'info');
  }

  // async deleteSection(sectionId: string): Promise<void> {
  //   const { status, message } = await this.api.deleteSection(sectionId);

  //   if (status === 'error') {
  //     api_error(message);
  //     return;
  //   }

  //   toastStore.show(message || 'Section deleted successfully', 'info');
  // }

  /**
   * Create a new genre that topics can be categorized under.
   * @param name - The name of the genre.
   * @param description - Optional genre description.
   */
  async createNewGenre(name: string, description: string = ''): Promise<void> {
    const { status, message } = await this.api.createGenre({
      name,
      description,
    });

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Genre created successfully', 'info');
  }

  /**
   * Remove a genre from the catalog.
   * @param genreId - The identifier of the genre to delete.
   */
  async deleteGenre(genreId: string): Promise<void> {
    const { status, message } = await this.api.deleteGenre(genreId);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Genre deleted successfully', 'info');
  }

  /**
   * Fetch the number of accounts that satisfy the provided filter.
   * @param body - The filtering options to send to the API.
   * @returns The matching account count.
   */
  async fetchAccountCount(body: AccountMetricFilter): Promise<number> {
    const { status, message, data } = await this.api.accountCount(body);

    if (status === 'error') {
      api_error(message);
      return 0;
    }

    return this.#metricNumber(message, data);
  }

  /**
   * Fetch the number of wallets that satisfy the provided filter.
   * @param body - The wallet filter to apply.
   * @returns The matching wallet count.
   */
  async fetchWalletCount(body: WalletMetricFilter): Promise<number> {
    const { status, message, data } = await this.api.walletCount(body);

    if (status === 'error') {
      api_error(message);
      return 0;
    }

    return this.#metricNumber(message, data);
  }

  /**
   * Fetch the number of topics that satisfy the provided filter.
   * @param body - The topic filter to apply.
   * @returns The matching topic count.
   */
  async fetchTopicCount(body: TopicMetricFilter): Promise<number> {
    const { status, message, data } = await this.api.topicCount(body);

    if (status === 'error') {
      api_error(message);
      return 0;
    }

    return this.#metricNumber(message, data);
  }

  /**
   * Fetch the number of stories that satisfy the provided filter.
   * @param body - The story filter to apply.
   * @returns The matching story count.
   */
  async fetchStoryCount(body: StoryMetricFilter): Promise<number> {
    const { status, message, data } = await this.api.storyCount(body);

    if (status === 'error') {
      api_error(message);
      return 0;
    }

    return this.#metricNumber(message, data);
  }

  /**
   * Retrieve account growth metrics for the provided filter.
   * @param body - The account metric filter to apply.
   * @returns The account growth value or zero when unavailable.
   */
  async fetchAccountGrowth(body: AccountMetricFilter): Promise<number> {
    const { status, message, data } = await this.api.accountGrowth(body);

    if (status === 'error') {
      api_error(message);
      return 0;
    }

    return this.#metricNumber(message, data);
  }

  /**
   * Retrieve wallet growth metrics for the provided filter.
   * @param body - The wallet metric filter to apply.
   * @returns The wallet growth value or zero when unavailable.
   */
  async fetchWalletGrowth(body: WalletMetricFilter): Promise<number> {
    const { status, message, data } = await this.api.walletGrowth(body);

    if (status === 'error') {
      api_error(message);
      return 0;
    }

    return this.#metricNumber(message, data);
  }

  /**
   * Retrieve topic growth metrics for the provided filter.
   * @param body - The topic metric filter to apply.
   * @returns The topic growth value or zero when unavailable.
   */
  async fetchTopicGrowth(body: TopicMetricFilter): Promise<number> {
    const { status, message, data } = await this.api.topicGrowth(body);

    if (status === 'error') {
      api_error(message);
      return 0;
    }

    return this.#metricNumber(message, data);
  }

  /**
   * Retrieve story growth metrics for the provided filter.
   * @param body - The story metric filter to apply.
   * @returns The story growth value or zero when unavailable.
   */
  async fetchStoryGrowth(body: StoryMetricFilter): Promise<number> {
    const { status, message, data } = await this.api.storyGrowth(body);

    if (status === 'error') {
      api_error(message);
      return 0;
    }

    return this.#metricNumber(message, data);
  }

  /**
   * Fetch the top-performing accounts by the chosen metric.
   * @param body - The ranking configuration to send.
   * @returns The ranked accounts, or an empty list on failure.
   */
  async fetchTopAccounts(body: TopNMetricFilter): Promise<TopNMetricResult> {
    const { status, message, data } = await this.api.accountTopN(body);

    if (status === 'error') {
      api_error(message);
      return [];
    }

    return data || [];
  }

  /**
   * Fetch the top-performing topics by the chosen metric.
   * @param body - The ranking configuration to send.
   * @returns The ranked topics, or an empty list on failure.
   */
  async fetchTopTopics(body: TopNMetricFilter): Promise<TopNMetricResult> {
    const { status, message, data } = await this.api.topicTopN(body);

    if (status === 'error') {
      api_error(message);
      return [];
    }

    return data || [];
  }

  /* HELPER */

  /**
   * Normalize a numeric response, emitting an error toast if the value is missing.
   * @param message - The API message returned with the response.
   * @param data - The numeric value to validate.
   * @returns The numeric value or zero when missing.
   */
  #metricNumber(message: string, data: number | undefined): number {
    if (data === undefined) {
      api_error(message);
      return 0;
    }
    return data;
  }
}

export default AdminApp;
