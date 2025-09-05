/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type TopicInCategoryInSection = {
  id: number;
  name: string;
  order: number;
  available: boolean;
  genres?: string;
  category_id?: number;
};

type TopicInSection = {
  topic_id: number;
  topic_name: string;
  topic_order: number;
};

type CategoryInSection = {
  id: number;
  name: string;
  order: number;
  topic_count: number;
  topics: TopicInSection[];
};

type NFTGate = {
  contract_name: SupportedContracts;
  class_name?: string;
  amount?: number;
};

type TopicView = {
  id: string;
  name: string;
  genres?: string;
  nft_gate?: NFTGate[];
};

type TopicThumbnail = {
  description: string;
  description_file_id?: string;
  video_file_id?: string;
} & TopicView;

type TopicInCategory = {
  order: number;
  available: boolean;
  category_id: number;
  tile_file_id?: string;
} & TopicView;

type TopicSortOrder = 'name' | 'category';

/* V2 */

type GateKind =
  | 'erc20_token'
  | 'erc721_token'
  | 'erc1155_token'
  | 'erc721_class'
  | 'erc1155_class';

type TopicGates = {
  gate_id: string;
  name: string;
  gate_kind: GateKind;
  collection_id?: string;
  collection_name: string;
  symbol: string;
  purchase_link: string;

  min_amount?: number;

  token_id_min?: number;
  token_id_max?: number;
  specific_token_ids?: number[];
};

type CategoryTopics = {
  id: string;
  name: string;
  sort_order: number;
  genres?: string[];
  available: boolean;
  tile_file_url?: string;
  topic_gates?: TopicGates[];
};

type SectionCategoryTopics = {
  id: string;
  name: string;
  sort_order: number;
  topic_count: number;
  topics?: CategoryTopics[];
};

type UnfinishedStory = {
  story_id: string;
  created_at: string;
};

type TopicPage = {
  id: string;
  name: string;
  genres?: string[];
  description?: string;
  description_file_url?: string;
  video_file_url?: string;
  audio_file_url?: string;
  topic_gates?: TopicGates[];
  unfinished_stories?: UnfinishedStory[];
};
