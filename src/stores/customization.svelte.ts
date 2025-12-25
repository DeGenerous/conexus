// Global modal + theme customisation state shared across the app shell
import { writable, get } from 'svelte/store';

import {
  defaultFont,
  defaultStyling,
  onyxThemeFont,
  onyxThemeStyling,
  terminalThemeFont,
  terminalThemeStyling,
  crimsonThemeFont,
  crimsonThemeStyling,
  overgrowthThemeFont,
  overgrowthThemeStyling,
  velvetThemeFont,
  velvetThemeStyling,
  solarThemeFont,
  solarThemeStyling,
  nebulaThemeFont,
  nebulaThemeStyling,
  paperThemeFont,
  paperThemeStyling,
  labThemeFont,
  labThemeStyling,
  playgroundThemeFont,
  playgroundThemeStyling,
  focusThemeFont,
  focusThemeStyling,
} from '@constants/customization';
import Account from '@lib/account';
import {
  ClearCache,
  GetCache,
  SetCache,
  FONT_KEY,
  STYLING_KEY,
  THEMES_KEY,
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
  if (typeof window === 'undefined') return;

  const storedFont = GetCache<CustomFont>(FONT_KEY);
  if (storedFont) customFont.set(storedFont);
  else updateFont('reset');

  const storedStyling = GetCache<CustomStyling>(STYLING_KEY);
  if (storedStyling) customStyling.set(storedStyling);
  else updateStyling('reset');

  requestBackendTheme();
};

const clone = <T>(value: T): T => structuredClone(value);

const STANDARD_THEMES: CustomTheme[] = [
  {
    name: 'VOID (default)',
    font: clone(defaultFont),
    styling: clone(defaultStyling),
    standard: true,
  },
  {
    name: 'ONYX',
    font: clone(onyxThemeFont),
    styling: clone(onyxThemeStyling),
    standard: true,
  },
  {
    name: 'TERMINAL',
    font: clone(terminalThemeFont),
    styling: clone(terminalThemeStyling),
    standard: true,
  },
  {
    name: 'CRIMSON',
    font: clone(crimsonThemeFont),
    styling: clone(crimsonThemeStyling),
    standard: true,
  },
  {
    name: 'OVERGROWTH',
    font: clone(overgrowthThemeFont),
    styling: clone(overgrowthThemeStyling),
    standard: true,
  },
  {
    name: 'VELVET',
    font: clone(velvetThemeFont),
    styling: clone(velvetThemeStyling),
    standard: true,
  },
  {
    name: 'SOLAR',
    font: clone(solarThemeFont),
    styling: clone(solarThemeStyling),
    standard: true,
  },
  {
    name: 'NEBULA',
    font: clone(nebulaThemeFont),
    styling: clone(nebulaThemeStyling),
    standard: true,
  },
  {
    name: 'PAPER',
    font: clone(paperThemeFont),
    styling: clone(paperThemeStyling),
    standard: true,
  },
  {
    name: 'LAB',
    font: clone(labThemeFont),
    styling: clone(labThemeStyling),
    standard: true,
  },
  {
    name: 'PLAYGROUND',
    font: clone(playgroundThemeFont),
    styling: clone(playgroundThemeStyling),
    standard: true,
  },
  {
    name: 'FOCUS',
    font: clone(focusThemeFont),
    styling: clone(focusThemeStyling),
    standard: true,
  },
];

export const STANDARD_THEME_COUNT = STANDARD_THEMES.length;

const cloneTheme = (theme: CustomTheme): CustomTheme => ({
  name: theme.name,
  font: clone(theme.font),
  styling: clone(theme.styling),
  standard: theme.standard,
});

export const customThemes = writable<CustomTheme[]>(
  STANDARD_THEMES.map((theme) => cloneTheme(theme)),
);

const account = new Account();

const fontsEqual = (a: CustomFont, b: CustomFont): boolean => {
  if (!a || !b) return false;
  return (
    a.family === b.family &&
    a.baseSize === b.baseSize &&
    a.accentSize === b.accentSize &&
    a.baseColor === b.baseColor &&
    a.accentColor === b.accentColor
  );
};

const stylingEqual = (a: CustomStyling, b: CustomStyling): boolean => {
  if (!a || !b) return false;
  return a.bgPictureOpacity === b.bgPictureOpacity && a.bgColor === b.bgColor;
};

const themesEqual = (a: CustomTheme, b: CustomTheme): boolean =>
  fontsEqual(a.font, b.font) && stylingEqual(a.styling, b.styling);

const persistThemesCache = (themes: CustomTheme[]) => {
  if (typeof window === 'undefined') return;

  ClearCache(THEMES_KEY);
  if (themes.length === STANDARD_THEME_COUNT) return;

  SetCache(THEMES_KEY, themes.slice(STANDARD_THEME_COUNT));
};

export const persistCustomThemesCache = () => {
  persistThemesCache(get(customThemes));
};

const applyPresetTheme = (theme: CustomTheme) => {
  customFont.set(clone(theme.font));
  customStyling.set(clone(theme.styling));
  updateFont();
  updateStyling();
};

let backendThemeLoaded = false;
let backendThemePromise: Promise<void> | null = null;

const hydrateThemeFromBackend = async () => {
  if (typeof window === 'undefined') return;

  const savedTheme = await account.getCustomTheme();
  if (!savedTheme || !savedTheme.font || !savedTheme.styling) return;

  const presetMatch = STANDARD_THEMES.find((theme) =>
    themesEqual(theme, savedTheme),
  );

  if (presetMatch) {
    applyPresetTheme(presetMatch);
    return;
  }

  const customTheme: CustomTheme = {
    name: 'Custom Theme',
    font: clone(savedTheme.font),
    styling: clone(savedTheme.styling),
  };

  let addedTheme = false;
  customThemes.update((themes) => {
    const exists = themes.some((theme) => themesEqual(theme, customTheme));
    if (exists) return themes;
    addedTheme = true;
    return [...themes, customTheme];
  });

  if (addedTheme) {
    persistCustomThemesCache();
  }

  customFont.set(clone(customTheme.font));
  customStyling.set(clone(customTheme.styling));
  updateFont();
  updateStyling();
};

const requestBackendTheme = () => {
  if (backendThemeLoaded || backendThemePromise) return;
  backendThemePromise = hydrateThemeFromBackend()
    .catch(() => {})
    .finally(() => {
      backendThemeLoaded = true;
      backendThemePromise = null;
    });
};

export const persistActiveTheme = async (name: string = 'Custom Theme') => {
  if (typeof window === 'undefined') return;
  const font = get(customFont);
  const styling = get(customStyling);
  if (!font || !styling) return;

  await account.createOrUpdateCustomTheme({
    name,
    font,
    styling,
  });
};
