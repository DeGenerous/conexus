import Fetcher from '../fetcher';

export default class CollectionAPI extends Fetcher {
  protected group: string = '/collection';
  protected gateGroup: string = `${this.group}/gate`;

  async createERC20Collection(request: CreateERC20CollectionRequest) {
    return this.request(`${this.group}/erc20`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async createERC721Collection(request: CreateERC721CollectionRequest) {
    return this.request(`${this.group}/nft`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async listCollections() {
    return this.request<Partial<CollectionResponse>[]>(`${this.group}`);
  }

  async getCollection(collection_id: string) {
    return this.request<CollectionResponse>(`${this.group}/${collection_id}`);
  }

  async updateCollection(
    collection_id: string,
    request: UpdateCollectionRequest,
  ) {
    return this.request(`${this.group}/${collection_id}`, {
      method: 'PATCH',
      body: JSON.stringify(request),
    });
  }

  async deleteCollection(collection_id: string) {
    return this.request(`${this.group}/${collection_id}`, {
      method: 'DELETE',
    });
  }

  async createERC20TokenGate(request: GateERC20Request) {
    return this.request(`${this.gateGroup}/token`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async createERC721NFTGate(request: GateERC721NFTRequest) {
    return this.request(`${this.gateGroup}/nft/token`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async createERC721ClassGate(request: GateERC721ClassRequest) {
    return this.request(`${this.gateGroup}/nft/class`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async listGates(collection_id: string) {
    return this.request<Partial<GateResponse>[]>(
      `${this.group}/${collection_id}/gate`,
    );
  }

  async getGate(gate_id: string) {
    return this.request<GateResponse>(`${this.gateGroup}/${gate_id}`);
  }

  async deleteGate(gate_id: string) {
    return this.request(`${this.gateGroup}/${gate_id}`, {
      method: 'DELETE',
    });
  }
}
