/**
 * Topic view types.
 * Topic pages, categories, gates, and navigation for the player-facing UI.
 */

/** Sort order for topic listing views. */
type TopicSortOrder = 'name' | 'category';

/** Access gate attached to a topic (token-gated content). */
type TopicGate = {
  gate_id: string;
  name: string;
  gate_kind: GateKind;
  collection_id?: string;
  collection_name: string;
  symbol: string;
  purchase_link: string;

  /** Minimum token balance required (ERC-20). */
  min_amount?: number;

  /** Token ID range bounds (ERC-721 class gates). */
  token_id_min?: number;
  token_id_max?: number;
  /** Explicit token IDs required (ERC-721 token gates). */
  specific_token_ids?: number[];
};

/** Category with its topics for section-based browsing. */
type SectionCategoryTopics = {
  id: string;
  name: string;
  sort_order: number;
  topic_count: number;
  topics?: CategoryTopic[];
};

/** Topic card shown within a category listing. */
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

/** Unfinished story reference for "continue" prompts. */
type UnfinishedStory = {
  story_id: string;
  created_at: string;
};

/** Adjacent topics for prev/next navigation. */
type TopicNeighbor = {
  topic_id: string;
  topic_name: string;
  sort_order: number;
  prev_topic_id?: string;
  next_topic_id?: string;
};

/** Full topic page data for the player-facing topic view. */
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
  sort_order: number;
};
