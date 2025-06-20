import { writable } from 'svelte/store';
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

export const showModal = writable<boolean>(false);
export const showProfile = writable<boolean>(false);

// THEME CUSTOMIZATION

export const themeSettings = writable<boolean>(false);
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

export const customFont = writable<CustomFont>(null);
export const customStyling = writable<CustomStyling>(null);

// MODAL HANDLING

export const modal = $state<ConexusModal>({
  content: '',
  button: '',
  buttonFunc: () => {},
  buttonClass: '',
});

export const resetModal = () => {
  modal.content = '';
  modal.button = '';
  modal.buttonFunc = () => {};
  modal.buttonClass = '';
  showModal.set(false);
};

const openModal = (
  content: string,
  btn: string = '',
  btnFunc = () => {},
  btnClass: string = '',
) => {
  modal.content = content;

  if (btn) {
    modal.button = btn;
    modal.buttonFunc = () => {
      btnFunc();
      resetModal();
    };

    if (btnClass) modal.buttonClass = btnClass;
  }

  showModal.set(true);
};

export default openModal;
