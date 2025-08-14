/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type Bookmark = {
  id?: string;
  bookmark_folder_id: string;
  topic_id: string;
  note?: string;
  sort_order?: number;
} & DashboardTopic;

type BookmarkTag = {
  id?: string;
  name: string;
};

type BookmarkFolder = {
  sort_order?: number;
} & BookmarkTag;
