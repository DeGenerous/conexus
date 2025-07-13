import { writable } from 'svelte/store';

export const prevStory = $state<StoryNavigation>({
  link: null,
  name: null,
});

export const nextStory = $state<StoryNavigation>({
  link: null,
  name: null,
});

export const highlightCommunityPicks = writable<boolean>(false);
