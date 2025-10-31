/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type Min_Max = 'min' | 'standard' | 'max';
type None_Max = 'none' | Min_Max;

type Character = {
  name: string;
  description: string;
  physicality?: string;
  psychology?: string;
};

type Relationship = {
  type: 'friends' | 'neutral' | 'enemies';
  details?: string;
  connection: [string, string];
};

type Tone = {
  name: string;
  value: None_Max;
  hints?: string[];
}[];

type PromptSettings = {
  image_style: string;
  language: string;
  interactivity: Min_Max;
  difficulty: Min_Max;
  length: Min_Max;
  reading_style: string;
  kids_mode: string;
};

type TablePrompt = {
  premise: string;
  environment: string;
  exposition: string;
  first_action: string;
  main_character: Character;
  side_characters: Character[];
  relationships: Relationship[];
  winning_scenarios: string[];
  losing_scenarios: string[];
  key_events: string[];
  tense: string;
  story_arcs: Min_Max;
  writing_style: string;
  voice: string;
  pacing: Min_Max;
  pov?: string;
  tone: Tone;
  additional_data: string;
};

type StoryData = {
  name: string;
  description: string;
  image_prompt: string;
  category_id: string;
};

type CreatePrompt = {
  topic: string;
  description: string;
  image_prompt: string;
  category: number;
  prompt: string;
};

// interface DraftPayload {
//   id?: string; // uuid v4
//   title: string; // copy of storyData.name (or "Untitled")
//   schema?: const;
//   data: {
//     storyData: StoryData;
//     promptSettings: PromptSettings;
//     openPrompt: string;
//     tablePrompt: TablePrompt;
//   };
//   created_at: Date; // epoch ms
//   updated_at: Date; // epoch ms
// }

type ImageType = 'url' | 'base64';

type ClassGate = {
  id?: number;
  class_name?: string;
  token_id_min?: number;
  token_id_max?: number;
  created_at?: Date;
};

type SupportedContracts =
  | 'Potential'
  | 'Ark'
  | 'Moonsign'
  | 'Apes'
  | 'Anyone'
  | 'All';

type TopicNFTGate = {
  topic_id: string;
  contract_name: SupportedContracts;
  class_id?: number;
  token_ids?: number[];
  amount?: number;
  created_at?: Date;
};

/* V2 */

type DraftView = {
  id: string; // uuid v4
  title: string; // copy of storyData.name (or "Untitled")
  created_at: Date; // epoch ms
  updated_at: Date; // epoch ms
};

type DraftData = {
  table_prompt: TablePrompt;
  open_prompt: string;
  story_data: StoryData;
  prompt_settings: PromptSettings;
};

type DraftPayload = DraftData & {
  id?: string; // uuid v4
  created_at?: Date; // epoch ms
  updated_at?: Date; // epoch ms
  tenant_id?: string;
  account_id?: string;
  title: string; // copy of storyData.name (or "Untitled")
};

type TopicRequest = {
  name: string;
  description: string;
  category_id: string;
  available: boolean;
  visibility: string;
  prompt: string;
  image_prompt: string;
  settings: PromptSettings;
};

type TopicVisibility = 'public' | 'private' | 'unlisted';

type TopicFull = {
  id: string;
  name: string;
  description: string;
  available: boolean;
  visibility: TopicVisibility;
  media_folder_id: string;
};

type TopicPrompt = {
  id: string;
  prompt: string;
  image_prompt: string;
};

type TopicCategory = {
  id: string;
  name: string;
  sort_order: number;
};

type TopicGenre = {
  id: string;
  name: string;
};

type TopicMediaFile = {
  id: string;
  file_id: string;
  media_type: MediaType;
};

type TopicManager = {
  topic: TopicFull;
  topic_prompt: TopicPrompt;
  topic_prompt_settings: PromptSettings;
  categories: TopicCategory[];
  gates: Gate[];
  genres: TopicGenre[];
  media_files: TopicMediaFile[];
};
