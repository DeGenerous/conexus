export const blankImage = '/blank.avif';

export const serveUrl = (path?: string) => {
    if (!path) return blankImage;
    return `/api/media/serve/${path}`
};
