<script lang="ts">
  import { onMount } from 'svelte';

  import CoNexusApp from '@lib/view';
  import { blankImage, serveUrl } from '@constants/media';
  import { resolveRenderableImage } from '@utils/file-validation';

  import Category from '@components/Category.svelte';
  import PullToRefresh from '@components/utils/PullToRefresh.svelte';
  import SearchAndGenre from '@components/Filters.svelte';
  import SpotifyIframe from '@components/music/SpotifyIframe.svelte';
  import Links from '@components/utils/Links.svelte';

  let {
    name,
    intended,
  }: {
    name: string;
    intended: 's' | 'c'; // section or creator
  } = $props();

  let app: CoNexusApp = new CoNexusApp();

  let currExplorerId = $state<string>('');

  let explorer = $state<Explorer | null>(null);
  let sections = $state<Section[]>([]);
  let categories = $state<SectionCategoryTopics[]>([]);
  let genres = $state<Genre[]>([]);

  let pageSize = $state<number>(1);
  let loading = $state<boolean>(false);
  let allLoaded = $state<boolean>(false); // Prevent further requests when empty response
  let showNoCategoriesMessage = $state<boolean>(false);
  let hydrated = $state<boolean>(false);
  let filtersResetKey = $state<number>(0);

  let explorerImage = $state<string>(blankImage);
  let categoriesContainer = $state<HTMLElement | undefined>();

  // Prefetch explorer portrait and swap to placeholder on failure
  $effect(() => {
    const currentExplorer = explorer;
    if (!currentExplorer) {
      explorerImage = blankImage;
      return;
    }

    const candidate = currentExplorer.avatar_file_id
      ? serveUrl(currentExplorer.avatar_file_id)
      : currentExplorer.avatar_url
        ? currentExplorer.avatar_url
        : blankImage;

    let cancelled = false;

    explorerImage = candidate;

    (async () => {
      const safe = await resolveRenderableImage(candidate);
      if (!cancelled) explorerImage = safe;
    })();

    return () => {
      cancelled = true;
    };
  });

  // incremental loader; each call pulls the next page and appends while respecting the cache for sections
  const fetchCategories = async (refresh = false) => {
    if (!name || loading || allLoaded) return;
    loading = true;

    let response: SectionCategoryTopics[] = [];

    switch (intended) {
      case 's':
        response = await app.getSectionCategoryTopics(
          name,
          categories.length + 1,
          pageSize,
          refresh,
        );
        break;
      case 'c':
        response = await app.getCreatorCategoryTopics(
          currExplorerId,
          categories.length + 1,
          pageSize,
          refresh,
        );
        break;
      default:
        console.error('Invalid intended type:', intended);
        loading = false;
        return;
    }

    if (response && response.length > 0) {
      setTimeout(() => {
        categories = [...categories, ...response];
        loading = false;
      }, 150); // Simulate loading delay
      showNoCategoriesMessage = false; // Hide message if categories are found
    } else {
      allLoaded = true; // Stop fetching more categories
      loading = false;
    }
  };

  const hydrateSection = async (refresh = false) => {
    try {
      observer?.disconnect();
      hydrated = false;
      categories = [];
      allLoaded = false;
      showNoCategoriesMessage = false;
      loading = false;
      filtersResetKey += 1;
      if (categoriesContainer) categoriesContainer.scrollTo({ top: 0 });

      if (intended === 's') {
        explorer = (await app.getSection(name)) as Explorer;
      } else if (intended === 'c') {
        explorer = (await app.getCreator(name)) as Explorer;
      }

      if (!explorer || !explorer.id) {
        window.location.href = '/404';
        return;
      }

      currExplorerId = explorer.id;

      await fetchCategories(refresh);

      const data = await app.getGenres(refresh);
      genres = data.sort((a, b) => a.name.localeCompare(b.name));
      hydrated = true;

      // Fallback message if no categories found
      setTimeout(() => {
        if (categories.length === 0) {
          showNoCategoriesMessage = true;
        }
      }, 2000);
    } catch (error) {
      console.error('Error loading section:', error);
    }
  };

  onMount(async () => {
    try {
      await hydrateSection();
      // If intended === 'c', you can later add creator-specific setup here
    } catch (error) {
      console.error('Error on mount:', error);
    }
  });

  // delegate search/genre filtering to the view API while keeping the same signature for both explorer types
  const getTopics = async (
    text: string,
    which: 'search' | 'genre',
    page: number = 1,
    pageSize: number = 10,
    sort_order: TopicSortOrder = 'name',
  ) => {
    switch (which) {
      case 'search':
        return await app.searchCategories(
          currExplorerId,
          text.replace(/[^a-zA-Z ]/g, ''),
          sort_order,
          page,
          pageSize,
          intended,
        );
      case 'genre':
        const genre = genres.find((g) => g.name === text);
        if (!genre || !genre.id) return [];

        return await app.getGenreTopics(
          currExplorerId,
          genre.id,
          page,
          pageSize,
          sort_order,
          intended,
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
  $effect(() => {
    if (hydrated && categories.length > 0) setTimeout(observeLastCategory, 500);
  });

  const refreshSection = async () => {
    await hydrateSection(true);
  };
</script>

<PullToRefresh refresh={refreshSection}>
  {#if intended === 'c' && explorer}
    <div class="explorer-bio flex pad-inline">
      {#if explorerImage !== blankImage}
        <img class="pfp round" src={explorerImage} alt="Creator PFP" />
      {/if}
      <h3>{explorer.username}</h3>
      <p>{explorer.avatar_bio}</p>
    </div>
  {/if}

  {#key filtersResetKey}
    <SearchAndGenre {name} {intended} {genres} {getTopics} {categories} />
  {/key}

  <section class="flex" bind:this={categoriesContainer} onscroll={handleScroll}>
    {#if categories.length > 0}
      {#each categories as category (category.id)}
        <div class="category flex">
          <Category {name} {intended} {category} />
        </div>
      {/each}

      {#if loading}
        <h5>Loading more categories...</h5>
      {/if}
    {:else if showNoCategoriesMessage}
      <h5>No created stories found</h5>
    {:else}
      <Category {name} {intended} category={null} />
    {/if}
  </section>

  {#if categories.length === 0 && !loading && !showNoCategoriesMessage}
    <h5>Loading categories...</h5>
  {/if}

  {#if intended === 's' && name === 'Dischordian Saga'}
    <SpotifyIframe />
  {/if}

  <Links section_name={name} />
</PullToRefresh>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .pfp {
    @include gray-border;

    @include respond-up(tablet) {
      width: 20rem;
    }
  }
</style>
