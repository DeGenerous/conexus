/**
 * Web3 collection and gate types.
 * On-chain token collections (ERC-20/721) and their access gates.
 */

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

/** Supported token standards. */
type AvailableStandards = 'erc20' | 'erc721';

/** Supported blockchain networks. */
type AvailableNetworks =
  | 'ethereum-mainnet'
  | 'ethereum-goerli'
  | 'base-mainnet'
  | 'base-goerli';

/** Shared fields for all on-chain collections. */
type CollectionBase = {
  address: string;
  chain_id: number;
  standard: AvailableStandards;

  name: string;
  purchase_link?: string;
  symbol: string;
  description?: string;
  logo_uri?: string;

  rpc_uri?: string;
  block_explorer_uri?: string;
  network?: AvailableNetworks;

  /** Raw contract ABI JSON. */
  abi?: string;
};

/** ERC-20 specific fields. */
type CollectionERC20 = {
  total_supply?: string;
  decimals: number;
};

/** ERC-721 specific fields with metadata parsing configuration. */
type CollectionERC721 = {
  token_id_uri?: string;
  token_id_parser?: string;
  metadata_uri?: string;
  metadata_parser?: string;

  image_uri?: string;

  token_id_type?: 'number' | 'string';
  total_supply?: string;
};

/** Payload for creating a new ERC-20 collection. */
type CreateERC20CollectionRequest = {
  base: CollectionBase;
  erc20: CollectionERC20;
};

/** Payload for creating a new ERC-721 collection. */
type CreateERC721CollectionRequest = {
  base: CollectionBase;
  erc721: CollectionERC721;
};

/** Backend response for a persisted collection. */
type CollectionResponse = {
  id: string;
  created_at: string;
  updated_at: string;
} & CollectionBase &
  (CollectionERC20 | CollectionERC721);

/** Partial update payload for collection metadata. */
type UpdateCollectionRequest = {
  name?: string;
  purchase_link?: string;
  description?: string;
  logo_uri?: string;

  rpc_uri?: string;
  block_explorer_uri?: string;
};

// ---------------------------------------------------------------------------
// Gates
// ---------------------------------------------------------------------------

/** Supported gate token standards (including ERC-1155). */
type GateKind =
  | 'erc20_token'
  | 'erc721_token'
  | 'erc1155_token'
  | 'erc721_class'
  | 'erc1155_class';

/** Shared fields for all access gates. */
type GateBase = {
  name: string;
  collection_id: string;
  gate_kind: GateKind;
};

/** ERC-20 gate requirement: minimum token balance. */
type GateERC20 = {
  min_amount: number;
};

/** ERC-721 gate requirement: specific tokens or token ID range. */
type GateERC721 = {
  specific_token_ids?: number[];
  token_id_min?: number;
  token_id_max?: number;
};

/** Create request for an ERC-20 balance gate. */
type GateERC20Request = GateBase & GateERC20 & { gate_kind: 'erc20_token' };

/** Create request for an ERC-721 specific-token gate. */
type GateERC721NFTRequest = {
  specific_token_ids?: number[];
} & GateBase & { gate_kind: 'erc721_token' };

/** Create request for an ERC-721 class-range gate. */
type GateERC721ClassRequest = {
  token_id_min?: number;
  token_id_max?: number;
} & GateBase & { gate_kind: 'erc721_class' };

/** Backend response for a persisted gate. */
type GateResponse = {
  id: string;
  created_at: string;
  updated_at: string;
  erc20?: GateERC20;
  erc721?: GateERC721;
} & GateBase;
