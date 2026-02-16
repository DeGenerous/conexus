/**
 * Admin dashboard types.
 * Collection hierarchy, tenant roles, and analytics metric filters.
 */

// ---------------------------------------------------------------------------
// Collection Hierarchy (Admin View)
// ---------------------------------------------------------------------------

/** Topic within an admin collection view. */
type CollectionTopic = {
  topic_id: string;
  topic_name: string;
  order: number;
  available: boolean;
  visibility: TopicVisibility;
};

/** Category grouping topics in an admin collection. */
type CollectionCategory = {
  category_id: string;
  category_name: string;
  category_order: number;
  topic_count: number;
  topics?: CollectionTopic[];
};

/** Creator who owns categories in an admin collection. */
type CollectionCreator = {
  creator_id: string;
  creator_name: string;
  category_count: number;
  categories?: CollectionCategory[];
};

/** Section grouping categories in an admin collection. */
type CollectionSection = {
  section_id: string;
  section_name: string;
  category_count: number;
  categories?: CollectionCategory[];
};

/** Flattened collection view: a category bound to a section with its topics. */
type Collection = CollectionCategory & {
  section_id: number | string;
  topics: CollectionTopic[];
};

/** Upload slot types for topic media assets. */
type MediaType = 'background' | 'description' | 'tile' | 'audio' | 'video';

// ---------------------------------------------------------------------------
// Tenant Roles
// ---------------------------------------------------------------------------

/** Platform role names. */
type Roles = 'Guest' | 'Player' | 'Creator' | 'Admin';

/** Role configuration defining credit limits and feature access. */
type TenantRole = {
  id: string;
  name: Roles;
  monthly_credits: number;
  /** Max steps allowed when playing without media generation. */
  play_without_media: number;
  /** Max steps allowed when playing with media generation. */
  play_with_media: number;
  can_generate_media: boolean;
  /** Credit cost to create a new topic. */
  create_topic_cost: number;
  /** Credit cost to publish a topic. */
  publish_topic_cost: number;
};

// ---------------------------------------------------------------------------
// Metric Filters
// ---------------------------------------------------------------------------

/** Shared date range for all metric queries. */
type BaseMetricFilter = {
  start_date?: string;
  end_date?: string;
};

/** Account-level metric filter criteria. */
type AccountMetricFilter = {
  role_id?: string;
  email_confirmed?: boolean;
  referred?: boolean;
} & BaseMetricFilter;

/** Wallet metric filter criteria. */
type WalletMetricFilter = {
  /** Filter by system-generated wallets. */
  is_faux?: boolean;
  /** Filter by primary wallet status. */
  main?: boolean;
} & BaseMetricFilter;

/** Topic metric filter criteria. */
type TopicMetricFilter = {
  available?: boolean;
  visibility?: string;
} & BaseMetricFilter;

/** Story metric filter criteria. */
type StoryMetricFilter = {
  topic_id?: string;
  account_id?: string;
  ended?: boolean;
} & BaseMetricFilter;

/** Top-N leaderboard query filter. */
type TopNMetricFilter = {
  /** Number of top entries to return. */
  n: number;
} & BaseMetricFilter;

/** Top-N leaderboard result set. */
type TopNMetricResult = {
  id: string;
  name: string;
  activity_count: number;
}[];
