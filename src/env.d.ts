/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type Nullable<T> = T | null | undefined;

declare namespace App {
  interface Locals {
    user: User;
  }
}

type APISTDResposne = {
  message: string;
};

type APIError = {
  details?: string; // Developer debug info (optional)
};

type APIResponse<T> = {
  status: 'success' | 'error';
  message: string;
  data?: T;
  error?: APIError;
};

type VolumeControl = {
  muted: boolean;
  volume: number;
  restart: boolean;
};

type ContinuableStory = {
  story_id: string;
  topic_id: string;
};

type Topic = {
  name: string;
  available: boolean;
};

type Category = {
  id?: string;
  name: string;
  description: string;
  dashboard_sort_order: number;
};

type CategoryView = {
  id: number;
  name: string;
};

type StepData = {
  step: number;
  step_id: string;
  title?: string;
  story: string;
  ended: boolean;
  options: string[];
  choice?: number;
  summary: string;
  trait: string;
  trait_description?: string;
  image?: string;
  image_type?: ImageType;
  tts?: Blob;
};

type GameData = {
  id: string;
} & StepData;

type ResetPassword = {
  email: string;
  password: string;
  token: string;
};

type ChangePassword = {
  old_password: string;
  new_password: string;
};

type Web3Signin = {
  message: string;
  signature: string;
};

type Section = {
  id?: string;
  name: string;
  description?: string;
};

type Genre = {
  id?: string;
  name: string;
  description?: string;
};

type StoryNavigation = {
  link: Nullable<string>;
  name: Nullable<string>;
};

type ConexusBG = {
  opacity: number;
  color: string;
};

type ConexusModal = {
  content: string;
  button: string;
  buttonFunc: () => void;
  buttonClass: string;
};

type Password = 'login' | 'signup' | 'edit' | 'reset';

type PasswordVisibility = {
  login: boolean;
  signup: boolean;
  edit: boolean;
  reset: boolean;
};

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

type FileContent = {
  id: string;
  name: string;
  path: string;
  content_type: string;
  size: number;
  parent_id: string;
  hash: string;
  data: string;
};

type BlogPage = {
  url: string;
  title: string;
  description: string;
};

type BlogPageCard = {
  name: string;
  bestFor: string;
  platform: string;
  pricing: string;
  description: string;
  url: string;
};

type StoryNode = {
  season?: number;
  title: string | undefined;
  description: string;
  video_url: string;
  endTimestamp: number;
  ended: boolean;
  votes_options: {
    option: string;
    class?: string;
  }[];
  vote?: number;
  episode?: number;
  memory?: number;
};

type Attribute = {
  name: string;
  value: number;
};

type OnchainAttribute = {
  label: string;
  type: 'string';
  trait_type: string;
  value: string;
};

type NavItem = {
  name: string;
  link?: string;
  action?: () => void;
};

type NavContext = {
  items: NavItem[];
  index: number;
};

type DashboardPathLink = {
  name: string;
  path: string;
  display?: () => boolean;
  children?: never;
};

type DashboardParentLinkDisplay = 'all' | 'admin' | 'creator';

// A "parent" link — has children, no path
type DashboardParentLink = {
  name: string;
  intended: DashboardParentLinkDisplay;
  children: Linking[];
  display?: () => boolean;
  path?: never;
};

type Linking = DashboardPathLink | DashboardParentLink;