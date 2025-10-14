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
export const ONBOARDING_KEY = 'onboarded';

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

// Potential voting history from Dischordian Saga
export const DS_VOTING_HISTORY_KEY = (id: string) => `ds_voting_history[${id}]`;

/* -------------------------------------------------------------------- */
// 1 MONTH
/* -------------------------------------------------------------------- */

export const COOKIE_CONSENT_KEY = 'cookie_consent';

export const GENRES_KEY = 'genres';

export const TERMS_KEY = 'terms_accepted'; // temp for terms modal

/* -------------------------------------------------------------------- */
// 1 DAY
/* -------------------------------------------------------------------- */

// Cache all sections
export const SECTIONS_KEY = 'sections';

// Cache all categories from all sections together
export const CATEGORIES_KEY = 'categories';

/* -------------------------------------------------------------------- */
// 1 HOUR
/* -------------------------------------------------------------------- */

// CACHE ALL DATA TO PLAY 1 HOUR WITHOUT UNNECESSARY REQUESTS:
// 1) user object
// 2) all CATEGORIES inside SECTION (separate for every SECTION)
// 3) all TOPICS inside CATEGORY (separate for every CATEGORY)
// 4) all TOPICS inside CATEGORY for the DASHBOARD-DREAM-MANAGE (separate for every CATEGORY)

export const USER_KEY = 'user';

export const SECTION_CATEGORIES_KEY = (section: string): string =>
  `section_categories[${section}]`;

export const CATEGORY_TOPICS_KEY = (category: string): string =>
  `category_topics[${category}]`;

export const MANAGE_CATEGORY_TOPICS_KEY = (category: string): string =>
  `manage_category_topics[${category}]`;

/* -------------------------------------------------------------------- */
// 15 MINUTES
/* -------------------------------------------------------------------- */

// Cache subscription status & referral codes
export const SUBSCRIPTION_STATUS_KEY = 'subscription_status';
export const REFERRAL_CODE_KEY = 'referral_code';

// Cache OmniHub data
export const POTENTIALS_KEY = 'potentials';
export const SELECTED_POTENTIAL_KEY = 'selected_potential';

/* -------------------------------------------------------------------- */

const authKeys = [
  USER_KEY,
  SUBSCRIPTION_STATUS_KEY,
  REFERRAL_CODE_KEY,
  POTENTIALS_KEY,
  SELECTED_POTENTIAL_KEY,
];

const viewKeys = [
  SECTIONS_KEY,
  CATEGORIES_KEY,
  GENRES_KEY,
  SECTION_CATEGORIES_KEY('Community Picks'),
  SECTION_CATEGORIES_KEY('Collabs'),
  SECTION_CATEGORIES_KEY('Dischordian Saga'),
];

function saveImportantAndClearCache() {
  // saving important values
  const cookieConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
  const gameInstructions = localStorage.getItem(GAME_INSTRUCTIONS_KEY);
  const onboarded = localStorage.getItem(ONBOARDING_KEY);
  const musicVolume = localStorage.getItem(VOLUME_KEY('music'));
  const voiceVolume = localStorage.getItem(VOLUME_KEY('voice'));
  const ttsSpeed = localStorage.getItem(TTS_SPEED_KEY);
  const customThemes = localStorage.getItem(THEMES_KEY);
  const customFont = localStorage.getItem(FONT_KEY);
  const customStyling = localStorage.getItem(STYLING_KEY);
  const customScale = localStorage.getItem(SCALE_KEY);
  const currentDraft = localStorage.getItem(CURRENT_DRAFT_KEY);
  const user = localStorage.getItem(USER_KEY); // save user object too
  const termsAccepted = localStorage.getItem(TERMS_KEY); // temp for terms modal
  const unfinishedStoriesRange = localStorage.getItem(
    UNFINISHED_STORIES_RANGE_KEY,
  );
  // deleting all values
  localStorage.clear();
  // restoring saved values
  if (cookieConsent) localStorage.setItem(COOKIE_CONSENT_KEY, cookieConsent);
  if (gameInstructions)
    localStorage.setItem(GAME_INSTRUCTIONS_KEY, gameInstructions);
  if (onboarded) localStorage.setItem(ONBOARDING_KEY, onboarded);
  if (musicVolume) localStorage.setItem(VOLUME_KEY('music'), musicVolume);
  if (voiceVolume) localStorage.setItem(VOLUME_KEY('voice'), voiceVolume);
  if (ttsSpeed) localStorage.setItem(TTS_SPEED_KEY, ttsSpeed);
  if (customThemes) localStorage.setItem(THEMES_KEY, customThemes);
  if (customFont) localStorage.setItem(FONT_KEY, customFont);
  if (customStyling) localStorage.setItem(STYLING_KEY, customStyling);
  if (customScale) localStorage.setItem(SCALE_KEY, customScale);
  if (currentDraft) localStorage.setItem(CURRENT_DRAFT_KEY, currentDraft);
  if (user) localStorage.setItem(USER_KEY, user);
  if (termsAccepted) localStorage.setItem(TERMS_KEY, termsAccepted); // temp
  if (unfinishedStoriesRange)
    localStorage.setItem(UNFINISHED_STORIES_RANGE_KEY, unfinishedStoriesRange);
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
    case 'view':
      removeCacheKeys(viewKeys);
      break;
    case 'full':
      saveImportantAndClearCache();
      break;
    default:
      localStorage.removeItem(key);
  }
};
