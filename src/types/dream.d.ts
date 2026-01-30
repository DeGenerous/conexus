/**
 * Dream types.
 * Story creation, structured prompts, drafts, and topic management.
 */

// ---------------------------------------------------------------------------
// Prompt Enums
// ---------------------------------------------------------------------------

/** Three-level intensity scale. */
type Min_Max = 'min' | 'standard' | 'max';

/** Four-level intensity scale (includes "none"). */
type None_Max = 'none' | Min_Max;

// ---------------------------------------------------------------------------
// Characters & Relationships
// ---------------------------------------------------------------------------

/** A story character with optional personality and appearance details. */
type Character = {
  name: string;
  description: string;
  physicality?: string;
  psychology?: string;
};

/** Defines how two named characters relate to each other. */
type Relationship = {
  type: 'friends' | 'neutral' | 'enemies';
  details?: string;
  /** Pair of character names that share this relationship. */
  connection: [string, string];
};

/** Tone settings: an array of named tones with intensity values. */
type Tone = {
  name: string;
  value: None_Max;
  /** Optional narrative hints for this tone. */
  hints?: string[];
}[];

// ---------------------------------------------------------------------------
// Prompt Configuration
// ---------------------------------------------------------------------------

/** Global prompt settings controlling AI generation behavior. */
type PromptSettings = {
  image_style: string;
  language: string;
  interactivity: Min_Max;
  difficulty: Min_Max;
  length: Min_Max;
  reading_style: string;
  kids_mode: string;
};

/** Full structured prompt (table format) for story generation. */
type TablePrompt = {
  premise: string;
  environment?: string;
  exposition?: string;
  first_action?: string;
  main_character?: Character;
  side_characters?: Character[];
  relationships?: Relationship[];
  winning_scenarios?: string[];
  losing_scenarios?: string[];
  key_events?: string[];
  tense?: string;
  story_arcs?: Min_Max;
  writing_style?: string;
  voice?: string;
  pacing?: Min_Max;
  pov?: string;
  tone?: Tone;
  additional_data?: string;
};

/** Core metadata when creating a new story/topic. */
type StoryData = {
  name: string;
  description: string;
  image_prompt: string;
  category_id: string;
};

/** How an image is delivered — remote URL or inline base64. */
type ImageType = 'url' | 'base64';

// ---------------------------------------------------------------------------
// V2 — Drafts
// ---------------------------------------------------------------------------

/** Read-only draft summary for listing views. */
type DraftView = {
  id: string;
  /** Copy of storyData.name (or "Untitled"). */
  title: string;
  created_at: Date;
  updated_at: Date;
};

/** Full draft content (prompt + settings + metadata). */
type DraftData = {
  table_prompt: TablePrompt;
  story_data: StoryData;
  prompt_settings: PromptSettings;
};

/** Draft save/update payload sent to the backend. */
type DraftPayload = DraftData & {
  id?: string;
  created_at?: Date;
  updated_at?: Date;
  tenant_id?: string;
  account_id?: string;
  title: string;
};

/** Prompt authoring mode. */
type PromptType = 'structured' | 'block';

// ---------------------------------------------------------------------------
// Topic Management (Creator)
// ---------------------------------------------------------------------------

/** Payload for creating or updating a topic. */
type TopicRequest = {
  name: string;
  description: string;
  category_id: string;
  available: boolean;
  visibility: string;
  prompt_type: PromptType;
  block_prompt?: string;
  structured_prompt?: TablePrompt;
  prompt_settings: PromptSettings;
  image_prompt: string;
};

/** Topic visibility levels. */
type TopicVisibility = 'public' | 'private' | 'unlisted';

/** Full topic record from the backend. */
type TopicFull = {
  id: string;
  name: string;
  description: string;
  available: boolean;
  visibility: TopicVisibility;
  media_folder_id: string;
};

type PromptVersion = {
  id: string;
  version_number: number;
};

type TopicTextPrompt = {
  current_prompt_version: PromptVersion;
  all_prompt_versions: PromptVersion[];

  is_block: boolean;
  block_prompt: string;
  structured_prompt?: TablePrompt | null;

  prompt_settings_id?: string | null;
};

type TopicImagePrompt = {
  current_prompt_version: PromptVersion;
  all_prompt_versions: PromptVersion[];

  prompt: string;
};

type TopicPrompt = {
  id: string;
  topic_id: string;

  text: TopicTextPrompt;
  image: TopicImagePrompt;

  content_rating: ContentRating;
};

/** Category assignment for a topic. */
type TopicCategory = {
  id: string;
  name: string;
  sort_order: number;
};

/** Genre tag for a topic. */
type TopicGenre = {
  id: string;
  name: string;
};

/** Media file attached to a topic. */
type TopicMediaFile = {
  id: string;
  file_id: string;
  media_type: MediaType;
};

/** Aggregate topic editing state used by the creator dashboard. */
type TopicManager = {
  topic: TopicFull;
  topic_prompt: TopicPrompt;
  topic_prompt_settings: PromptSettings;
  categories: TopicCategory[];
  gates: TopicGate[];
  genres: TopicGenre[];
  media_files: TopicMediaFile[];
  /** True if the current user is the topic creator. */
  creator: boolean;
};
