export const ONE_YEAR_TTL = 1000 * 60 * 60 * 24 * 365; // 1 year

export const IOS_KEY = 'ios_device'; // to hide some unsupported UI

export const COOKIE_CONSENT_KEY = 'cookie_consent';
export const COOKIE_CONSENT_TTL = 1000 * 60 * 60 * 24 * 30; // 1 month

export const GENRE_CACHE_KEY = 'genres';
export const GENRE_CACHE_TTL = 1000 * 60 * 60 * 24 * 30; // 1 month

// Cache all topics for /dashboard/manage to switch between them with arrows
export const ALL_TOPICS_KEY = 'all_topics';
export const ALL_TOPICS_TTL = 1000 * 60 * 60 * 24; // 1 day

// Cache all sections
export const SECTION_CACHE_KEY = 'sections';
export const SECTION_CACHE_TTL = 1000 * 60 * 60 * 24; // 1 day

// Cache all categories from all sections together
export const CATEGORY_CACHE_KEY = 'categories';
export const CATEGORY_CACHE_TTL = 1000 * 60 * 60 * 24; // 1 day

// CACHE ALL DATA TO PLAY 1 HOUR WITHOUT UNNECESSARY REQUESTS:
// 1) user + subscription status + 10 referral codes
// 2) all CATEGORIES inside SECTION (separate for every SECTION)
// 3) all TOPICS inside CATEGORY (separate for every CATEGORY)

export const USER_CACHE_KEY = 'user';
export const USER_CACHE_TTL = 1000 * 60 * 60 * 1; // 1 hour

export const SUBSCRIPTIONSTATUS_CACHE_KEY = 'subscription_status';
export const SUBSCRIPTIONSTATUS_CACHE_TTL = 1000 * 60 * 60 * 1; // 1 hour

export const REFERRAL_CODES_CACHE_KEY = 'referral_codes';
export const REFERRAL_CODES_CACHE_TTL = 1000 * 60 * 60 * 1; // 1 hour

export const SECTION_CATEGORIES_KEY = (section: string): string =>
  `section_categories[${section}]`;
export const SECTION_CATEGORIES_TTL = 1000 * 60 * 60 * 1; // 1 hour

export const CATEGORY_TOPICS_KEY = (category: string): string =>
  `category_topics[${category}]`;
export const CATEGORY_TOPICS_TTL = 1000 * 60 * 60 * 1; // 1 hour

// Step customization (use 1 year TTL)
export const GAME_INSTRUCTIONS_KEY = 'show_instructions';
export const THEMES_KEY = 'themes';
export const FONT_KEY = 'font';
export const STYLING_KEY = 'styling';
export const SCALE_KEY = 'scale';
export const VOLUME_KEY = (type: 'voice' | 'music'): string => `${type}_volume`;
export const TTS_SPEED_KEY = 'tts_speed';

// Story drafts (use 1 year TTL)
export const DRAFTS_KEY = 'dream_drafts';

const authKeys = [
  USER_CACHE_KEY,
  SUBSCRIPTIONSTATUS_CACHE_KEY,
  REFERRAL_CODES_CACHE_KEY,
];

const viewKeys = [
  SECTION_CACHE_KEY,
  CATEGORY_CACHE_KEY,
  GENRE_CACHE_KEY,
  ALL_TOPICS_KEY,
  SECTION_CATEGORIES_KEY('Community Picks'),
  SECTION_CATEGORIES_KEY('Collabs'),
  SECTION_CATEGORIES_KEY('Dischordian Saga'),
];

export const SetCache = <T>(key: string, value: T, ttl: number) => {
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
      // saving important values
      const cookieConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
      const gameInstructions = localStorage.getItem(GAME_INSTRUCTIONS_KEY);
      const musicVolume = localStorage.getItem(VOLUME_KEY('music'));
      const voiceVolume = localStorage.getItem(VOLUME_KEY('voice'));
      const ttsSpeed = localStorage.getItem(TTS_SPEED_KEY);
      const customThemes = localStorage.getItem(THEMES_KEY);
      const customFont = localStorage.getItem(FONT_KEY);
      const customStyling = localStorage.getItem(STYLING_KEY);
      const customScale = localStorage.getItem(SCALE_KEY);
      const storyDrafts = localStorage.getItem(DRAFTS_KEY);
      // deleting all values
      localStorage.clear();
      // restoring saved values
      if (cookieConsent)
        localStorage.setItem(COOKIE_CONSENT_KEY, cookieConsent);
      if (gameInstructions)
        localStorage.setItem(GAME_INSTRUCTIONS_KEY, gameInstructions);
      if (musicVolume) localStorage.setItem(VOLUME_KEY('music'), musicVolume);
      if (voiceVolume) localStorage.setItem(VOLUME_KEY('voice'), voiceVolume);
      if (ttsSpeed) localStorage.setItem(TTS_SPEED_KEY, ttsSpeed);
      if (customThemes) localStorage.setItem(THEMES_KEY, customThemes);
      if (customFont) localStorage.setItem(FONT_KEY, customFont);
      if (customStyling) localStorage.setItem(STYLING_KEY, customStyling);
      if (customScale) localStorage.setItem(SCALE_KEY, customScale);
      if (storyDrafts) localStorage.setItem(DRAFTS_KEY, storyDrafts);
      break;
    default:
      localStorage.removeItem(key);
  }
};

// TODO: set up Redis cache management

export const SetCacheR = async <T>(key: string, value: T, ttl: number) => {
  await fetch('http://localhost:5001/cache', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, value, ttl }),
  });
};

export const GetCacheR = async <T>(key: string): Promise<T | null> => {
  const response = await fetch(`http://localhost:5001/cache/${key}`);
  const { data } = await response.json();
  return data ?? null;
};

export const removeCacheKeysR = async (key: string) => {
  await fetch(`http://localhost:5001/cache/${key}`, { method: 'DELETE' });
};

export const ClearCacheR = async (
  key: string | 'auth' | 'view' | 'manage' | 'full',
) => {
  switch (key) {
    case 'auth':
      await Promise.all(authKeys.map((key) => removeCacheKeysR(key)));
      break;
    case 'view':
      await Promise.all(viewKeys.map((key) => removeCacheKeysR(key)));
      break;
    case 'full':
      await fetch('http://localhost:5001/cache', { method: 'DELETE' });
      break;
    default:
      await removeCacheKeysR(key);
  }
};
