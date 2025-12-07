const USERBACK_WIDGET_SRC = 'https://static.userback.io/widget/v1.js';
const USERBACK_ACCESS_TOKEN = 'A-Z3Pn7jFKRWpyuxRY2AQvivPRs';

type UserbackUserData = {
  id: string;
  info: {
    name?: string;
    email?: string;
  };
};

type UserbackWidget = {
  access_token?: string;
  user_data?: UserbackUserData;
  [key: string]: unknown;
};

const getUserback = (): UserbackWidget => {
  const w = window as typeof window & { Userback?: UserbackWidget };
  w.Userback = w.Userback || {};
  return w.Userback;
};

const reloadScript = (): void => {
  const existingScript = document.querySelector<HTMLScriptElement>(
    `script[src="${USERBACK_WIDGET_SRC}"]`,
  );
  if (existingScript) existingScript.remove();

  const script = document.createElement('script');
  script.async = true;
  script.src = USERBACK_WIDGET_SRC;
  (document.head || document.body).appendChild(script);
};

export const loadUserbackWidget = (userData: UserbackUserData): void => {
  if (typeof window === 'undefined') return;

  const userback = getUserback();
  userback.access_token = USERBACK_ACCESS_TOKEN;
  userback.user_data = userData;

  reloadScript();
};

export const clearUserbackUserData = (): void => {
  if (typeof window === 'undefined') return;

  const w = window as typeof window & { Userback?: UserbackWidget };
  const userback = w.Userback;
  if (userback) {
    userback.access_token = USERBACK_ACCESS_TOKEN;
    if ('user_data' in userback) delete userback.user_data;
  } else {
    w.Userback = { access_token: USERBACK_ACCESS_TOKEN };
  }

  reloadScript();
};
