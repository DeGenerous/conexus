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
  category_id: number;
  category_name: string;
  section_id: number;
  section_name: string;
  topics: CollectionTopic[];
};

type Tense = 'past' | 'present' | 'future';

type StoryStyle = 'descriptive' | 'narrative' | 'expository';

type VoiceStyle = 'active' | 'passive';

// Interfaces
type Character = {
  name: string;
  description: string;
  psychology?: string;
  physicality?: string;
};

type WritingStyle = {
  Tense: Tense;
  Style: StoryStyle;
  Voice: VoiceStyle;
};

type StoryTone = {
  Optimistic: number;
  Pessimistic: number;
  Sarcastic: number;
  Assertive: number;
  Aggressive: number;
  Passionate: number;
  Entertaining: number;
  Serious: number;
  Educational: number;
  Persuasive: number;
  Motivating: number;
  Curious: number;
  Humoristic: number;
  Surreal: number;
};

type Difficulty = 'max' | 'standard' | 'min';

type Length = 'max' | 'standard' | 'min';

type Interactivity = 'max' | 'standard' | 'min';

type TestPromptRequest = {
  setting: string;
  style: string;
  premise: string;
  exposition?: string;
  firstAct?: string;
  pov: string;
  winningScenarios: string[];
  losingScenarios: string[];
  mainCharacter: Character;
  sideCharacters: Character[];
  relationships: string;
  writingStyle: WritingStyle;
  tone: StoryTone;
  difficulty: Difficulty;
  length: Length;
  interactivity: Interactivity;
  language: string;
};

type CreatePrompt = {
  topic: string;
  description: string;
  image_prompt: string;
  category: number;
  prompt: string;
};

type MediaType = 'background' | 'description' | 'tile' | 'audio' | 'video';

type ThumbnailTopic = {
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
