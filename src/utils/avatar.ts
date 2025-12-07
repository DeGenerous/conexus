/**
 * Return the first non-space character of a username in uppercase.
 * Falls back to an empty string when unavailable.
 */
export const getAvatarInitial = (username?: string | null): string => {
  if (!username) return '';

  const trimmed = username.trim();
  if (!trimmed) return '';

  return trimmed.charAt(0).toUpperCase();
};
