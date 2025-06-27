import { GetCache, SetCache, IOS_KEY } from '@constants/cache';

const detectIOS = () => {
  const storedValue = GetCache(IOS_KEY);
  if (storedValue) return storedValue;

  const userPlatform =
    (navigator as any).userAgentData?.platform || navigator.userAgent;

  const isIOS =
    /iPad|iPhone|iPod/.test(userPlatform) ||
    (userPlatform.includes('Mac') && 'ontouchend' in document);

  SetCache(IOS_KEY, isIOS);
  return isIOS;
};

export default detectIOS;
