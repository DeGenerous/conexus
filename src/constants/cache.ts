export const TTL_SHORT = 1000 * 60 * 15; // 15 minutes
export const TTL_MEDIUM = 1000 * 60 * 30; // 30 minutes
export const TTL_HOUR = 1000 * 60 * 60; // 1 hour
export const TTL_DAY = TTL_HOUR * 24; // 1 day
export const TTL_MONTH = TTL_DAY * 30; // 1 month
export const TTL_YEAR = TTL_DAY * 365; // 1 year

/* -------------------------------------------------------------------- */
// 1 YEAR - default value for SetCache()
/* -------------------------------------------------------------------- */

export const IOS_KEY = 'ios_device'; // to hide some unsupported UI

export const GAME_INSTRUCTIONS_KEY = 'show_instructions';
export const PLAY_OPTIONS_KEY = 'show_play_options';

// Step customization
export const THEMES_KEY = 'themes';
export const FONT_KEY = 'font';
export const STYLING_KEY = 'styling';
export const SCALE_KEY = 'scale';
export const VOLUME_KEY = (type: 'voice' | 'music'): string => `${type}_volume`;
export const TTS_SPEED_KEY = 'tts_speed';

// Story drafts
export const CURRENT_DRAFT_KEY = 'current_draft'; // id of the open draft

// Unfinished stories
export const UNFINISHED_STORIES_RANGE_KEY = 'unfinished_stories_range';
export const FINISHED_STORIES_RANGE_KEY = 'finished_stories_range';

// Personal settings/themes
export const PERSONAL_SETUP_KEY = 'personal_setup';

// Potential voting history from Dischordian Saga
export const DS_VOTING_HISTORY_KEY = (id: string) => `ds_voting_history[${id}]`;

/* -------------------------------------------------------------------- */
// 1 MONTH
/* -------------------------------------------------------------------- */

export const COOKIE_CONSENT_KEY = 'cookie_consent';

export const TEMP_USER_ID = 'temp_user_id';

/* -------------------------------------------------------------------- */
// 1 HOUR
/* -------------------------------------------------------------------- */

// Cache OmniHub data
export const POTENTIALS_KEY = 'potentials';
export const SELECTED_POTENTIAL_KEY = 'selected_potential';

/* -------------------------------------------------------------------- */
// 15 MINUTES
/* -------------------------------------------------------------------- */

export const USER_KEY = 'user';

// Cache subscription status & referral codes
export const SUBSCRIPTION_STATUS_KEY = 'subscription_status';
export const REFERRAL_CODE_KEY = 'referral_code';

/* -------------------------------------------------------------------- */

const authKeys = [
  USER_KEY,
  SUBSCRIPTION_STATUS_KEY,
  REFERRAL_CODE_KEY,
  POTENTIALS_KEY,
  SELECTED_POTENTIAL_KEY,
];

function saveImportantAndClearCache() {
  // saving important values
  const cookieConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
  const gameInstructions = localStorage.getItem(GAME_INSTRUCTIONS_KEY);
  const playOptions = localStorage.getItem(PLAY_OPTIONS_KEY);
  const musicVolume = localStorage.getItem(VOLUME_KEY('music'));
  const voiceVolume = localStorage.getItem(VOLUME_KEY('voice'));
  const ttsSpeed = localStorage.getItem(TTS_SPEED_KEY);
  const customThemes = localStorage.getItem(THEMES_KEY);
  const customFont = localStorage.getItem(FONT_KEY);
  const customStyling = localStorage.getItem(STYLING_KEY);
  const customScale = localStorage.getItem(SCALE_KEY);
  const currentDraft = localStorage.getItem(CURRENT_DRAFT_KEY);
  const user = localStorage.getItem(USER_KEY); // save user object too
  const unfinishedStoriesRange = localStorage.getItem(
    UNFINISHED_STORIES_RANGE_KEY,
  );
  const finishedStoriesRange = localStorage.getItem(FINISHED_STORIES_RANGE_KEY);
  const personalSetup = localStorage.getItem(PERSONAL_SETUP_KEY);
  const tempUserId = localStorage.getItem(TEMP_USER_ID);
  // deleting all values
  localStorage.clear();
  // restoring saved values
  if (cookieConsent) localStorage.setItem(COOKIE_CONSENT_KEY, cookieConsent);
  if (gameInstructions)
    localStorage.setItem(GAME_INSTRUCTIONS_KEY, gameInstructions);
  if (playOptions) localStorage.setItem(PLAY_OPTIONS_KEY, playOptions);
  if (musicVolume) localStorage.setItem(VOLUME_KEY('music'), musicVolume);
  if (voiceVolume) localStorage.setItem(VOLUME_KEY('voice'), voiceVolume);
  if (ttsSpeed) localStorage.setItem(TTS_SPEED_KEY, ttsSpeed);
  if (customThemes) localStorage.setItem(THEMES_KEY, customThemes);
  if (customFont) localStorage.setItem(FONT_KEY, customFont);
  if (customStyling) localStorage.setItem(STYLING_KEY, customStyling);
  if (customScale) localStorage.setItem(SCALE_KEY, customScale);
  if (currentDraft) localStorage.setItem(CURRENT_DRAFT_KEY, currentDraft);
  if (user) localStorage.setItem(USER_KEY, user);
  if (unfinishedStoriesRange)
    localStorage.setItem(UNFINISHED_STORIES_RANGE_KEY, unfinishedStoriesRange);
  if (finishedStoriesRange)
    localStorage.setItem(FINISHED_STORIES_RANGE_KEY, finishedStoriesRange);
  if (personalSetup) localStorage.setItem(PERSONAL_SETUP_KEY, personalSetup);
  if (tempUserId) localStorage.setItem(TEMP_USER_ID, tempUserId);
}

export const SetCache = <T>(key: string, value: T, ttl: number = TTL_YEAR) => {
  localStorage.setItem(
    key,
    JSON.stringify({
      value,
      expiry: Date.now() + ttl,
    }),
  );
};

export const GetCache = <T>(key: string): T | null => {
  const item = localStorage.getItem(key);
  if (!item) {
    return null;
  }
  const parsed = JSON.parse(item);
  if (parsed.expiry < Date.now()) {
    localStorage.removeItem(key);
    return null;
  }
  return parsed.value;
};

const removeCacheKeys = (keys: string[]) => {
  keys.forEach((key) => localStorage.removeItem(key));
};

export const ClearCache = (
  key: string | 'auth' | 'view' | 'manage' | 'full',
) => {
  switch (key) {
    case 'auth':
      removeCacheKeys(authKeys);
      break;
    case 'full':
      saveImportantAndClearCache();
      break;
    default:
      localStorage.removeItem(key);
  }
};
