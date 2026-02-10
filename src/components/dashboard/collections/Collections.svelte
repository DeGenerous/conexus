<script lang="ts">
  import { onMount } from 'svelte';

  import { dndzone, type DndEvent } from 'svelte-dnd-action';

  import Topics from '@lib/topics';
  import CategoryView from '@lib/category';
  import { toastStore } from '@stores/toast.svelte';
  import { getCurrentUser } from '@utils/route-guard';
  import { isAdmin, isPlayer } from '@stores/account.svelte';
  import { modal } from '@lib/modal-manager.svelte';
  import { NAV_ROUTES } from '@constants/routes';

  import CategoryBlock from '@components/dashboard/collections/CategoryBlock.svelte';
  import PullToRefresh from '@components/utils/PullToRefresh.svelte';

  const topicManager = new Topics();
  const categoryManager = new CategoryView();

  let userID = $state<string>('');
  const pageSize = 10;

  // Section / creator lists (admin only)
  let sections = $state<CollectionSection[]>([]);
  let creators = $state<CollectionCreator[]>([]);
  let topicsRefreshToken = $state(0);
  let adminToggle = $state<'sections' | 'creators'>('sections');

  // Active entity selection (which section/creator is showing categories)
  let activeEntityId = $state<string>('');

  // Category pagination state (single set — only one entity visible at a time)
  type DraggableCategory = CollectionCategory & { id: string };
  let categoryPage = $state<number>(1);
  let categoryFetching = $state<boolean>(false);
  let categoryAllLoaded = $state<boolean>(false);
  let activeCategoryItems = $state<DraggableCategory[]>([]);
  let activeSourceCategories = $state<CollectionCategory[]>([]);
  let isReordering = $state<boolean>(false);
  let fetchGeneration = $state<number>(0);

  // IntersectionObserver for infinite scroll
  let sentinel = $state<HTMLDivElement | null>(null);
  let observer: IntersectionObserver | null = null;

  // Drag policy
  let disableDragInteractions = $state(false);
  let detachPointerChange: Nullable<() => void> = null;
  let detachResizeListener: Nullable<() => void> = null;

  // Derived: active entity's total category count (for maxCategoryOrder)
  let activeEntityCategoryCount = $derived.by(() => {
    if (!$isAdmin) return activeCategoryItems.length;
    if (adminToggle === 'sections') {
      return (
        sections.find((s) => s.section_id === activeEntityId)?.category_count ??
        activeCategoryItems.length
      );
    }
    return (
      creators.find((c) => c.creator_id === activeEntityId)?.category_count ??
      activeCategoryItems.length
    );
  });

  // Derived: whether we're in "creator" mode (for CategoryBlock prop)
  let isCreatorMode = $derived(!$isAdmin || adminToggle === 'creators');

  // Derived: the persist mode for category order updates
  let persistMode = $derived<'sections' | 'creators'>(
    $isAdmin && adminToggle === 'sections' ? 'sections' : 'creators',
  );

  const bumpTopicsRefresh = () => {
    topicsRefreshToken += 1;
  };
  const handleTopicMutated = () => bumpTopicsRefresh();

  // --- Lifecycle ---

  onMount(() => {
    startDragPolicyWatchers();

    if ($isAdmin) {
      loadAdminCollections();
    } else if ($isPlayer) {
      loadPlayerCollections();
    }

    return () => {
      observer?.disconnect();
      detachPointerChange?.();
      detachPointerChange = null;
      detachResizeListener?.();
      detachResizeListener = null;
    };
  });

  // Reconnect observer when sentinel or items change
  $effect(() => {
    if (!sentinel) return;

    if (activeCategoryItems.length > 0 && !categoryAllLoaded) {
      observer?.disconnect();

      observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !categoryFetching && !categoryAllLoaded) {
          fetchCategoryPage();
        }
      });

      observer.observe(sentinel);
    } else {
      observer?.disconnect();
    }
  });

  // --- Drag policy ---

  const evaluateDragPolicy = () => {
    if (typeof window === 'undefined') return;
    const pointerMatches =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: coarse)').matches;
    const widthMatches = window.innerWidth < 768;
    disableDragInteractions = pointerMatches || widthMatches;
  };

  const startDragPolicyWatchers = () => {
    if (typeof window === 'undefined') return;
    evaluateDragPolicy();

    const pointerQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(pointer: coarse)')
        : null;
    const handlePointerChange = () => evaluateDragPolicy();
    if (pointerQuery) {
      if (typeof pointerQuery.addEventListener === 'function') {
        pointerQuery.addEventListener('change', handlePointerChange);
        detachPointerChange = () =>
          pointerQuery.removeEventListener('change', handlePointerChange);
      } else {
        pointerQuery.addListener(handlePointerChange);
        detachPointerChange = () =>
          pointerQuery.removeListener(handlePointerChange);
      }
    }

    const handleResize = () => evaluateDragPolicy();
    window.addEventListener('resize', handleResize);
    detachResizeListener = () =>
      window.removeEventListener('resize', handleResize);
  };

  // --- Entity selection ---

  async function selectEntity(entityId: string) {
    if (entityId === activeEntityId) return;

    observer?.disconnect();

    activeEntityId = entityId;
    categoryPage = 1;
    categoryAllLoaded = false;
    categoryFetching = false;
    activeCategoryItems = [];
    activeSourceCategories = [];

    await fetchCategoryPage();
  }

  // --- Data fetching ---

  async function ensureUserIdentifier(refresh = false): Promise<string> {
    if (!userID || refresh) {
      const user = await getCurrentUser(refresh);
      userID = user?.id ?? '';
    }
    return userID;
  }

  function createCategoryItems(
    categories: CollectionCategory[] = [],
  ): DraggableCategory[] {
    return categories.map((category) => ({
      ...category,
      id: category.category_id,
    }));
  }

  async function fetchCategoryPage(refresh = false) {
    if (categoryFetching || categoryAllLoaded) return;

    const entityId = $isAdmin ? activeEntityId : userID;
    if (!entityId) return;

    categoryFetching = true;
    const gen = ++fetchGeneration;

    try {
      let batch: CollectionCategory[] | null = null;

      if ($isAdmin && adminToggle === 'sections') {
        batch = await topicManager.getSectionCategoryCollection(
          entityId,
          categoryPage,
          pageSize,
          refresh,
        );
      } else {
        batch = await topicManager.getCreatorCategoryCollection(
          entityId,
          categoryPage,
          pageSize,
          refresh,
        );
      }

      // Discard stale responses (entity changed while request was in-flight)
      if (gen !== fetchGeneration) return;

      if (!batch || batch.length === 0) {
        categoryAllLoaded = true;
        return;
      }

      const newItems = createCategoryItems(batch);

      if (categoryPage === 1) {
        activeCategoryItems = newItems;
        activeSourceCategories = [...batch];
      } else {
        activeCategoryItems = [...activeCategoryItems, ...newItems];
        activeSourceCategories = [...activeSourceCategories, ...batch];
      }

      categoryPage += 1;

      if (batch.length < pageSize) {
        categoryAllLoaded = true;
      }
    } finally {
      if (gen === fetchGeneration) {
        categoryFetching = false;
      }
    }
  }

  async function loadAdminCollections(refresh = false) {
    const [sectionData, creatorData] = await Promise.all([
      topicManager.getSectionCollection(1, pageSize, refresh),
      topicManager.getCreatorCollection(1, pageSize, refresh),
    ]);

    sections = sectionData ?? [];
    creators = creatorData ?? [];

    // Determine which entity to select
    const targetIds =
      adminToggle === 'sections'
        ? sections.map((s) => s.section_id)
        : creators.map((c) => c.creator_id);

    // Keep current selection if still valid, otherwise select first
    const currentStillValid =
      activeEntityId && targetIds.includes(activeEntityId);
    const targetId = currentStillValid ? activeEntityId : targetIds[0];

    if (targetId) {
      if (currentStillValid && refresh) {
        await refreshActiveEntityCategories();
      } else {
        activeEntityId = '';
        await selectEntity(targetId);
      }
    }

    if (refresh) bumpTopicsRefresh();
  }

  async function loadPlayerCollections(refresh = false) {
    const id = await ensureUserIdentifier(refresh);
    if (!id) return;

    if (refresh) {
      categoryPage = 1;
      categoryAllLoaded = false;
      activeCategoryItems = [];
      activeSourceCategories = [];
    }

    await fetchCategoryPage(refresh);
    if (refresh) bumpTopicsRefresh();
  }

  // --- Refresh ---

  const refreshCollections = async () => {
    if ($isAdmin) {
      await loadAdminCollections(true);
    } else if ($isPlayer) {
      await loadPlayerCollections(true);
    }
  };

  async function refreshActiveEntityCategories() {
    observer?.disconnect();
    categoryPage = 1;
    categoryAllLoaded = false;
    activeCategoryItems = [];
    activeSourceCategories = [];
    await fetchCategoryPage(true);
  }

  // --- Admin toggle handler ---

  async function switchAdminToggle(toggle: 'sections' | 'creators') {
    if (toggle === adminToggle) return;
    adminToggle = toggle;

    observer?.disconnect();
    activeEntityId = '';
    activeCategoryItems = [];
    activeSourceCategories = [];
    categoryPage = 1;
    categoryAllLoaded = false;

    const targetId =
      toggle === 'sections' ? sections[0]?.section_id : creators[0]?.creator_id;

    if (targetId) {
      await selectEntity(targetId);
    }
  }

  // --- DnD handlers (unified) ---

  function handleCategoryConsider(
    event: CustomEvent<DndEvent<DraggableCategory>>,
  ) {
    if (isReordering) return;
    activeCategoryItems = event.detail.items as DraggableCategory[];
  }

  async function handleCategoryFinalize(
    event: CustomEvent<DndEvent<DraggableCategory>>,
  ) {
    if (isReordering) return;

    const previousCategories = activeSourceCategories.map((c) => ({ ...c }));

    const updated = event.detail.items.map((item, index) => ({
      ...item,
      category_order: index + 1,
    }));

    activeCategoryItems = updated;
    activeSourceCategories = updated.map(({ id, ...rest }) => ({ ...rest }));

    const updates = diffCategoryOrders(previousCategories, updated);

    await persistCategoryOrder(updates);
  }

  // --- Manual order handler (unified) ---

  async function handleManualCategoryOrder(
    categoryId: string,
    requestedOrder: number,
  ) {
    if (isReordering) return;

    // If the requested order exceeds loaded items, do an API-only persist
    if (requestedOrder > activeCategoryItems.length) {
      await persistCategoryOrder([
        { category_id: categoryId, order: requestedOrder },
      ]);
      return;
    }

    const previousCategories = activeSourceCategories.map((c) => ({ ...c }));
    const updated = reorderCategoryList(
      activeCategoryItems,
      categoryId,
      requestedOrder,
    );
    if (!updated) return;

    activeCategoryItems = updated;
    activeSourceCategories = updated.map(({ id, ...rest }) => ({ ...rest }));

    const updates = diffCategoryOrders(previousCategories, updated);
    if (updates.length === 0) return;

    await persistCategoryOrder(updates);
  }

  // --- Reorder utilities ---

  function reorderCategoryList(
    items: DraggableCategory[],
    categoryId: string,
    requestedOrder: number,
  ): DraggableCategory[] | null {
    if (!items || items.length === 0) return null;
    const currentIndex = items.findIndex(
      (category) => category.category_id === categoryId,
    );
    if (currentIndex === -1) return null;

    const clampedOrder = Math.min(
      Math.max(Math.round(requestedOrder), 1),
      items.length,
    );
    if (currentIndex === clampedOrder - 1) return null;

    const working = items.map((category) => ({ ...category }));
    const [moved] = working.splice(currentIndex, 1);
    working.splice(clampedOrder - 1, 0, moved);

    return working.map((category, index) => ({
      ...category,
      category_order: index + 1,
    }));
  }

  function diffCategoryOrders(
    previous: CollectionCategory[],
    updated: DraggableCategory[],
  ) {
    return updated
      .map(({ category_id, category_order }) => {
        const previousOrder = previous.find(
          (category) => category.category_id === category_id,
        )?.category_order;
        return { category_id, order: category_order, previousOrder };
      })
      .filter(
        ({ order, previousOrder }) =>
          previousOrder === undefined || order !== previousOrder,
      )
      .map(({ category_id, order }) => ({ category_id, order }));
  }

  async function persistCategoryOrder(
    updates: { category_id: string; order: number }[],
  ) {
    if (updates.length === 0 || isReordering) return;

    isReordering = true;
    let success = true;

    try {
      for (const { category_id, order } of updates) {
        const result =
          persistMode === 'sections'
            ? await categoryManager.updateAdminCategoryOrder(
                category_id,
                order,
                { silent: true },
              )
            : await categoryManager.updateCreatorCategoryOrder(
                category_id,
                order,
                { silent: true },
              );

        if (!result) {
          success = false;
          break;
        }
      }
    } finally {
      isReordering = false;
    }

    if (!success) {
      await refreshActiveEntityCategories();
      return;
    }

    toastStore.show('Category order updated', 'info');
    await refreshActiveEntityCategories();
  }
