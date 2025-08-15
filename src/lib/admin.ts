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
  ): Promise<{ user: Partial<User>[]; count: number } | null> {
    const { status, message, data } = await this.api.listAccounts(
      page,
      page_size,
    );

    switch (status) {
      case 'error':
        toastStore.show(message, 'error');
        return null;
      case 'success':
        if (!data) {
          toastStore.show('No accounts found', 'info');
          return null;
        }

        return { user: data.accounts, count: data.count };
      default:
        toastStore.show('Unknown error occurred', 'error');
        return null;
    }
  }

  async changeUserRole(account_id: string, new_role: string): Promise<void> {
    const { status, message } = await this.api.changeRole(account_id, new_role);

    switch (status) {
      case 'error':
        toastStore.show(message, 'error');
        break;
      case 'success':
        toastStore.show(message || 'User role updated successfully', 'info');
        break;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }
  }

  async disableUserAccount(account_id: string): Promise<void> {
    const { status, message } = await this.api.disableAccount(account_id);

    switch (status) {
      case 'error':
        toastStore.show(message, 'error');
        break;
      case 'success':
        toastStore.show(
          message || 'User account disabled successfully',
          'info',
        );
        break;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }
  }

  async createNewSection(name: string, description: string): Promise<void> {
    const { status, message } = await this.api.createSection({
      name,
      description,
    });

    switch (status) {
      case 'error':
        toastStore.show(message, 'error');
        break;
      case 'success':
        toastStore.show(message || 'Section created successfully', 'info');
        break;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }
  }

  async deleteSection(sectionId: string): Promise<void> {
    const { status, message } = await this.api.deleteSection(sectionId);

    switch (status) {
      case 'error':
        toastStore.show(message, 'error');
        break;
      case 'success':
        toastStore.show(message || 'Section deleted successfully', 'info');
        break;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }
  }

  async createNewGenre(name: string, description: string): Promise<void> {
    const { status, message } = await this.api.createGenre({
      name,
      description,
    });

    switch (status) {
      case 'error':
        toastStore.show(message, 'error');
        break;
      case 'success':
        toastStore.show(message || 'Genre created successfully', 'info');
        break;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }
  }

  async deleteGenre(genreId: string): Promise<void> {
    const { status, message } = await this.api.deleteGenre(genreId);

    switch (status) {
      case 'error':
        toastStore.show(message, 'error');
        break;
      case 'success':
        toastStore.show(message || 'Genre deleted successfully', 'info');
        break;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }
  }

  async createNewContract(body: Contract): Promise<void> {
    const { status, message } = await this.api.createContract(body);

    switch (status) {
      case 'error':
        toastStore.show(message, 'error');
        break;
      case 'success':
        toastStore.show(message || 'Contract created successfully', 'info');
        break;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }
  }

  async deleteContract(contractId: string): Promise<void> {
    const { status, message } = await this.api.deleteContract(contractId);

    switch (status) {
      case 'error':
        toastStore.show(message, 'error');
        break;
      case 'success':
        toastStore.show(message || 'Contract deleted successfully', 'info');
        break;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }
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

    switch (status) {
      case 'error':
        toastStore.show(message, 'error');
        break;
      case 'success':
        toastStore.show(message || 'Token gate created successfully', 'info');
        break;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }
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

    switch (status) {
      case 'error':
        toastStore.show(message, 'error');
        break;
      case 'success':
        toastStore.show(message || 'Class gate created successfully', 'info');
        break;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }
  }

  async deleteGate(gateId: string): Promise<void> {
    const { status, message } = await this.api.deleteGate(gateId);

    switch (status) {
      case 'error':
        toastStore.show(message, 'error');
        break;
      case 'success':
        toastStore.show(message || 'Gate deleted successfully', 'info');
        break;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }
  }

  async getGate(gateId: string): Promise<Gate | null> {
    const { status, message, data } = await this.api.getGate(gateId);

    switch (status) {
      case 'error':
        toastStore.show(message, 'error');
        break;
      case 'success':
        if (!data) {
          toastStore.show('Gate not found', 'error');
          return null;
        }

        return data;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }

    return null;
  }

  async getAllGates(): Promise<Gate[]> {
    const { status, message, data } = await this.api.getGates();

    switch (status) {
      case 'error':
        toastStore.show(message, 'error');
        return [];
      case 'success':
        return data || [];
      default:
        toastStore.show('Unknown error occurred', 'error');
    }

    return [];
  }

  async fetchAccountCount(body: AccountMetricFilter): Promise<number> {
    const { status, message, data } = await this.api.accountCount(body);

    switch (status) {
      case 'error':
        toastStore.show(message, 'error');
        return 0;
      case 'success':
        return data || 0;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }

    return 0;
  }

  async fetchWalletCount(body: WalletMetricFilter): Promise<number> {
    const { status, message, data } = await this.api.walletCount(body);

    switch (status) {
      case 'error':
        toastStore.show(message, 'error');
        return 0;
      case 'success':
        return data || 0;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }

    return 0;
  }

  async fetchTopicCount(body: TopicMetricFilter): Promise<number> {
    const { status, message, data } = await this.api.topicCount(body);

    switch (status) {
      case 'error':
        toastStore.show(message, 'error');
        return 0;
      case 'success':
        return data || 0;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }

    return 0;
  }

  async fetchStoryCount(body: StoryMetricFilter): Promise<number> {
    const { status, message, data } = await this.api.storyCount(body);

    switch (status) {
      case 'error':
        toastStore.show(message, 'error');
        return 0;
      case 'success':
        return data || 0;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }

    return 0;
  }

  async fetchAccountGrowth(body: AccountMetricFilter): Promise<number> {
    const { status, message, data } = await this.api.accountGrowth(body);

    switch (status) {
      case 'error':
        toastStore.show(message, 'error');
        return 0;
      case 'success':
        return data || 0;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }

    return 0;
  }

  async fetchWalletGrowth(body: WalletMetricFilter): Promise<number> {
    const { status, message, data } = await this.api.walletGrowth(body);

    switch (status) {
      case 'error':
        toastStore.show(message, 'error');
        return 0;
      case 'success':
        return data || 0;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }

    return 0;
  }

  async fetchTopicGrowth(body: TopicMetricFilter): Promise<number> {
    const { status, message, data } = await this.api.topicGrowth(body);

    switch (status) {
      case 'error':
        toastStore.show(message, 'error');
        return 0;
      case 'success':
        return data || 0;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }

    return 0;
  }

  async fetchStoryGrowth(body: StoryMetricFilter): Promise<number> {
    const { status, message, data } = await this.api.storyGrowth(body);

    switch (status) {
      case 'error':
        toastStore.show(message, 'error');
        return 0;
      case 'success':
        return data || 0;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }

    return 0;
  }

  async fetchTopAccounts(body: TopNMetricFilter): Promise<number> {
    const { status, message, data } = await this.api.accountTopN(body);

    switch (status) {
      case 'error':
        toastStore.show(message, 'error');
        return 0;
      case 'success':
        return data || 0;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }

    return 0;
  }

  async fetchTopTopics(body: TopNMetricFilter): Promise<number> {
    const { status, message, data } = await this.api.topicTopN(body);

    switch (status) {
      case 'error':
        toastStore.show(message, 'error');
        return 0;
      case 'success':
        return data || 0;
      default:
        toastStore.show('Unknown error occurred', 'error');
    }

    return 0;
  }

  // /**
  //  * Fetches collections from the server.
  //  *
  //  * @returns {Promise<Collection[]>} A promise that resolves to an array of collections.
  //  * If there is an error fetching the collections, it will handle the error by either
  //  * showing an API error or displaying a toast notification with an error message.
  //  */
  // async fetchCollections(): Promise<Collection[]> {
  //   const { data, error } = await this.collections();

  //   if (!data) {
  //     if (error) {
  //       api_error(error);
  //     } else {
  //       toastStore.show('Error fetching view', 'error');
  //     }
  //     return [];
  //   }

  //   const orderedCollections = data.sort((a: Collection, b: Collection) => {
  //     if (a.category_order < b.category_order) return -1;
  //     if (a.category_order > b.category_order) return 1;
  //     return 0;
  //   });

  //   return orderedCollections;
  // }
}

export default AdminApp;
