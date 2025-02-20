/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type Collection = {
    category_id: number;
    category_name: string;
    section_id: number;
    section_name: string;
    topics: CollectionTopic[];
  }
  
  type CollectionTopic = {
    topic_id: number;
    prompt_id: number;
    topic_name: string;
    order: number;
    genres: string;
    available: string;
  }
  
  enum Tense {
    PastTense = 'past',
    PresentTense = 'present',
    FutureTense = 'future',
  }
  
  enum StoryStyle {
    Descriptive = 'descriptive',
    Narrative = 'narrative',
    Expository = 'expository',
  }
  
  enum VoiceStyle {
    Active = 'active',
    Passive = 'passive',
  }
  
  // Interfaces
  type Character = {
    name: string;
    description: string;
    psychology?: string;
    physicality?: string;
  }
  
  type WritingStyle = {
    Tense: Tense;
    Style: StoryStyle;
    Voice: VoiceStyle;
  }
  
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
  }
  
  enum Difficulty {
    Max = 'max',
    Standard = 'standard',
    Min = 'min',
  }
  
  enum Length {
    Max = 'max',
    Standard = 'standard',
    Min = 'min',
  }
  
  enum Interactivity {
    Max = 'max',
    Standard = 'standard',
    Min = 'min',
  }
  
  type TestPromptRequest = {
    setting: string;
    style: string;
    premise: string;
    exposition?: string;
    firstAct?: string;
    pov: string;
    winningScenario: string[];
    losingScenario: string[];
    mainCharacter: Character;
    sideCharacters: Character[];
    relationships: string;
    writingStyle: WritingStyle;
    tone: StoryTone;
    difficulty: Difficulty;
    length: Length;
    interactivity: Interactivity;
    language: string;
  }
  
  type CreatePrompt = {
    prompt: string;
    category: number;
    topic: string;
    description: string;
    image_prompt: string;
  }