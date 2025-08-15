import { api_error } from '@errors/index';
import AdminAPI from '@service/router/admin';
import { toastStore } from '@stores/toast.svelte';

class AdminApp {
  protected api: AdminAPI;

  constructor() {
    this.api = new AdminAPI(import.meta.env.PUBLIC_BACKEND);
  }

  async listAccounts(
    page: number,
    page_size: number,
  ): Promise<{ users: Partial<User>[]; count: number } | null> {
    const { message, data } = await this.api.listAccounts(page, page_size);

    if (!data) {
      api_error(message);
      return null;
    }

    return { users: data.accounts, count: data.count };
  }

  async changeUserRole(account_id: string, new_role: string): Promise<void> {
    const { status, message } = await this.api.changeRole(account_id, new_role);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'User role updated successfully', 'info');
  }

  async disableUserAccount(account_id: string): Promise<void> {
    const { status, message } = await this.api.disableAccount(account_id);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'User account disabled successfully', 'info');
  }

  async createNewSection(name: string, description: string): Promise<void> {
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

  async createNewGenre(name: string, description: string): Promise<void> {
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

  async deleteGenre(genreId: string): Promise<void> {
    const { status, message } = await this.api.deleteGenre(genreId);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Genre deleted successfully', 'info');
  }

  async createNewContract(body: Contract): Promise<void> {
    const { status, message } = await this.api.createContract(body);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Contract created successfully', 'info');
  }

  async deleteContract(contractId: string): Promise<void> {
    const { status, message } = await this.api.deleteContract(contractId);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Contract deleted successfully', 'info');
  }

  async createNewTokenGate(
    name: string,
    contract_id: string,
    min_amount: number,
  ): Promise<void> {
    const tokenGate: Gate = {
      name: name,
      contract_id: contract_id,
      min_amount: min_amount,
      type: 'token',
    };
    const { status, message } = await this.api.createGate(tokenGate);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Token gate created successfully', 'info');
  }

  async createNewClassGate(
    contract_id: string,
    class_name: string,
    token_id_min: number,
    token_id_max: number,
  ): Promise<void> {
    const classGate: Gate = {
      name: class_name,
      contract_id: contract_id,
      class_name: class_name,
      token_id_min: token_id_min,
      token_id_max: token_id_max,
      type: 'class',
    };

    const { status, message } = await this.api.createGate(classGate);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Class gate created successfully', 'info');
  }

  async deleteGate(gateId: string): Promise<void> {
    const { status, message } = await this.api.deleteGate(gateId);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Gate deleted successfully', 'info');
  }

  async getGate(gateId: string): Promise<Gate | null> {
    const { message, data } = await this.api.getGate(gateId);

    if (!data) {
      api_error(message);
      return null;
    }

    return data;
  }

  async getAllGates(): Promise<Gate[]> {
    const { message, data } = await this.api.getGates();

    if (!data) {
      api_error(message);
      return [];
    }

    return data || [];
  }

  async fetchAccountCount(body: AccountMetricFilter): Promise<number> {
    const { message, data } = await this.api.accountCount(body);

    return this.#metricNumber(message, data);
  }

  async fetchWalletCount(body: WalletMetricFilter): Promise<number> {
    const { message, data } = await this.api.walletCount(body);

    return this.#metricNumber(message, data);
  }

  async fetchTopicCount(body: TopicMetricFilter): Promise<number> {
    const { message, data } = await this.api.topicCount(body);

    return this.#metricNumber(message, data);
  }

  async fetchStoryCount(body: StoryMetricFilter): Promise<number> {
    const { message, data } = await this.api.storyCount(body);

    return this.#metricNumber(message, data);
  }

  async fetchAccountGrowth(body: AccountMetricFilter): Promise<number> {
    const { message, data } = await this.api.accountGrowth(body);

    return this.#metricNumber(message, data);
  }

  async fetchWalletGrowth(body: WalletMetricFilter): Promise<number> {
    const { message, data } = await this.api.walletGrowth(body);

    return this.#metricNumber(message, data);
  }

  async fetchTopicGrowth(body: TopicMetricFilter): Promise<number> {
    const { message, data } = await this.api.topicGrowth(body);

    return this.#metricNumber(message, data);
  }

  async fetchStoryGrowth(body: StoryMetricFilter): Promise<number> {
    const { message, data } = await this.api.storyGrowth(body);

    return this.#metricNumber(message, data);
  }

  async fetchTopAccounts(body: TopNMetricFilter): Promise<number> {
    const { message, data } = await this.api.accountTopN(body);

    return this.#metricNumber(message, data);
  }

  async fetchTopTopics(body: TopNMetricFilter): Promise<number> {
    const { message, data } = await this.api.topicTopN(body);

    return this.#metricNumber(message, data);
  }

  /* HELPER */

  #metricNumber(message: string, data: number | undefined): number {
    if (!data) {
      api_error(message);
      return 0;
    }
    return data;
  }
}

export default AdminApp;
