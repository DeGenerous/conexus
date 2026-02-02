/**
 * Shared application types.
 * API responses, game data, navigation, file management, and blog content.
 */

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

/** Standard API response with just a message. */
type APISTDResposne = {
  message: string;
};

/** Developer-facing error details. */
type APIError = {
  /** Developer debug info (optional). */
  details?: string;
};

/** Typed API response envelope. */
type APIResponse<T> = {
  status: 'success' | 'error';
  message: string;
  data?: T;
  error?: APIError;
};

// ---------------------------------------------------------------------------
// Audio & Playback
// ---------------------------------------------------------------------------

/** Audio player state. */
type VolumeControl = {
  muted: boolean;
  volume: number;
  /** Whether to restart playback from the beginning. */
  restart: boolean;
};

// ---------------------------------------------------------------------------
// Story Continuation
// ---------------------------------------------------------------------------

/** Reference to an in-progress story the user can resume. */
type ContinuableStory = {
  story_id: string;
  topic_id: string;
};

// ---------------------------------------------------------------------------
// Taxonomy
// ---------------------------------------------------------------------------

/** Simple topic availability flag. */
type Topic = {
  name: string;
  available: boolean;
};

/** Content category with dashboard ordering. */
type Category = {
  id?: string;
  name: string;
  description: string;
  dashboard_sort_order: number;
};

/** Lightweight category reference for select menus. */
type CategoryView = {
  id: number;
  name: string;
};

// ---------------------------------------------------------------------------
// Gameplay
// ---------------------------------------------------------------------------

/** Single step in a story playthrough. */
type StepData = {
  step: number;
  step_id: string;
  title?: string;
  story: string;
  ended: boolean;
  options: string[];
  /** Index of the player's chosen option. */
  choice?: number;
  summary: string;
  trait: string;
  trait_description?: string;
  image_prompt?: string;
  image?: string;
  image_type?: ImageType;
  tts?: Blob;
  /** Async task ID for pending media generation. */
  task_id: string;
};

/** Persisted game step with a unique ID. */
type GameData = {
  id: string;
} & StepData;

// ---------------------------------------------------------------------------
// Auth Flows
// ---------------------------------------------------------------------------

/** Password reset payload (with email verification token). */
type ResetPassword = {
  email: string;
  password: string;
  token: string;
};

/** Change password payload (authenticated user). */
type ChangePassword = {
  old_password: string;
  new_password: string;
};

/** Web3 wallet sign-in payload (EIP-191 or EIP-4361). */
type Web3Signin = {
  message: string;
  signature: string;
};

// ---------------------------------------------------------------------------
// Content Structure
// ---------------------------------------------------------------------------

/** Generic content section (used in topic and category grouping). */
type Section = {
  id?: string;
  name?: string;
  description?: string;
};

/** Creator profile. */
type Creator = {
  id: string;
  username?: string;
  avatar_url?: string;
  avatar_bio?: string;
  avatar_file_id?: string;
};

/** Explorer profile (extended with name and description). */
type Explorer = {
  id: string;
  name?: string;
  description?: string;
  username?: string;
  avatar_url?: string;
  avatar_bio?: string;
  avatar_file_id?: string;
};

/** Genre tag for content categorization. */
type Genre = {
  id?: string;
  name: string;
  description?: string;
};

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

/** Prev/next story navigation links. */
type StoryNavigation = {
  link: Nullable<string>;
  name: Nullable<string>;
};

/** Background overlay configuration. */
type ConexusBG = {
  opacity: number;
  color: string;
};

/** Password input field context identifier. */
type Password = 'login' | 'signup' | 'edit' | 'reset';

/** Visibility toggle state per password field. */
type PasswordVisibility = {
  login: boolean;
  signup: boolean;
  edit: boolean;
  reset: boolean;
};

// ---------------------------------------------------------------------------
// File Management
// ---------------------------------------------------------------------------

/** Recursive folder structure in the file manager. */
type FolderContent = {
  id: string;
  name: string;
  description: string;
  user_id: string;
  parent_id: string;
  path: string;
  folders: FolderContent[];
  files: FileContent[];
};

/** Individual file within a folder. */
type FileContent = {
  id: string;
  name: string;
  path: string;
  content_type: string;
  size: number;
  parent_id: string;
  hash: string;
  /** File content or download URL. */
  data: string;
};

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

/** Blog page metadata for SEO and listing. */
type BlogPage = {
  url: string;
  title: string;
  description: string;
};

/** Blog comparison card (used in "best of" posts). */
type BlogPageCard = {
  name: string;
  bestFor: string;
  platform: string;
  pricing: string;
  description: string;
  url: string;
};

// ---------------------------------------------------------------------------
// Story Nodes (Interactive Video)
// ---------------------------------------------------------------------------

/** A node in an interactive story with branching choices. */
type StoryNode = {
  season?: number;
  title: string | undefined;
  description: string;
  video_url: string;
  /** Timestamp (seconds) when the vote window closes. */
  endTimestamp: number;
  ended: boolean;
  votes_options: {
    option: string;
    class?: string;
  }[];
  /** Index of the user's selected vote. */
  vote?: number;
  episode?: number;
  memory?: number;
};

// ---------------------------------------------------------------------------
// Attributes
// ---------------------------------------------------------------------------

/** In-game character attribute (name/value pair). */
type Attribute = {
  name: string;
  value: number;
};

/** On-chain NFT attribute (ERC-721 metadata standard). */
type OnchainAttribute = {
  label: string;
  type: 'string';
  trait_type: string;
  value: string;
};

// ---------------------------------------------------------------------------
// Story Navigation
// ---------------------------------------------------------------------------

/** Navigation menu action item (prev/next story arrows). */
type NavItem = {
  name?: string;
  link?: string;
  action?: () => void;
};

/** Navigation context tracking current position in a story sequence. */
type NavContext = {
  items: NavItem[];
  index: number;
};

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

/** Sidebar link item — leaf (has path) or group (has children). */
type Linking = {
  name: string;
  path?: string;
  onclick?: () => void;
  children?: Linking[];
  intended?: 'all' | 'admin' | 'player';
  display?: () => boolean;
};

/** Sidebar item that renders a Svelte component instead of a link. */
type SidebarComponentItem = {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: import('svelte').Component<any>;
  props?: Record<string, unknown>;
};

/** Union of link-based and component-based sidebar items. */
type SidebarItem = Linking | SidebarComponentItem;

// ---------------------------------------------------------------------------
// Breadcrumbs
// ---------------------------------------------------------------------------

/** Single segment in a breadcrumb trail. Omit `href` for the current page. */
type Breadcrumb = { label: string; href?: string; active?: boolean };
