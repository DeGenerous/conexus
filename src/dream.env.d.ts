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
}[];

interface PromptSettings {
  imageStyle: string;
  language: string;
  interactivity: Min_Max;
  difficulty: Min_Max;
  length: Min_Max;
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
  imagePrompts: string[];
  category: Nullable<number>;
}

type CreatePrompt = {
  topic: string;
  description: string;
  image_prompt: string;
  category: number;
  prompt: string;
};

type ImageType = 'url' | 'base64';

type SupportedContracts = 'Potential' | 'Ark' | 'Moonsign' | 'Apes' | 'All';

type TopicNFTGate = {
	id?: number;
	topic_id: number;
	contract_name: SupportedContracts;
	token_id?: number
	created_at?: Date
}