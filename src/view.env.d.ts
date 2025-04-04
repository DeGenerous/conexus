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

type CategoryInSection = {
  name: string;
  order: number;
  topics: TopicInCategoryInSection[];
  created_at?: Date;
};

type TopicsInSection = {
  topic_id: number;
  topic_name: string;
  topic_order: number;
}

type CategoriesInSection = {
  id: number;
  name: string;
  order: number;
  topic_count: number
  topics: TopicsInSection[];
};

type NFTGate = {
  contract_name: SupportedContracts;
  class_name?: string;
}

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