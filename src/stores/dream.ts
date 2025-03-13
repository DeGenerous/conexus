import { writable } from 'svelte/store';

export const storyData = writable<StoryData>({
  name: '',
  description: '',
  imagePrompts: [],
});

export const promptSettings = writable<PromptSettings>({
  imageStyle: 'Realist',
  language: 'English',
  interactivity: 'standard',
  difficulty: 'standard',
  length: 'standard',
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
  storyArcs: 'standard',
  writingStyle: 'descriptive',
  voice: 'active',
  pacing: 'standard',
  tone: [
    {
      name: 'optimistic',
      value: 'none',
    },
    {
      name: 'pessimistic',
      value: 'none',
    },
    {
      name: 'sarcastic',
      value: 'none',
    },
    {
      name: 'assertive',
      value: 'none',
    },
    {
      name: 'aggressive',
      value: 'none',
    },
    {
      name: 'passionate',
      value: 'none',
    },
    {
      name: 'entertaining',
      value: 'none',
    },
    {
      name: 'serious',
      value: 'none',
    },
    {
      name: 'educational',
      value: 'none',
    },
    {
      name: 'persuasive',
      value: 'none',
    },
    {
      name: 'motivating',
      value: 'none',
    },
    {
      name: 'curious',
      value: 'none',
    },
    {
      name: 'humoristic',
      value: 'none',
    },
    {
      name: 'surreal',
      value: 'none',
    },
  ],
  additionalData: '',
});

export const clearAllData = () => {
  storyData.set({
    name: '',
    description: '',
    imagePrompts: [],
  });
  promptSettings.set({
    imageStyle: 'Realist',
    language: 'English',
    interactivity: 'standard',
    difficulty: 'standard',
    length: 'standard',
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
        value: 'none',
      },
      {
        name: 'pessimistic',
        value: 'none',
      },
      {
        name: 'sarcastic',
        value: 'none',
      },
      {
        name: 'assertive',
        value: 'none',
      },
      {
        name: 'aggressive',
        value: 'none',
      },
      {
        name: 'passionate',
        value: 'none',
      },
      {
        name: 'entertaining',
        value: 'none',
      },
      {
        name: 'serious',
        value: 'none',
      },
      {
        name: 'educational',
        value: 'none',
      },
      {
        name: 'persuasive',
        value: 'none',
      },
      {
        name: 'motivating',
        value: 'none',
      },
      {
        name: 'curious',
        value: 'none',
      },
      {
        name: 'humoristic',
        value: 'none',
      },
      {
        name: 'surreal',
        value: 'none',
      },
    ],
    additionalData: '',
  });
};
