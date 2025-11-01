import { api_error } from '@errors/index';
import CollectionAPI from '@service/v2/collection';
import { toastStore } from '@stores/toast.svelte';

/**
 * Provides helper methods for managing collections and their gates.
 */
class Collection {
  protected api: CollectionAPI;

  /**
   * Initialize the collection service with the configured backend endpoint.
   */
  constructor() {
    this.api = new CollectionAPI(import.meta.env.PUBLIC_BACKEND);
  }

  /**
   * Create a new ERC-20 collection using the provided details.
   * @param request - The collection payload to send.
   */
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

  /**
   * Create a new ERC-721 collection using the provided details.
   * @param request - The collection payload to send.
   */
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

  /**
   * Retrieve all collections that belong to the tenant.
   * @returns A list of collections or an empty array on failure.
   */
  async listCollections(): Promise<Partial<CollectionResponse>[]> {
    const { status, message, data } = await this.api.listCollections();

    if (status === 'error') {
      api_error(message);
      return [];
    }

    return data || [];
  }

  /**
   * Retrieve details for a single collection.
   * @param collection_id - The collection identifier to fetch.
   * @returns The collection data or null when unavailable.
   */
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

  /**
   * Update a collection with the provided payload.
   * @param collection_id - The identifier of the collection to update.
   * @param request - The update payload to send.
   */
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

  /**
   * Delete a collection.
   * @param collection_id - The identifier of the collection to delete.
   * @returns True when the delete succeeds, otherwise false.
   */
  async deleteCollection(collection_id: string): Promise<boolean> {
    const { status, message } = await this.api.deleteCollection(collection_id);

    if (status === 'error') {
      api_error(message);
      return false;
    }

    return true;
  }

  /**
   * Create an ERC-20 token gate.
   * @param request - The gate payload to send.
   */
  async createERC20TokenGate(request: GateERC20Request): Promise<void> {
    const { status, message } =
      await this.api.createERC20TokenGate(request);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Gate created successfully', 'info');
  }

  /**
   * Create an ERC-721 NFT gate.
   * @param request - The gate payload to send.
   */
  async createERC721NFTGate(request: GateERC721NFTRequest): Promise<void> {
    const { status, message } =
      await this.api.createERC721NFTGate(request);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Gate created successfully', 'info');
  }

  /**
   * Create an ERC-721 class gate.
   * @param request - The gate payload to send.
   */
  async createERC721ClassGate(request: GateERC721ClassRequest): Promise<void> {
    const { status, message } =
      await this.api.createERC721ClassGate(request);

    if (status === 'error') {
      api_error(message);
      return;
    }

    toastStore.show(message || 'Gate created successfully', 'info');
  }

  /**
   * List all gates for a collection.
   * @param collection_id - The identifier of the collection to inspect.
   * @returns A list of gates or an empty array on failure.
   */
  async listGates(collection_id: string): Promise<Partial<GateResponse>[]> {
    const { status, message, data } = await this.api.listGates(collection_id);

    if (status === 'error') {
      api_error(message);
      return [];
    }

    return data || [];
  }

  /**
   * Retrieve a specific gate by identifier.
   * @param gate_id - The gate identifier to fetch.
   * @returns The gate data or null when unavailable.
   */
  async getGate(gate_id: string): Promise<GateResponse | null> {
    const { status, message, data } = await this.api.getGate(gate_id);

    if (status === 'error') {
      api_error(message);
      return null;
    }

    return data || null;
  }

  /**
   * Delete a gate from a collection.
   * @param gate_id - The gate identifier to delete.
   * @returns True when the delete succeeds, otherwise false.
   */
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
