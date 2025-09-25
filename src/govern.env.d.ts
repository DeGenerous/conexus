/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type Attr = {
  trait_type: string;
  value: string | null;
  extra?: Record<string, string | number | null>;
};

type NormalizedNFT = {
  token_id: number;
  name: string;
  image_url: string;
  description: string;
  level: string;
  attributes: Attr[];
  extra?: Record<string, string | number | null>;
};

type NFT = {
  token_id: number;
  name: string;
  image: string;
  level: number;
  attributes: Object[];
};

type NFTTile = {
  normalized: NormalizedNFT;
  raw: NFT;
};

type NFTResponse = {
  owner_url?: string;
  data_url?: string;
  image_url?: string;
  meta_data?: Record<string, string | number | null>;
  nfts: NFTTile[];
};

type FungibleToken = {
  wallet_address: string;
  balance: number;
};

type FungibleResponse = {
  contract: string;
  decimals: number;
  symbol: string;
  collection_name: string;
  fungible: FungibleToken[];
};

type OmnihubData = {
  nft?: NFTResponse;
  fungible?: FungibleResponse;
};

type PotentialMeta = {
  rank?: string;
  nft_count?: number;
  total_level?: number;
};

type SessionsStatus = 'active' | 'expired' | 'finalized';

type TopicVotingSession = {
  id: string;
  topic_id: string;
  submitted_by: string;
  status: SessionsStatus;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
};

type TopicVoteResult = {
  approve_power: number;
  reject_power: number;
  escalate_power: number;
  total_power: number;
};

type ActiveSession = TopicVotingSession & CreatorTile & TopicVoteResult;

type VoteOption = 'approve' | 'reject' | 'escalate';

type TopicVoteRequest = {
  topic_id: string;
  topic_voting_session_id: string;
  vote: VoteOption;
};
