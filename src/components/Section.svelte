<!-- LEGACY SVELTE 3/4 SYNTAX -->
<script lang="ts">
  import { onMount } from 'svelte';

  import CoNexusApp from '@lib/view';
  import {
    SetCache,
    GetCache,
    SECTION_CATEGORIES_KEY,
    TTL_HOUR,
  } from '@constants/cache';

  import Category from '@components/Category.svelte';
  import SearchAndGenre from '@components/Filters.svelte';
  import SpotifyIframe from '@components/music/SpotifyIframe.svelte';
  import Links from '@components/utils/Links.svelte';

  export let section: string;

  let app: CoNexusApp = new CoNexusApp();

  let categories: CategoryInSection[] = [];
  let genres: Genre[] = [];

  let pageSize: number = 1;
  let loading: boolean = false;
  let allLoaded: boolean = false; // Prevent further requests when empty response
  let showNoCategoriesMessage: boolean = false;

  const fetchCategories = async () => {
    if (!section || loading || allLoaded) return;
    loading = true;

    const response = await app.getSectionCategories(
      section,
      categories.length + 1,
      pageSize,
    );

    if (response && response.length > 0) {
      setTimeout(() => {
        categories = [...categories, ...response];
        SetCache(
          SECTION_CATEGORIES_KEY(section),
          categories.map((cat) => {
            const orderedTopics = cat.topics.sort((a, b) => {
              if (a.topic_order > b.topic_order) return 1;
              if (a.topic_order < b.topic_order) return -1;
              return 0;
            });
            cat.topics = orderedTopics;
            return cat;
          }),
          TTL_HOUR,
        );
        loading = false;
      }, 600); // Simulate loading delay
      showNoCategoriesMessage = false; // Hide message if categories are found
    } else {
      allLoaded = true; // Stop fetching more categories
      loading = false;
    }
  };

  onMount(async () => {
    try {
      const sections = await app.getSections();
      if (!sections.some(({ name }) => name === section)) {
        window.location.href = '/404';
        return;
      }

      const cachedCategories = GetCache<CategoryInSection[]>(
        SECTION_CATEGORIES_KEY(section),
      );
      if (cachedCategories) categories = cachedCategories;
      else await fetchCategories();

      await app.getGenres().then((data) => {
        function sortByName(a: Genre, b: Genre) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        }

        genres = data.sort(sortByName);
      });

      // If no categories after 2 seconds, show "No categories found"
      setTimeout(() => {
        if (categories.length === 0) {
          showNoCategoriesMessage = true;
        }
      }, 2000);
    } catch (error) {
      console.error('Error on mount:', error);
    }
  });

  const getTopics = async (
    text: string,
    which: 'search' | 'genre',
    page: number = 1,
    pageSize: number = 10,
    sort_order: TopicSortOrder = 'category',
  ) => {
    switch (which) {
      case 'search':
        return await app.searchSectionCategories(
          section,
          text.replace(/[^a-zA-Z ]/g, ''),
          page,
          pageSize,
          sort_order,
        );
      case 'genre':
        return await app.getGenreTopics(
          section,
          text,
          page,
          pageSize,
          sort_order,
        );
    }
  };

  // INTERSECTION OBSERVER

  let observer: IntersectionObserver;

  const handleScroll = (event: Event) => {
    if (loading || allLoaded) return;

    const target = event.target as HTMLElement;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 50) {
      fetchCategories(); // Fetch more categories when user scrolls near bottom
    }
  };

  const observeLastCategory = () => {
    if (observer) observer.disconnect();

    observer = new IntersectionObserver((entries) => {
      const lastCategory = entries[0];
      if (lastCategory.isIntersecting && !loading && !allLoaded) {
        fetchCategories(); // Load more when last category is visible
      }
    });

    const lastCategoryElement = document.querySelector('.category:last-child');
    if (lastCategoryElement) observer.observe(lastCategoryElement);
  };

  // When 1 or more categories visible - observe the last one
  $: if (categories.length > 0) setTimeout(observeLastCategory, 500);
</script>

<SearchAndGenre {section} {genres} {getTopics} {categories} />

<section class="flex" on:scroll={handleScroll}>
  {#if categories.length > 0}
    {#each categories as category (category.name)}
      <div class="category flex">
        <Category {section} {category} />
      </div>
    {/each}

    {#if loading}
      <h5>Loading more categories...</h5>
    {/if}
  {:else if showNoCategoriesMessage}
    <h5>No categories found for this section.</h5>
  {:else}
    <Category {section} category={null} />
  {/if}
</section>

{#if categories.length === 0 && !loading && !showNoCategoriesMessage}
  <h5>Loading categories...</h5>
{/if}

{#if section === 'Dischordian Saga'}
  <SpotifyIframe />
{/if}

<Links {section} />
