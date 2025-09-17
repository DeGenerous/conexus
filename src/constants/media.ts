export const blankImage = '/blank.avif';

export const pcBG = '/conexusBG.avif';
export const mobileBG = '/mobileBG.webp';
export const defaultBG = '/defaultBG.avif';

export const serveUrl = (file_id?: string) => {
  if (!file_id) return blankImage;
  return `/api/topic/serve-media/${file_id}`;
};

export const mediaURL = 'https://media.dgrslabs.ink';

export const assetsURL = `${mediaURL}/assets`;

export const trailerURL = `${assetsURL}/trailer`;
export const learnURL = `${assetsURL}/learn`;

export const blogURL = `${learnURL}/blog`;
