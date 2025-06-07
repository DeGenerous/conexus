import { writable } from 'svelte/store';

export const showModal = writable<boolean>(false);
export const showProfile = writable<boolean>(false);

export const modal = $state({
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
