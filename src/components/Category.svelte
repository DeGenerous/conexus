<script lang="ts">
  import { onMount } from 'svelte';

  import SpotifyIframe from '@components/music/SpotifyIframe.svelte';
  import Links from '@components/utils/Links.svelte';
  import SearchAndGenre from '@components/utils/SearchAndGenre.svelte';
  import StoryCollection from '@components/utils/StoryCollection.svelte';
  import StoryTile from '@components/utils/StoryTile.svelte';
  import { CoNexusApp } from '@lib/view';
  import { checkUserState, checkWeb3LoginState } from '@utils/route-guard';
  import { web3LoggedIn } from '@stores/account';

  let app: CoNexusApp = new CoNexusApp();

  export let section: string;

  let isWeb3LoggedIn: boolean = false;

  let categories: CategoriesInSection[] = [];

  let page: number = 1;
  let pageSize: number = 1;
  let loading: boolean = false;
  let allLoaded: boolean = false; // Prevent further requests when empty response
  let showNoCategoriesMessage: boolean = false;

  const fetchCategories = async () => {
    if (!section || loading || allLoaded) return;
    loading = true;

    const response = await app.getSectionCategories(section, page, pageSize);

    if (response && response.length > 0) {
      setTimeout(() => {
        categories = [...categories, ...response];
        loading = false;
      }, 600); // Simulate loading delay
      showNoCategoriesMessage = false; // Hide message if categories are found
      page++; // Move to the next page
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

      await fetchCategories();

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

  $: {
    if (categories.length > 0) {
      setTimeout(observeLastCategory, 500);

      const sectionTopics = categories
        .flatMap((cat) => cat.topics)
        .sort((a, b) => a.topic_order - b.topic_order);

      localStorage.setItem(
        `${section} topics`,
        JSON.stringify(
          sectionTopics.map((topic) => ({
            order: topic.topic_order,
            id: topic.topic_id,
            name: topic.topic_name,
          })),
        ),
      );
    }
  }

  const searchSectionTopics = async (search_filed: string) => {
    return await app.searchSectionCategories(
      section,
      search_filed.replace(/[^a-zA-Z ]/g, ''),
    );
  };

  const getGenreTopics = async (genre: string) => {
    return await app.getGenreTopics(section, genre);
  };

  let filteredTopics: TopicInCategory[] = [];
</script>

<SearchAndGenre
  bind:filteredTopics
  getGenres={app.getGenres}
  {getGenreTopics}
  {searchSectionTopics}
/>

<section class="categories-container" on:scroll={handleScroll}>
  {#if filteredTopics.length > 0}
    {#each filteredTopics as topic}
      <StoryTile {section} bind:topic bind:loading />
    {/each}
  {:else}
    {#if categories.length === 0 && !loading && !showNoCategoriesMessage}
      <h3>Loading categories...</h3>
    {/if}

    {#if categories.length > 0}
      {#each categories as category (category.name)}
        <div class="category">
          <StoryCollection {category} {section} />
        </div>
      {/each}

      {#if loading}
        <h3>Loading more categories...</h3>
      {:else if allLoaded && !loading}
        <h3>No more categories available.</h3>
      {/if}
    {:else if showNoCategoriesMessage}
      <h3>No categories found for this section.</h3>
    {:else}
      <StoryCollection {section} category={null} />
    {/if}
  {/if}
</section>

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
