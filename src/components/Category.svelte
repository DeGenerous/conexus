<script lang="ts">
  import { onMount } from 'svelte';

  import SpotifyIframe from '@components/music/SpotifyIframe.svelte';
  import Links from '@components/utils/Links.svelte';
  import SearchAndGenre from '@components/utils/SearchAndGenre.svelte';
  import StoryCollection from '@components/utils/StoryCollection.svelte';
  import { CoNexusApp } from '@lib/view';
  import { checkUserState, checkWeb3LoginState } from '@utils/route-guard';
  import { web3LoggedIn } from '@stores/account';
  import {
    SetCache,
    GetCache,
    SECTION_CATEGORIES_KEY,
    SECTION_CATEGORIES_TTL
  } from '@constants/cache';

  let app: CoNexusApp = new CoNexusApp();

  export let section: string;

  let isWeb3LoggedIn: boolean = false;

  let categories: CategoriesInSection[] = [];
  let genres: Genre[] = [];

  let pageSize: number = 1;
  let loading: boolean = false;
  let allLoaded: boolean = false; // Prevent further requests when empty response
  let showNoCategoriesMessage: boolean = false;

  const fetchCategories = async () => {
    if (!section || loading || allLoaded) return;
    loading = true;

    const response = await app.getSectionCategories(section, categories.length + 1, pageSize);

    if (response && response.length > 0) {
      setTimeout(() => {
        categories = [...categories, ...response];
        SetCache(
          SECTION_CATEGORIES_KEY(section),
          JSON.stringify(categories.map((cat) => {
            const orderedTopics = cat.topics.sort((a, b) => {
              if (a.topic_order > b.topic_order) return 1;
              if (a.topic_order < b.topic_order) return -1;
              return 0;
            })
            cat.topics = orderedTopics;
            return cat;
          })),
          SECTION_CATEGORIES_TTL
        )
        loading = false;
      }, 600); // Simulate loading delay
      showNoCategoriesMessage = false; // Hide message if categories are found
    } else {
      allLoaded = true; // Stop fetching more categories
      loading = false;
    }
  };

  let observer: IntersectionObserver;

  onMount(async () => {
    try {
      await checkUserState(`/${section}`);

      const unsubscribe = web3LoggedIn.subscribe((value) => {
        isWeb3LoggedIn = value;
        checkWeb3LoginState(isWeb3LoggedIn, section);
      });

      const sections = await app.getSections();
      if (!sections.some(({ name }) => name === section)) {
        window.location.href = '/404';
        return;
      }

      const cachedCategories: Nullable<string> = GetCache(SECTION_CATEGORIES_KEY(section));
      if (cachedCategories) categories = JSON.parse(cachedCategories);
      else await fetchCategories();

      console.log(categories)

      genres = await app.getGenres();
      
      // If no categories after 2 seconds, show "No categories found"
      setTimeout(() => {
        if (categories.length === 0) {
          showNoCategoriesMessage = true;
        }
      }, 2000);

      unsubscribe();
    } catch (error) {
      console.error('Error in onMount:', error);
    }
  });

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

  $: if (categories.length > 0) setTimeout(observeLastCategory, 500);

  const getTopics = async (
    text: string,
    which: 'search' | 'genre',
    page: number = 1,
    pageSize: number = 5,
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
</script>

<SearchAndGenre {section} {genres} {getTopics} {categories} />

<section class="categories-container" on:scroll={handleScroll}>
  {#if categories.length > 0}
    {#each categories as category (category.name)}
      <div class="category">
        <StoryCollection {section} {category} />
      </div>
    {/each}

    {#if loading}
      <h3>Loading more categories...</h3>
    {/if}
  {:else if showNoCategoriesMessage}
    <h3>No categories found for this section.</h3>
  {:else}
    <StoryCollection {section} category={null} />
  {/if}
</section>

{#if categories.length === 0 && !loading && !showNoCategoriesMessage}
  <h3>Loading categories...</h3>
{/if}

{#if section === 'Dischordian Saga'}
  <SpotifyIframe />
{/if}

<Links {section} />

<style>
  .categories-container {
    width: 100vw;
    display: flex;
    flex-flow: column nowrap;
    gap: 2vw;
    scroll-behavior: smooth;
  }

  h3 {
    color: rgba(51, 226, 230, 0.75);
    text-shadow: 0 0.25vw 0.25vw #010020;
  }

  @media only screen and (max-width: 600px) {
    .categories-container {
      gap: 1em;
    }
  }
</style>
