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

interface PromptSettings {
  imageStyle: string;
  language: string;
  interactivity: Min_Max;
  difficulty: Min_Max;
  length: Min_Max;
  readingStyle: string;
  kidsMode: Nullable<string>;
}

interface TablePrompt {
  premise: string;
  environment: string;
  exposition: string;
  firstAction: string;
  mainCharacter: Character;
  sideCharacters: Character[];
  relationships: Relationship[];
  winningScenarios: string[];
  losingScenarios: string[];
  keyEvents: string[];
  tense: string;
  storyArcs: Min_Max;
  writingStyle: string;
  voice: string;
  pacing: Min_Max;
  POV?: string;
  tone: Tone;
  additionalData: string;
}

interface StoryData {
  name: string;
  description: string;
  imagePrompt: string;
  category: Nullable<number>;
}

type CreatePrompt = {
  topic: string;
  description: string;
  image_prompt: string;
  category: number;
  prompt: string;
};

interface DraftPayload {
  id?: string; // uuid v4
  title: string; // copy of storyData.name (or "Untitled")
  schema?: const;
  data: {
    storyData: StoryData;
    promptSettings: PromptSettings;
    openPrompt: string;
    tablePrompt: TablePrompt;
  };
  created_at: string; // epoch ms
  updated_at: string; // epoch ms
}

type DraftIndexEntry = Pick<DraftPayload, 'id' | 'title' | 'updated'>;

type ImageType = 'url' | 'base64';

type ClassGate = {
  id: number;
  name: string;
  start_token_id: number;
  end_token_id: number;
  created_at: Date;
};

type SupportedContracts =
  | 'Potential'
  | 'Ark'
  | 'Moonsign'
  | 'Apes'
  | 'Anyone'
  | 'All';

type TopicNFTGate = {
  topic_id: number;
  contract_name: SupportedContracts;
  class_id?: number;
  token_ids?: number[];
  amount?: number;
  created_at?: Date;
};

type ContractGate = {
  name?: string;
  link?: string;
};

type TopicNFTGateWithContract = {} & TopicNFTGate & ContractGate;
interface TopicNFTGateWithContract extends TopicNFTGate, ContractGate {}

/* V2 */

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

type TopicFull = {
  id: string;
  name: string;
  description: string;
  available: boolean;
  visibility: string;
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
  Topic: TopicFull;
  TopicPrompt: TopicPrompt;
  TopicPromptSettings: PromptSettings;
  Categories: TopicCategory[];
  Gates: Gate[];
  Genres: TopicGenre[];
  MediaFiles: TopicMediaFile[];
};
