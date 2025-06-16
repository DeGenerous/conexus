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
