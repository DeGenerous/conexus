/* Reactive modal state manager (state-first). */

import { MODAL_KEYS } from '@config/modal-registry';

class ModalManager {
  state = $state<ModalState>({
    key: null,
    props: {},
    size: 'md',
  });

  get isOpen(): boolean {
    return this.state.key !== null;
  }

  // Focus restoration for accessibility.
  private returnFocusTo: HTMLElement | null = null;

  /**
   * Opens a modal.
   * @param key - The component key from registry
   * @param props - Data/Callbacks to pass to the component
   * @param size - Window size
   */
  open<K extends ModalKey>(
    key: K,
    props: ModalContract[K],
    size: ModalState['size'] = 'md',
  ) {
    // Capture the element that triggered the modal.
    if (typeof document !== 'undefined') {
      this.returnFocusTo = document.activeElement as HTMLElement;
    }

    this.state = { key, props, size };
  }

  /**
   * Closes the active modal.
   */
  close() {
    this.state = { key: null, props: {}, size: 'md' };

    // Restore focus after animation starts.
    if (this.returnFocusTo && typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => {
        this.returnFocusTo?.focus();
        this.returnFocusTo = null;
      });
    }
  }

  // --- Convenience methods ---

  // Usage: modal.confirm('Delete?', 'Are you sure?', { onConfirm: () => deleteItem() })
  confirm(
    title: string,
    body: string,
    actions: {
      onConfirm: () => void;
      onCancel?: () => void;
      cost?: number;
      confirmText?: string;
      cancelText?: string;
    },
  ) {
    this.open(
      MODAL_KEYS.CONFIRM,
      {
        title,
        body,
        cost: actions.cost,
        confirmText: actions.confirmText,
        cancelText: actions.cancelText,
        onConfirm: () => {
          actions.onConfirm();
          this.close();
        },
        onCancel: () => {
          if (actions.onCancel) actions.onCancel();
          this.close();
        },
      },
      'md',
    );
  }

  /**
   * Shows a simple information modal.
   */
  alert(title: string, body: string) {
    this.open(
      MODAL_KEYS.ALERT,
      {
        title,
        body,
      },
      'sm',
    );
  }

  /**
   * Opens the play options modal.
   */
  playOptions(options: {
    onPlay: (dontShowAgain: boolean) => void;
    onCancel?: () => void;
  }) {
    this.open(
      MODAL_KEYS.PLAY_OPTIONS,
      {
        onPlay: (dontShowAgain) => {
          options.onPlay(dontShowAgain);
          this.close();
        },
        onCancel: () => {
          if (options.onCancel) options.onCancel();
          this.close();
        },
      },
      'lg',
    );
  }

  /**
   * Opens the legacy theme settings modal (temporary wrapper).
   */
  themeSettings(options?: { onClose?: () => void }) {
    this.open(
      MODAL_KEYS.THEME_SETTINGS,
      {
        onClose: () => {
          if (options?.onClose) options.onClose();
          this.close();
        },
      },
      'lg',
    );
  }

  /**
   * Opens the topic prompt settings modal.
   */
  topicSettings(options?: { onSave: () => Promise<void> }) {
    this.open(
      MODAL_KEYS.TOPIC_SETTINGS,
      {
        onSave: async () => {
          await options?.onSave();
          this.close();
        },
      },
      'lg',
    );
  }

  /**
   * Opens the category manager modal.
   */
  categoryManager(options?: { onUpdate?: () => Promise<void> }) {
    this.open(
      MODAL_KEYS.CATEGORY_MANAGER,
      {
        onUpdate: options?.onUpdate,
      },
      'lg',
    );
  }

  /**
   * Opens the drafts manager modal.
   */
  draftsManager(options?: { onRestore?: () => void }) {
    this.open(
      MODAL_KEYS.DRAFTS_MANAGER,
      {
        onRestore: options?.onRestore,
      },
      'lg',
    );
  }

  /**
   * Opens the Atmospheres selector modal.
   * Currently a no-op — ThemesFragment is not yet registered (pending Void Energy deps).
   */
  themes() {
    console.warn(
      '[ModalManager] themes() called but ThemesFragment is not registered. Skipping.',
    );
  }
}

export const modal = new ModalManager();
