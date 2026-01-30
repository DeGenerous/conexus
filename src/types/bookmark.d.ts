/**
 * Bookmark types.
 * Saved topic bookmarks organized into folders with optional notes.
 */

/** A bookmarked topic with optional folder assignment and note. */
type Bookmark = {
  id?: string;
  bookmark_folder_id?: string;
  topic_id: string;
  note?: string;
  sort_order?: number;
} & DashboardTopic;

/** Named tag used for bookmark categorization. */
type BookmarkTag = {
  id?: string;
  name: string;
};

/** Folder that groups bookmarks, extends BookmarkTag with ordering. */
type BookmarkFolder = {
  sort_order?: number;
} & BookmarkTag;
