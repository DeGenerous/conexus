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
  name: string;
  tile_image1?: string;
  tile_image2?: string;
};

type Genre = {
  id: number;
  name: string;
};

type SectionCategory = {
  name: string;
  order: number;
  topics: {
    name: string;
    order: number;
    available: boolean;
    title_image1?: string;
    title_image2?: string;
    created_at?: Date;
  }[];
  created_at?: Date;
};

type SectionTopic = {
  name: string;
  image_prompt?: string;
  description?: string;
  description_image?: string;
  genres?: string;
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
}

type FileContent = {
  id: string;
  name: string;
  path: string;
  content_type: string;
  size: number;
  parent_id: string;
  hash: string;
  data: string;
}
