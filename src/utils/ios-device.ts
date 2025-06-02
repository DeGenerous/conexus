import { GetCache, SetCache, IOS_KEY, ONE_YEAR_TTL } from '@constants/cache';

const detectIOS = () => {
  const storedValue = GetCache(IOS_KEY);
  if (storedValue) return storedValue;

  const ios =
    [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document);

  SetCache(IOS_KEY, ios, ONE_YEAR_TTL);
  return ios;
};

export default detectIOS;
