import { writable, get } from 'svelte/store';

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
      hints: [
        'No optimism added to the story tone.',
        'Light hopeful elements—some silver linings in the darkness.',
        'A balanced sense of hope and positivity through challenges.',
        'Deeply uplifting tone where hope prevails against all odds.',
      ],
    },
    {
      name: 'pessimistic',
      value: 'standard',
      hints: [
        'No pessimism present in the story.',
        'Occasional doubt or gloom in the narrative.',
        'A story that acknowledges hardship and uncertainty.',
        'A bleak, cynical world where things often go wrong.',
      ],
    },
    {
      name: 'sarcastic',
      value: 'standard',
      hints: [
        'No sarcasm or irony included.',
        'Subtle sarcastic remarks or dry humor.',
        'A consistent tone of irony and witty jabs.',
        'Relentlessly sarcastic, biting, and ironic throughout.',
      ],
    },
    {
      name: 'assertive',
      value: 'standard',
      hints: [
        'No assertiveness in tone or voice.',
        'Occasionally confident or decisive in language.',
        'Firm and self-assured tone without being aggressive.',
        'Commanding and bold tone—strong, unwavering voice.',
      ],
    },
    {
      name: 'aggressive',
      value: 'standard',
      hints: [
        'No aggression or confrontational tone.',
        'Occasional intensity or tough language.',
        'A forceful, direct style with high emotional charge.',
        'Relentless, fiery, and confrontational tone throughout.',
      ],
    },
    {
      name: 'passionate',
      value: 'standard',
      hints: [
        'Detached or emotionally neutral storytelling.',
        'Mild emotional energy or investment.',
        'A strong emotional presence that fuels the narrative.',
        'Overflowing with emotion—intensely driven and heartfelt.',
      ],
    },
    {
      name: 'entertaining',
      value: 'standard',
      hints: [
        'No focus on entertainment—purely functional storytelling.',
        'A few light or fun moments sprinkled in.',
        'Engaging and enjoyable with compelling flow.',
        'Highly entertaining—fast, fun, and full of surprises.',
      ],
    },
    {
      name: 'serious',
      value: 'standard',
      hints: [
        'No seriousness—light or humorous tone.',
        'Occasional gravity during key scenes.',
        'A balanced tone with consistent focus on important themes.',
        'Deeply serious throughout—weighty, intense, and dramatic.',
      ],
    },
    {
      name: 'educational',
      value: 'standard',
      hints: [
        'No intention to inform or explain.',
        'Some learning moments or informative lines.',
        'Includes clear teaching points and explanations.',
        'Heavily focused on education—rich in knowledge and facts.',
      ],
    },
    {
      name: 'persuasive',
      value: 'standard',
      hints: [
        'Neutral tone with no persuasive intent.',
        'A few subtle efforts to influence or convince.',
        'Consistently presents ideas to persuade or sway opinion.',
        'Boldly persuasive—driving messages home with passion.',
      ],
    },
    {
      name: 'motivating',
      value: 'standard',
      hints: [
        'No inspiring or motivational tone.',
        'Some encouragement or uplifting moments.',
        'A steady undercurrent of inspiration and purpose.',
        'Deeply motivational—empowering, rousing, and energetic.',
      ],
    },
    {
      name: 'curious',
      value: 'standard',
      hints: [
        'No sense of wonder or discovery.',
        'Occasional sparks of intrigue or interest.',
        'A tone of exploration and inquisitiveness.',
        'Overflowing with curiosity—constantly questioning and discovering.',
      ],
    },
    {
      name: 'humoristic',
      value: 'standard',
      hints: [
        'No humor or comedy elements.',
        'Light jokes or amusing moments here and there.',
        'A well-balanced blend of humor and plot.',
        'Highly comedic—funny, clever, and full of laughs.',
      ],
    },
    {
      name: 'surreal',
      value: 'standard',
      hints: [
        'Grounded in realism—no surreal elements.',
        'Minor strange or dreamlike moments.',
        'Noticeable surreal tone—blurs reality and imagination.',
        'Deeply surreal—fantastical, bizarre, and mind-bending throughout.',
      ],
    },
  ],
  additionalData: '',
});

