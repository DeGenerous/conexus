/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type Bookmark = {
  bookmark_folder_id: string;
  topic_id: string;
  note?: string;
  sort_order?: number;
} & DashboardTopic;

type BookmarkTag = {
    name: string;
}

type BookmarkFolder = {
    sort_order?: number;
} & BookmarkTag;