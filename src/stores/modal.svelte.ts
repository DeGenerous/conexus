import { writable } from 'svelte/store';
import {
  defaultFont,
  defaultStyling,
  lightThemeFont,
  lightThemeStyling,
} from '@constants/customization';

export const showModal = writable<boolean>(false);
export const showProfile = writable<boolean>(false);

// THEME CUSTOMIZATION

export const themeSettings = writable<boolean>(false);
export const customThemes = writable<CustomTheme[]>([
  {
    name: 'DARK (Standard)',
    font: defaultFont,
    styling: defaultStyling,
    standard: true,
  },
  {
    name: 'LIGHT (Standard)',
    font: lightThemeFont,
    styling: lightThemeStyling,
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
