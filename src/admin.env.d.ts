/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type CollectionTopic = {
  topic_id: number;
  prompt_id: number;
  topic_name: string;
  order: number;
  genres: string;
  available: string;
};

type Collection = {
  section_id: number;
  section_name: string;
  category_id: number;
  category_name: string;
  category_order: number;
  topics: CollectionTopic[];
};

type MediaType = 'background' | 'description' | 'tile' | 'audio' | 'video';

type ThumbnailTopic = {
  id: number;
  name: string;
  genres: string;
  description: string;
};

type ViewTopic = {
  id: number;
  category_id: number;
  image_prompt: string;
  prompt_id: number;
  prompt: string;
  media_folder_id?: string;
  available: string;
} & ThumbnailTopic;

/* V2 */

type TenantRole = {
  id: string;
  name: string;
};

type Contract = {
  id?: string;
  address: string;
  name: string;
  chain_id: number;
  standard: 'erc20' | 'erc721';
  purchase_link: string;
  symbol?: string;
  description?: string;
  logo_url?: string;
  explorer_url?: string;
  owner_url?: string;
  data_url?: string;
  image_url?: string;
  abi?: object;
  created_at?: string;
  updated_at?: string;
};

type Gate = {
  id?: string;
  name: string;
  contract_id: string;
  type: 'token' | 'class';
} & (TokenGate | ClassGate);

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
  topic_id: string;
  account_id?: string;
  ended?: boolean;
} & BaseMetricFilter;

type TopNMetricFilter = {
  n: number;
} & BaseMetricFilter;