</script>

<PullToRefresh refresh={refreshCollections}>
  <!-- Admin collections management -->
  {#if $isAdmin}
    <div class="dream-container">
      <div class="flex-row">
        <h4>Scope</h4>
        <div class="container">
          <button
            class="void-btn dream-radio-btn"
            class:active={adminToggle === 'sections'}
            onclick={() => switchAdminToggle('sections')}
          >
            Sections
          </button>
          <button
            class="void-btn dream-radio-btn"
            class:active={adminToggle === 'creators'}
            onclick={() => switchAdminToggle('creators')}
          >
            Creators
          </button>
        </div>
      </div>

      <!-- Entity selector -->
      {#if adminToggle === 'sections' && sections.length > 0}
        <span class="flex-row">
          <label for="section-select">Section</label>
          <select
            id="section-select"
            value={activeEntityId}
            onchange={(e) =>
              selectEntity((e.target as HTMLSelectElement).value)}
            disabled={categoryFetching && activeCategoryItems.length === 0}
          >
            {#each sections as section}
              <option value={section.section_id}>
                {section.section_name} ({section.category_count})
              </option>
            {/each}
          </select>
        </span>
      {:else if adminToggle === 'creators' && creators.length > 0}
        <span class="flex-row">
          <label for="creator-select">Creator</label>
          <select
            id="creator-select"
            value={activeEntityId}
            onchange={(e) =>
              selectEntity((e.target as HTMLSelectElement).value)}
            disabled={categoryFetching && activeCategoryItems.length === 0}
          >
            {#each creators as creator}
              <option value={creator.creator_id}>
                {creator.creator_name} ({creator.category_count})
              </option>
            {/each}
          </select>
        </span>
      {/if}
    </div>

    <!-- Category list for the active entity -->
    {#if activeCategoryItems.length > 0}
      <div
        class="category-dnd-zone flex"
        class:reordering={isReordering}
        aria-busy={isReordering}
        use:dndzone={{
          items: activeCategoryItems,
          type: `categories-${activeEntityId}`,
          dropFromOthersDisabled: true,
          dragDisabled: disableDragInteractions || isReordering,
        }}
        onconsider={handleCategoryConsider}
        onfinalize={handleCategoryFinalize}
      >
        {#each activeCategoryItems as category (category.id)}
          <div class="category-draggable">
            <CategoryBlock
              {category}
              {topicManager}
              {topicsRefreshToken}
              disableDrag={disableDragInteractions}
              categoryOrderDisabled={isReordering}
              maxCategoryOrder={Math.max(1, activeEntityCategoryCount)}
              requestGlobalRefresh={refreshCollections}
              onManualCategoryOrderChange={(order) =>
                handleManualCategoryOrder(category.category_id, order)}
              onTopicMutated={handleTopicMutated}
              creator={isCreatorMode}
            />
          </div>
        {/each}
      </div>
    {:else if !categoryFetching && activeEntityId}
      <p class="validation">No story categories found</p>
    {:else if !activeEntityId}
      <p class="validation">
        {adminToggle === 'sections' ? 'No sections found' : 'No creators found'}
      </p>
    {/if}

    {#if categoryFetching}
      <p class="validation transparent-white-txt">Loading categories…</p>
    {/if}

    <div bind:this={sentinel} aria-hidden="true"></div>
  {/if}

  <!-- Creator-only category management -->
  {#if $isPlayer && !$isAdmin}
    {#if activeCategoryItems.length > 0}
      <div
        class="category-dnd-zone flex"
        class:reordering={isReordering}
        aria-busy={isReordering}
        use:dndzone={{
          items: activeCategoryItems,
          type: 'creator-categories-self',
          dropFromOthersDisabled: true,
          dragDisabled: disableDragInteractions || isReordering,
        }}
        onconsider={handleCategoryConsider}
        onfinalize={handleCategoryFinalize}
      >
        {#each activeCategoryItems as category (category.id)}
          <div class="category-draggable">
            <CategoryBlock
              {category}
              {topicManager}
              {topicsRefreshToken}
              disableDrag={disableDragInteractions}
              categoryOrderDisabled={isReordering}
              maxCategoryOrder={Math.max(1, activeCategoryItems.length)}
              requestGlobalRefresh={refreshCollections}
              onManualCategoryOrderChange={(order) =>
                handleManualCategoryOrder(category.category_id, order)}
              onTopicMutated={handleTopicMutated}
              creator={true}
            />
          </div>
        {/each}
      </div>
    {:else if !categoryFetching}
      <p class="validation">No story categories found, pull down to refresh</p>
      <button class="cta" onclick={() => modal.categoryManager()}>
        Create your first story category
      </button>
    {/if}

    {#if categoryFetching}
      <p class="validation transparent-white-txt">Loading categories…</p>
    {/if}

    <div bind:this={sentinel} aria-hidden="true"></div>
  {/if}

  <nav class="dream-container">
    <p class="soft-white-txt">
      Stories are created on the Dream page. Use categories here to organize
      them.
    </p>
    <span class="flex-row flex-wrap">
      <a class="button-anchor green-btn" href={NAV_ROUTES.DREAM}>
        Create Story
      </a>
      <button onclick={() => modal.categoryManager()}>
        Manage Categories
      </button>
    </span>
  </nav>
</PullToRefresh>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .category-dnd-zone {
    width: calc(100% + 3rem);
    margin-inline: -1.5rem;
    flex-flow: column nowrap;

    &.reordering {
      pointer-events: none;
      opacity: 0.75;
    }
  }

  .category-draggable {
    width: 100%;
  }
</style>
