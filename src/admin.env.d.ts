/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type CollectionTopic = {
  topic_id: number;
  prompt_id: number;
  topic_name: string;
  order: number;
  genres: string;
  available: string;
};

type Collection = {
  section_id: number;
  section_name: string;
  category_id: number;
  category_name: string;
  category_order: number;
  topics: CollectionTopic[];
};

type MediaType =
  | 'background'
  | 'description'
  | 'tile'
  | 'audio'
  | 'video'
  | 'document';

type ThumbnailTopic = {
  id: number;
  name: string;
  genres: string;
  description: string;
};

type ViewTopic = {
  id: number;
  category_id: number;
  image_prompt: string;
  prompt_id: number;
  prompt: string;
  media_folder_id?: string;
  available: string;
} & ThumbnailTopic;
