import { writable } from 'svelte/store';

export const storyData = writable<StoryData>({
  name: '',
  description: '',
  imagePrompt: '',
  category: null,
});

export const promptSettings = writable<PromptSettings>({
  imageStyle: 'Realistic',
  language: 'English',
  interactivity: 'standard',
  difficulty: 'standard',
  length: 'standard',
  readingStyle: 'simple',
  kidsMode: null,
});

export const openPrompt = writable<string>('');

export const tablePrompt = writable<TablePrompt>({
  premise: '',
  environment: '',
  exposition: '',
  firstAction: '',
  mainCharacter: {
    name: '',
    description: '',
  },
  sideCharacters: [],
  relationships: [],
  winningScenarios: [],
  losingScenarios: [],
  keyEvents: [],
  tense: 'present',
  storyArcs: 'min',
  writingStyle: 'descriptive',
  voice: 'active',
  pacing: 'standard',
  tone: [
    {
      name: 'optimistic',
      value: 'standard',
    },
    {
      name: 'pessimistic',
      value: 'standard',
    },
    {
      name: 'sarcastic',
      value: 'standard',
    },
    {
      name: 'assertive',
      value: 'standard',
    },
    {
      name: 'aggressive',
      value: 'standard',
    },
    {
      name: 'passionate',
      value: 'standard',
    },
    {
      name: 'entertaining',
      value: 'standard',
    },
    {
      name: 'serious',
      value: 'standard',
    },
    {
      name: 'educational',
      value: 'standard',
    },
    {
      name: 'persuasive',
      value: 'standard',
    },
    {
      name: 'motivating',
      value: 'standard',
    },
    {
      name: 'curious',
      value: 'standard',
    },
    {
      name: 'humoristic',
      value: 'standard',
    },
    {
      name: 'surreal',
      value: 'standard',
    },
  ],
  additionalData: '',
});

export const clearAllData = () => {
  storyData.set({
    name: '',
    description: '',
    imagePrompt: '',
    category: null,
  });
  promptSettings.set({
    imageStyle: 'Realistic',
    language: 'English',
    interactivity: 'standard',
    difficulty: 'standard',
    length: 'standard',
    readingStyle: 'simple',
    kidsMode: null,
  });
  openPrompt.set('');
  tablePrompt.set({
    premise: '',
    environment: '',
    exposition: '',
    firstAction: '',
    mainCharacter: {
      name: '',
      description: '',
    },
    sideCharacters: [],
    relationships: [],
    winningScenarios: [],
    losingScenarios: [],
    keyEvents: [],
    tense: 'present',
    storyArcs: 'standard',
    writingStyle: 'descriptive',
    voice: 'active',
    pacing: 'standard',
    tone: [
      {
        name: 'optimistic',
        value: 'standard',
      },
      {
        name: 'pessimistic',
        value: 'standard',
      },
      {
        name: 'sarcastic',
        value: 'standard',
      },
      {
        name: 'assertive',
        value: 'standard',
      },
      {
        name: 'aggressive',
        value: 'standard',
      },
      {
        name: 'passionate',
        value: 'standard',
      },
      {
        name: 'entertaining',
        value: 'standard',
      },
      {
        name: 'serious',
        value: 'standard',
      },
      {
        name: 'educational',
        value: 'standard',
      },
      {
        name: 'persuasive',
        value: 'standard',
      },
      {
        name: 'motivating',
        value: 'standard',
      },
      {
        name: 'curious',
        value: 'standard',
      },
      {
        name: 'humoristic',
        value: 'standard',
      },
      {
        name: 'surreal',
        value: 'standard',
      },
    ],
    additionalData: '',
  });
};
