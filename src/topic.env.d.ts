/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type TopicSortOrder = 'name' | 'category';

/* V2 */

type TopicGate = {
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

type CategoryTopic = {
  id: string;
  name: string;
  sort_order: number;
  genres?: string[];
  available: boolean;
  visibility: 'public' | 'private';
  tile_file_url?: string;
  topic_gates?: TopicGate[];
};

type SectionCategoryTopics = {
  id: string;
  name: string;
  sort_order: number;
  topic_count: number;
  topics?: CategoryTopic[];
};

type UnfinishedStory = {
  story_id: string;
  created_at: string;
};

type TopicNeighbor = {
  topic_id: string;
  topic_name: string;
};

type TopicPage = {
  id: string;
  name: string;
  genres?: string[];
  description?: string;
  description_file_url?: string;
  video_file_url?: string;
  audio_file_url?: string;
  topic_gates?: TopicGate[];
  unfinished_stories?: UnfinishedStory[];
};
