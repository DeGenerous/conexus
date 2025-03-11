/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type TopicInCategoryInSection = {
  name: string;
  order: number;
  available: boolean;
  genres?: string;
  category_id?: number;
};

type CategoryInSection = {
  name: string;
  order: number;
  topics: TopicInCategoryInSection[];
  created_at?: Date;
};
