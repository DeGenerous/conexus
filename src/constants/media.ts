export const blankImage = '/blank.avif';

export const pcBG = '/conexusBG.avif';
export const mobileBG = '/mobileBG.webp';
export const defaultBG = '/defaultBG.avif';

export const serveUrl = (path?: string) => {
  if (!path) return blankImage;
  return `/api/media/serve/${path}`;
};

export const mediaURL = 'https://media.degenerousdao.com';

export const assetsURL = `${mediaURL}/assets`;

export const trailerURL = `${assetsURL}/trailer`;
export const learnURL = `${assetsURL}/learn`;

export const blogURL = `${learnURL}/blog`;
