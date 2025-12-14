/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type StorySettingSelector = 'account' | 'topic';

type PlayMode = 'play_limited' | 'play_unlimited';

type SettingMode = 'personal' | 'default';

type PreferredSetup = {
  settings?: SettingMode;
  theme?: SettingMode;
  play_mode?: PlayMode;
};

type TTSPROVIDER = 'backend' | 'elevenlabs';
