/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type NFTTile = {
  token_id: number;
  name: string;
  image: string;
  level: string;
  attributes: Object[];
};

type NFTs = {
    normalized: NFTTile;
    raw: NFTTile;
}

type OmnihubData = {
  nfts: NFTs[];
  total_level: number;
  nft_count: number;
  rank?: string;
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
}


type ActiveSession = TopicVotingSession & CreatorTile & TopicVoteResult;

type VoteOption = 'approve' | 'reject' | 'escalate';

type TopicVoteRequest = {
    topic_id: string;
    topic_voting_session_id: string;
    vote: VoteOption;
};