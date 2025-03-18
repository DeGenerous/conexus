export const COOKIE_CONSENT_KEY = 'cookie_consent';
export const COOKIE_CONSENT_TTL = 1000 * 60 * 60 * 24 * 30; // 1 month

export const USER_CACHE_KEY = 'user';
export const USER_CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

export const SUBSCRIPTIONSTATUS_CACHE_KEY = 'subscription_status';
export const SUBSCRIPTIONSTATUS_CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

export const REFERRAL_CODES_CACHE_KEY = 'referral_codes';
export const REFERRAL_CODES_CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

export const SECTION_CACHE_KEY = 'sections';
export const SECTION_CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

export const SECTION_CATEGORY_CACHE_KEY = 'section_categories';
export const SECTION_CATEGORY_CACHE_TTL = 1000 * 60 * 10 // 10 minutes

export const CATEGORY_CACHE_KEY = 'categories';
export const CATEGORY_CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

export const GENRE_CACHE_KEY = 'genres';
export const GENRE_CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

export const TOPICS_CACHE_KEY = 'topics';
export const TOPICS_CACHE_TTL = 1000 * 60 * 10 // 10 minutes

export const MEDIA_CACHE_KEY = 'media';
export const MEDIA_CACHE_TTL = 1000 * 60 * 10 // 10 minutes

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

export const ClearCache = (key: string | 'auth' | 'full') => {
  switch (key) {
    case 'auth':
      localStorage.removeItem(USER_CACHE_KEY);
      localStorage.removeItem(SUBSCRIPTIONSTATUS_CACHE_KEY);
      localStorage.removeItem(REFERRAL_CODES_CACHE_KEY);
      localStorage.removeItem(SECTION_CACHE_KEY);
      localStorage.removeItem(GENRE_CACHE_KEY);
      break;
    case 'full':
      localStorage.clear();
      break;
    default:
      localStorage.removeItem(key);
  }
};
