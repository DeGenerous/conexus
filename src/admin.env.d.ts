/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type CollectionTopic = {
  topic_id: string;
  topic_name: string;
  order: number;
  available: boolean;
  visibility: TopicVisibility;
};

type CollectionCategory = {
  category_id: string;
  category_name: string;
  category_order: number;
  topic_count: number;
  topics?: CollectionTopic[];
};

type CollectionCreator = {
  creator_id: string;
  creator_name: string;
  category_count: number;
  categories?: CollectionCategory[];
};

type CollectionSection = {
  section_id: string;
  section_name: string;
  category_count: number;
  categories?: CollectionCategory[];
};

type Collection = CollectionCategory & {
  section_id: number | string;
  topics: CollectionTopic[];
};

type MediaType = 'background' | 'description' | 'tile' | 'audio' | 'video';

/* V2 */

type TenantRole = {
  id: string;
  name: Roles;
  monthly_credits: number;
  play_without_media: number;
  play_with_media: number;
  can_generate_media: boolean;
  create_topic_cost: number;
  publish_topic_cost: number;
};

// Metric Filters

type BaseMetricFilter = {
  start_date?: string;
  end_date?: string;
};

type AccountMetricFilter = {
  role_id?: string;
  email_confirmed?: boolean;
  referred?: boolean;
} & BaseMetricFilter;

type WalletMetricFilter = {
  is_faux?: boolean;
  main?: boolean;
} & BaseMetricFilter;

type TopicMetricFilter = {
  available?: boolean;
  visibility?: string;
} & BaseMetricFilter;

type StoryMetricFilter = {
  topic_id?: string;
  account_id?: string;
  ended?: boolean;
} & BaseMetricFilter;

type TopNMetricFilter = {
  n: number;
} & BaseMetricFilter;

type TopNMetricResult = {
  id: string;
  name: string;
  activity_count: number;
}[];
