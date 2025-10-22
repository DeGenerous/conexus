// Global modal + theme customisation state shared across the app shell
import { writable, get } from 'svelte/store';

import {
  defaultFont,
  defaultStyling,
  lightThemeFont,
  lightThemeStyling,
  horrorThemeFont,
  horrorThemeStyling,
  kidsThemeFont,
  kidsThemeStyling,
  sciFiThemeFont,
  sciFiThemeStyling,
  fantasyThemeFont,
  fantasyThemeStyling,
  noirThemeFont,
  noirThemeStyling,
  epicThemeFont,
  epicThemeStyling,
  romanticThemeFont,
  romanticThemeStyling,
} from '@constants/customization';
import {
  GetCache,
  SetCache,
  ClearCache,
  THEMES_KEY,
  FONT_KEY,
  STYLING_KEY,
} from '@constants/cache';

export const themeSettingsModal = writable<boolean>(false);

export const customFont = writable<CustomFont>(null);
export const customStyling = writable<CustomStyling>(null);

export const updateFont = (reset: Nullable<'reset'> = null) => {
  if (reset) customFont.set(defaultFont);
  SetCache(FONT_KEY, get(customFont));
};

export const updateStyling = (reset: Nullable<'reset'> = null) => {
  if (reset) customStyling.set(defaultStyling);
  SetCache(STYLING_KEY, get(customStyling));
};

export const getStoredCustomization = () => {
  const storedFont = GetCache<CustomFont>(FONT_KEY);
  if (storedFont) customFont.set(storedFont);
  else updateFont('reset');

  const storedStyling = GetCache<CustomStyling>(STYLING_KEY);
  if (storedStyling) customStyling.set(storedStyling);
  else updateStyling('reset');
};

export const customThemes = writable<CustomTheme[]>([
  {
    name: 'DARK (default)',
    font: defaultFont,
    styling: defaultStyling,
    standard: true,
  },
  {
    name: 'LIGHT (default)',
    font: lightThemeFont,
    styling: lightThemeStyling,
    standard: true,
  },
  {
    name: 'Horror',
    font: horrorThemeFont,
    styling: horrorThemeStyling,
    standard: true,
  },
  {
    name: 'Kids',
    font: kidsThemeFont,
    styling: kidsThemeStyling,
    standard: true,
  },
  {
    name: 'Sci-Fi',
    font: sciFiThemeFont,
    styling: sciFiThemeStyling,
    standard: true,
  },
  {
    name: 'Fantasy',
    font: fantasyThemeFont,
    styling: fantasyThemeStyling,
    standard: true,
  },
  {
    name: 'Noir',
    font: noirThemeFont,
    styling: noirThemeStyling,
    standard: true,
  },
  {
    name: 'Epic',
    font: epicThemeFont,
    styling: epicThemeStyling,
    standard: true,
  },
  {
    name: 'Romantic',
    font: romanticThemeFont,
    styling: romanticThemeStyling,
    standard: true,
  },
]);
