/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// -----------------------------
// Collection
// -----------------------------

type AvailableStandards = 'erc20' | 'erc721';

type AvailableNetworks =
  | 'ethereum-mainnet'
  | 'ethereum-goerli'
  | 'base-mainnet'
  | 'base-goerli';

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

  abi?: string;
};

type CollectionERC20 = {
  total_supply?: string;
  decimals: number;
};

type CollectionERC721 = {
  token_id_uri?: string;
  token_id_parser?: string;
  metadata_uri?: string;
  metadata_parser?: string;

  image_uri?: string;

  token_id_type?: 'number' | 'string';
  total_supply?: string;
};

type CreateERC20CollectionRequest = {
  base: CollectionBase;
  erc20: CollectionERC20;
};

type CreateERC721CollectionRequest = {
  base: CollectionBase;
  erc721: CollectionERC721;
};

type CollectionResponse = {
  id: string;
  created_at: string;
  updated_at: string;
} & CollectionBase &
  (CollectionERC20 | CollectionERC721);

type UpdateCollectionRequest = {
  name?: string;
  purchase_link?: string;
  description?: string;
  logo_uri?: string;

  rpc_uri?: string;
  block_explorer_uri?: string;
};

// -----------------------------
// Gates
// -----------------------------

type GateKind =
  | 'erc20_token'
  | 'erc721_token'
  | 'erc1155_token'
  | 'erc721_class'
  | 'erc1155_class';

type GateBase = {
  name: string;
  collection_id: string;
  gate_kind: GateKind;
};

type GateERC20 = {
  min_amount: number;
};

type GateERC721 = {
  specific_token_ids?: number[];
  token_id_min?: number;
  token_id_max?: number;
};

type GateERC20Request = GateBase & GateERC20 & { gate_kind: 'erc20_token' };

type GateERC721NFTRequest = {
  specific_token_ids?: number[];
} & GateBase & { gate_kind: 'erc721_token' };

type GateERC721ClassRequest = {
  token_id_min?: number;
  token_id_max?: number;
} & GateBase & { gate_kind: 'erc721_class' };

type GateResponse = {
  id: string;
  created_at: string;
  updated_at: string;
  erc20?: GateERC20;
  erc721?: GateERC721;
} & GateBase;
