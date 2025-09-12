import { api_error } from '@errors/index';
import CollectionAPI from '@service/v2/collection';
import { toastStore } from '@stores/toast.svelte';

class Collection {
  protected api: CollectionAPI;

  constructor() {
    this.api = new CollectionAPI(import.meta.env.PUBLIC_BACKEND);
  }

  async createERC20Collection(
    request: CreateERC20CollectionRequest,
  ): Promise<void> {
    const { status, message } = await this.api.createERC20Collection(request);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Collection created successfully', 'info');
  }

  async createERC721Collection(
    request: CreateERC721CollectionRequest,
  ): Promise<void> {
    const { status, message } = await this.api.createERC721Collection(request);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Collection created successfully', 'info');
  }

  async listCollections(): Promise<Partial<CollectionResponse>[]> {
    const { status, message, data } = await this.api.listCollections();

    if (status === 'error') {
      api_error(message);
      return [];
    }

    return data || [];
  }

  async getCollection(
    collection_id: string,
  ): Promise<CollectionResponse | null> {
    const { status, message, data } =
      await this.api.getCollection(collection_id);

    if (status === 'error') {
      api_error(message);
      return null;
    }

    return data || null;
  }

  async updateCollection(
    collection_id: string,
    request: UpdateCollectionRequest,
  ): Promise<void> {
    const { status, message } = await this.api.updateCollection(
      collection_id,
      request,
    );

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Collection updated successfully', 'info');
  }

  async deleteCollection(collection_id: string): Promise<boolean> {
    const { status, message } = await this.api.deleteCollection(collection_id);

    if (status === 'error') {
      api_error(message);
      return false;
    }

    return true;
  }

  async createERC20TokenGate(request: GateERC20Request): Promise<void> {
    const { status, message, data } =
      await this.api.createERC20TokenGate(request);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Gate created successfully', 'info');
  }

  async createERC721NFTGate(request: GateERC721NFTRequest): Promise<void> {
    const { status, message, data } =
      await this.api.createERC721NFTGate(request);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Gate created successfully', 'info');
  }

  async createERC721ClassGate(request: GateERC721ClassRequest): Promise<void> {
    const { status, message, data } =
      await this.api.createERC721ClassGate(request);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Gate created successfully', 'info');
  }

  async listGates(collection_id: string): Promise<Partial<GateResponse>[]> {
    const { status, message, data } = await this.api.listGates(collection_id);

    if (status === 'error') {
      api_error(message);
      return [];
    }

    return data || [];
  }

  async getGate(gate_id: string): Promise<GateResponse | null> {
    const { status, message, data } = await this.api.getGate(gate_id);

    if (status === 'error') {
      api_error(message);
      return null;
    }

    return data || null;
  }

  async deleteGate(gate_id: string): Promise<boolean> {
    const { status, message } = await this.api.deleteGate(gate_id);

    if (status === 'error') {
      api_error(message);
      return false;
    }

    return true;
  }
}

export default Collection;
