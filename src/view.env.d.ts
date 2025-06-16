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
  id: number;
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
