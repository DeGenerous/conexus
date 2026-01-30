import AlertFragment from '@components/modals/AlertFragment.svelte';
import ConfirmFragment from '@components/modals/ConfirmFragment.svelte';
// import ThemesFragment from '@components/modals/ThemesFragment.svelte'; // TODO: re-enable when Void Energy deps exist (void-engine, transitions, morph, design-tokens, Switcher, Toggle, SettingsRow)
import PlayOptionsFragment from '@components/modals/PlayOptionsFragment.svelte';
import ThemeSettingsFragment from '@components/modals/ThemeSettingsFragment.svelte';

// Modal keys.
export const MODAL_KEYS = {
  ALERT: 'alert',
  CONFIRM: 'confirm',
  THEMES: 'themes',
  PLAY_OPTIONS: 'playOptions',
  THEME_SETTINGS: 'themeSettings',
} as const;

// Static modal registry - components are bundled upfront for instant display.
// Partial because ThemesFragment is not yet compilable.
export const modalRegistry: Partial<ModalRegistryType> = {
  alert: AlertFragment,
  confirm: ConfirmFragment,
  playOptions: PlayOptionsFragment,
  themeSettings: ThemeSettingsFragment,
};
