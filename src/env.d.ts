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
  message: string; // User-facing error message
  details?: string; // Developer debug info (optional)
};

type APIResponse<T> = {
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
  topic_id: number;
  category: string;
  created?: string;
};

type Topic = {
  name: string;
  available: boolean;
};

type Category = {
  name: string;
  topics: Topic[];
};

type CategoryView = {
  id: number;
  name: string;
};

type StepData = {
  step: number;
  title?: string;
  story: string;
  end: boolean;
  summary: string;
  trait: string;
  trait_description?: string;
  options: string[];
  image?: string;
  image_type?: ImageType;
  choice?: number;
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
  id: number;
  name: string;
  tile_image?: string;
};

type Genre = {
  id: number;
  name: string;
};

type StoryNavigation = {
  link: Nullable<string>;
  name: Nullable<string>;
};

type Password = 'login' | 'signup' | 'edit' | 'reset';

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
