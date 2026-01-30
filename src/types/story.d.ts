/**
 * Story playback types.
 * Play mode, settings mode, and user-preferred setup configuration.
 */

/** Source of story settings: per-account or per-topic default. */
type StorySettingSelector = 'account' | 'topic';

/** Play mode controlling media generation during gameplay. */
type PlayMode = 'play_limited' | 'play_unlimited';

/** Whether to use personal customizations or topic defaults. */
type SettingMode = 'personal' | 'default';

/** User's saved play preferences. */
type PreferredSetup = {
  settings?: SettingMode;
  theme?: SettingMode;
  play_mode?: PlayMode;
};
