/**
 * Modal props contract defining the data shape for each modal type.
 * This enforces type safety: modal.open<K>(key, props) ensures props match the key.
 *
 * To add a new modal:
 * 1. Add entry here with prop interface
 * 2. Update modal-registry.ts with static import
 * 3. Create component in src/components/modals/
 */
type ModalContract = {
  /** Simple information modal with title and body text */
  alert: {
    title: string;
    body: string;
  };

  /** Confirmation dialog with optional callbacks and cost display */
  confirm: {
    title: string;
    body: string;
    /** Optional numeric cost displayed with currency formatting */
    cost?: number;
    /** Custom label for the confirm button (defaults to "Confirm") */
    confirmText?: string;
    /** Custom label for the cancel button (defaults to "Abort") */
    cancelText?: string;
    /** Callback fired when user confirms action */
    onConfirm: () => void;
    /** Optional callback fired when user cancels (defaults to simple close) */
    onCancel?: () => void;
  };

  /** Atmospheres selector */
  themes: {};

  /** Temporary wrapper for legacy PlayOptions component */
  playOptions: {
    /** Callback fired when user clicks Play */
    onPlay: (dontShowAgain: boolean) => void;
    /** Optional callback fired when user cancels */
    onCancel?: () => void;
  };

  /** Temporary wrapper for legacy ThemeSettings component */
  themeSettings: {
    /** Optional callback fired when user closes */
    onClose?: () => void;
  };

  /** Topic prompt settings editor (language, difficulty, length, etc.) */
  topicSettings: {
    /** Context mode determines UI labels and behavior */
    mode: 'personal' | 'story-creation' | 'topic-edit';
    /** Initial settings to edit (prevents global store contamination) */
    initialValues: PromptSettings;
    /** Callback to persist settings. Receives edited settings. */
    onSave?: (settings: PromptSettings) => Promise<void>;
  };

  /** Category CRUD manager (add / delete categories). */
  categoryManager: {
    /** Called after a category is added or deleted so the parent can refresh. */
    onUpdate?: () => Promise<void>;
  };

  /** Drafts browser — lists, restores, and deletes saved drafts. */
  draftsManager: {
    /** Called after a draft is restored so the parent can react (e.g. reset timer, update label). */
    onRestore?: () => void;
    /** Called when user clicks "Start new Draft" to create a fresh draft. */
    onCreate?: () => void;
  };
};

/**
 * Union of all valid modal keys.
 * Used in modal manager's type-safe open<K> method.
 */
type ModalKey = keyof ModalContract;

/**
 * Modal state when a modal is actively open.
 */
interface ModalStateActive<K extends ModalKey> {
  key: K;
  props: ModalContract[K];
  size: 'sm' | 'md' | 'lg' | 'full';
}

/**
 * Modal state when no modal is open.
 */
interface ModalStateClosed {
  key: null;
  props: Record<string, never>;
  size: 'sm' | 'md' | 'lg' | 'full';
}

/**
 * Union type representing all possible modal states.
 */
type ModalState = ModalStateClosed | ModalStateActive<ModalKey>;

/**
 * Registry mapping modal keys to their components.
 */
type ModalRegistryType = {
  [K in ModalKey]: import('svelte').Component<ModalContract[K]>;
};

/**
 * Generic modal component type for dynamic rendering.
 */
type ModalComponentType = import('svelte').Component<Record<string, unknown>>;
