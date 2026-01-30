/**
 * Governance types.
 * NFT data normalization, on-chain assets, and community voting sessions.
 */

// ---------------------------------------------------------------------------
// NFT Data
// ---------------------------------------------------------------------------

/** Normalized NFT attribute (trait_type/value pair with optional extras). */
type Attr = {
  trait_type: string;
  value: string | null;
  extra?: Record<string, string | number | null>;
};

/** NFT normalized to a consistent display format. */
type NormalizedNFT = {
  token_id: number;
  name: string;
  image_url: string;
  description: string;
  level: string;
  attributes: Attr[];
  extra?: Record<string, string | number | null>;
};

/** Raw NFT data as returned from the contract. */
type NFT = {
  token_id: number;
  name: string;
  image: string;
  level: number;
  attributes: Object[];
};

/** NFT display pair: normalized view + raw contract data. */
type NFTTile = {
  normalized: NormalizedNFT;
  raw: NFT;
};

/** Backend response for NFT collection queries. */
type NFTResponse = {
  owner_url?: string;
  data_url?: string;
  image_url?: string;
  meta_data?: Record<string, string | number | null>;
  nfts: NFTTile[];
};

/** ERC-20 fungible token balance for a wallet. */
type FungibleToken = {
  wallet_address: string;
  balance: number;
};

/** Backend response for fungible token queries. */
type FungibleResponse = {
  contract: string;
  decimals: number;
  symbol: string;
  collection_name: string;
  fungible: FungibleToken[];
};

/** Combined on-chain data (NFTs + fungible tokens) from Omnihub. */
type OmnihubData = {
  nft?: NFTResponse;
  fungible?: FungibleResponse;
};

/** Optional holder metadata (rank, NFT count, total level). */
type PotentialMeta = {
  rank?: string;
  nft_count?: number;
  total_level?: number;
};

// ---------------------------------------------------------------------------
// Voting Sessions
// ---------------------------------------------------------------------------

/** Lifecycle status of a voting session. */
type SessionsStatus = 'active' | 'expired' | 'finalized';

/** Voting session record for community topic curation. */
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

/** Aggregated vote power tallies for a session. */
type TopicVoteResult = {
  approve_power: number;
  reject_power: number;
  escalate_power: number;
  total_power: number;
};

/** Active session with creator info and current vote tallies. */
type ActiveSession = TopicVotingSession & CreatorTile & TopicVoteResult;

/** Available vote choices. */
type VoteOption = 'approve' | 'reject' | 'escalate';

/** Payload for casting a vote in a session. */
type TopicVoteRequest = {
  topic_id: string;
  topic_voting_session_id: string;
  vote: VoteOption;
};
