export const COOKIE_CONSENT_KEY = 'cookie_consent';
export const COOKIE_CONSENT_TTL = 1000 * 60 * 60 * 24 * 30; // 1 month

export const USER_CACHE_KEY = 'user';
export const USER_CACHE_TTL = 1000 * 60 * 60 * 1; // 1 hour

export const SUBSCRIPTIONSTATUS_CACHE_KEY = 'subscription_status';
export const SUBSCRIPTIONSTATUS_CACHE_TTL = 1000 * 60 * 30; // 30 minutes

export const REFERRAL_CODES_CACHE_KEY = 'referral_codes';
export const REFERRAL_CODES_CACHE_TTL = 1000 * 60 * 30; // 30 minutes

export const SECTION_CACHE_KEY = 'sections';
export const SECTION_CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

export const SECTION_CATEGORY_CACHE_KEY = 'section_categories';
export const SECTION_CATEGORY_CACHE_TTL = 1000 * 60 * 10; // 10 minutes

export const CATEGORY_CACHE_KEY = 'categories';
export const CATEGORY_CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

export const GENRE_CACHE_KEY = 'genres';
export const GENRE_CACHE_TTL = 1000 * 60 * 60 * 24 * 30; // 30 days

export const SECTION_TOPICS_KEY = (section: string): string =>
  `${section} topics`;
export const SECTION_TOPICS_TTL = 1000 * 60 * 60 * 12; // 12 hours

export const SECTION_CATEGORIES_KEY = (section: string): string =>
  `section-categories-[${section}]`;
export const SECTION_CATEGORIES_TTL = 1000 * 60 * 60 * 1; // 1 hour

export const CATEGORY_TOPICS_KEY = (category: string): string =>
  `category-topics-[${category}]`;
export const CATEGORY_TOPICS_TTL = 1000 * 60 * 60 * 1; // 1 hour

export const ALL_TOPICS_KEY = 'all_topics';
export const ALL_TOPICS_TTL = 1000 * 60 * 60 * 24; // 24 hours

export const TOPICS_CACHE_KEY = 'topics';
export const TOPICS_CACHE_TTL = 1000 * 60 * 10; // 10 minutes

export const MEDIA_CACHE_KEY = 'media';
export const MEDIA_CACHE_TTL = 1000 * 60 * 10; // 10 minutes

const authKeys = [
  USER_CACHE_KEY,
  SUBSCRIPTIONSTATUS_CACHE_KEY,
  REFERRAL_CODES_CACHE_KEY,
  SECTION_CACHE_KEY,
  SECTION_CATEGORY_CACHE_KEY,
  CATEGORY_CACHE_KEY,
  TOPICS_CACHE_KEY,
  MEDIA_CACHE_KEY,
  GENRE_CACHE_KEY,
];

const viewKeys = [
  SECTION_CACHE_KEY,
  SECTION_CATEGORY_CACHE_KEY,
  CATEGORY_CACHE_KEY,
  TOPICS_CACHE_KEY,
  MEDIA_CACHE_KEY,
  GENRE_CACHE_KEY,
  ALL_TOPICS_KEY,
  SECTION_TOPICS_KEY('Community Picks'),
  SECTION_TOPICS_KEY('Collabs'),
  SECTION_TOPICS_KEY('Dischordian Saga'),
  SECTION_CATEGORIES_KEY('Community Picks'),
  SECTION_CATEGORIES_KEY('Collabs'),
  SECTION_CATEGORIES_KEY('Dischordian Saga'),
];

const manageKeys = [
  SECTION_CATEGORY_CACHE_KEY,
  TOPICS_CACHE_KEY,
  MEDIA_CACHE_KEY,
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
    case 'manage':
      removeCacheKeys(manageKeys);
      break;
    case 'full':
      localStorage.clear();
      break;
    default:
      localStorage.removeItem(key);
  }
};

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
    case 'manage':
      await Promise.all(manageKeys.map((key) => removeCacheKeysR(key)));
      break;
    case 'full':
      await fetch('http://localhost:5001/cache', { method: 'DELETE' });
      break;
    default:
      await removeCacheKeysR(key);
  }
};