// RESET ALL DATA STORES

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
        hints: [
          'No optimism added to the story tone.',
          'Light hopeful elements—some silver linings in the darkness.',
          'A balanced sense of hope and positivity through challenges.',
          'Deeply uplifting tone where hope prevails against all odds.',
        ],
      },
      {
        name: 'pessimistic',
        value: 'standard',
        hints: [
          'No pessimism present in the story.',
          'Occasional doubt or gloom in the narrative.',
          'A story that acknowledges hardship and uncertainty.',
          'A bleak, cynical world where things often go wrong.',
        ],
      },
      {
        name: 'sarcastic',
        value: 'standard',
        hints: [
          'No sarcasm or irony included.',
          'Subtle sarcastic remarks or dry humor.',
          'A consistent tone of irony and witty jabs.',
          'Relentlessly sarcastic, biting, and ironic throughout.',
        ],
      },
      {
        name: 'assertive',
        value: 'standard',
        hints: [
          'No assertiveness in tone or voice.',
          'Occasionally confident or decisive in language.',
          'Firm and self-assured tone without being aggressive.',
          'Commanding and bold tone—strong, unwavering voice.',
        ],
      },
      {
        name: 'aggressive',
        value: 'standard',
        hints: [
          'No aggression or confrontational tone.',
          'Occasional intensity or tough language.',
          'A forceful, direct style with high emotional charge.',
          'Relentless, fiery, and confrontational tone throughout.',
        ],
      },
      {
        name: 'passionate',
        value: 'standard',
        hints: [
          'Detached or emotionally neutral storytelling.',
          'Mild emotional energy or investment.',
          'A strong emotional presence that fuels the narrative.',
          'Overflowing with emotion—intensely driven and heartfelt.',
        ],
      },
      {
        name: 'entertaining',
        value: 'standard',
        hints: [
          'No focus on entertainment—purely functional storytelling.',
          'A few light or fun moments sprinkled in.',
          'Engaging and enjoyable with compelling flow.',
          'Highly entertaining—fast, fun, and full of surprises.',
        ],
      },
      {
        name: 'serious',
        value: 'standard',
        hints: [
          'No seriousness—light or humorous tone.',
          'Occasional gravity during key scenes.',
          'A balanced tone with consistent focus on important themes.',
          'Deeply serious throughout—weighty, intense, and dramatic.',
        ],
      },
      {
        name: 'educational',
        value: 'standard',
        hints: [
          'No intention to inform or explain.',
          'Some learning moments or informative lines.',
          'Includes clear teaching points and explanations.',
          'Heavily focused on education—rich in knowledge and facts.',
        ],
      },
      {
        name: 'persuasive',
        value: 'standard',
        hints: [
          'Neutral tone with no persuasive intent.',
          'A few subtle efforts to influence or convince.',
          'Consistently presents ideas to persuade or sway opinion.',
          'Boldly persuasive—driving messages home with passion.',
        ],
      },
      {
        name: 'motivating',
        value: 'standard',
        hints: [
          'No inspiring or motivational tone.',
          'Some encouragement or uplifting moments.',
          'A steady undercurrent of inspiration and purpose.',
          'Deeply motivational—empowering, rousing, and energetic.',
        ],
      },
      {
        name: 'curious',
        value: 'standard',
        hints: [
          'No sense of wonder or discovery.',
          'Occasional sparks of intrigue or interest.',
          'A tone of exploration and inquisitiveness.',
          'Overflowing with curiosity—constantly questioning and discovering.',
        ],
      },
      {
        name: 'humoristic',
        value: 'standard',
        hints: [
          'No humor or comedy elements.',
          'Light jokes or amusing moments here and there.',
          'A well-balanced blend of humor and plot.',
          'Highly comedic—funny, clever, and full of laughs.',
        ],
      },
      {
        name: 'surreal',
        value: 'standard',
        hints: [
          'Grounded in realism—no surreal elements.',
          'Minor strange or dreamlike moments.',
          'Noticeable surreal tone—blurs reality and imagination.',
          'Deeply surreal—fantastical, bizarre, and mind-bending throughout.',
        ],
      },
    ],
    additionalData: '',
  });
};

// COLLECT ALL DATA FROM STORES (for drafts)

export const currentDraft = writable<Nullable<DraftPayload>>(null);
export const draftsIndex = writable<DraftIndexEntry[]>([]);

export function collectState() {
  return {
    storyData: get(storyData),
    promptSettings: get(promptSettings),
    openPrompt: get(openPrompt),
    tablePrompt: get(tablePrompt),
  };
}

export function applyState(state: ReturnType<typeof collectState>) {
  storyData.set(state.storyData);
  promptSettings.set(state.promptSettings);
  openPrompt.set(state.openPrompt);
  tablePrompt.set(state.tablePrompt);
}
