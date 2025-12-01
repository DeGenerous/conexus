<script lang="ts">
  import { onDestroy } from 'svelte';
  import { dndzone, type DndEvent } from 'svelte-dnd-action';
  import { tippy } from 'svelte-tippy';

  import { NAV_ROUTES } from '@constants/routes';
  import Topics from '@lib/topics';
  import { toastStore } from '@stores/toast.svelte';
  import { isAdmin } from '@stores/account.svelte';

  import SelectorSVG from '@components/icons/Selector.svelte';

  const INPUT_DEBOUNCE_MS = 1200;

  let {
    category,
    topicManager,
    topicsRefreshToken = 0,
    onTopicMutated,
    disableDrag = false,
    categoryOrderDisabled = false,
    maxCategoryOrder = 1,
    onManualCategoryOrderChange,
    requestGlobalRefresh,
    creator = false,
  }: {
    category: CollectionCategory;
    topicManager: Topics;
    topicsRefreshToken?: number;
    onTopicMutated?: () => void;
    disableDrag?: boolean;
    categoryOrderDisabled?: boolean;
    maxCategoryOrder?: number;
    onManualCategoryOrderChange?: (order: number) => void;
    requestGlobalRefresh?: () => Promise<void>; // allows parent to force a cache-busting refresh
    creator?: boolean; // whether category belongs to creator
  } = $props();
  // parent passes shared refresh token + notifier so all categories stay in sync

  // Local mirror of the category to support optimistic updates during DnD
  let workingCategory = $state<CollectionCategory>(category);
  let expandedCategories = $state<Set<string>>(new Set());
  let isReordering = $state(false);
  let lastRefreshToken = $state(topicsRefreshToken ?? 0);
  // true when an external mutation happened while collapsed, forcing a reload next open
  let needsForcedRefresh = $state(false);

  type DraggableTopic = CollectionTopic & { id: string };
  const notifyTopicsChanged = () => {
    // inform parent so sibling blocks refresh their copies too
    onTopicMutated?.();
  };

  function createTopicItems(
    topics: CollectionTopic[] = workingCategory.topics ?? [],
  ): DraggableTopic[] {
    return topics.map((topic) => ({
      ...topic,
      id: topic.topic_id,
    }));
  }

  let topicItems = $state<DraggableTopic[]>(createTopicItems());
  let topicOrderDrafts = $state<Record<string, string>>({});
  let categoryOrderDraft = $derived(
    String(workingCategory.category_order ?? 1),
  );
  let categoryOrderTimer: ReturnType<typeof setTimeout> | null = null;
  const topicOrderTimers = new Map<string, ReturnType<typeof setTimeout>>();

  // Shared helper to keep orders within the legal bounds
  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(Math.round(value), min), max);

  // Keep a text-friendly copy of every topic order so inputs stay in sync while typing
  function syncTopicOrderDrafts(
    items: DraggableTopic[] = topicItems,
    force = false,
  ) {
    const next: Record<string, string> = {};
    items.forEach((topic, index) => {
      const fallback = String(topic.order ?? index + 1);
      next[topic.topic_id] =
        !force && topicOrderDrafts[topic.topic_id] !== undefined
          ? topicOrderDrafts[topic.topic_id]
          : fallback;
    });
    topicOrderDrafts = next;
  }

  // Refresh the draggable items array anytime the source topics change
  function syncTopicItems(
    topics: CollectionTopic[] = workingCategory.topics ?? [],
  ) {
    topicItems = createTopicItems(topics);
    syncTopicOrderDrafts(topicItems, true);
  }

  // lazily load topics unless a mutation explicitly asks for fresh data
  async function fetchTopicCollection(
    categoryId: string,
    refresh: boolean = false,
  ) {
    workingCategory.topics = await topicManager.getTopicCollection(
      categoryId,
      1,
      10,
      refresh,
    );
    workingCategory.topic_count = workingCategory.topics?.length ?? 0;
    syncTopicItems(workingCategory.topics ?? []);
    if (refresh) {
      needsForcedRefresh = false;
    }
  }

  // keep a mutable working copy in sync with new props so drag/optimistic edits don't fight parent updates
  $effect(() => {
    const incoming = category;
    const idChanged = workingCategory.category_id !== incoming.category_id;

    if (idChanged) {
      const topics = incoming.topics ?? workingCategory.topics ?? [];
      workingCategory = {
        ...incoming,
        topics,
        topic_count: topics.length || incoming.topic_count,
      };
      syncTopicItems(workingCategory.topics ?? []);
      return;
    }

    const orderChanged =
      workingCategory.category_order !== incoming.category_order;
    const nameChanged =
      workingCategory.category_name !== incoming.category_name;
    const countChanged =
      incoming.topic_count !== undefined &&
      workingCategory.topic_count !== incoming.topic_count;

    if (orderChanged || nameChanged || countChanged) {
      workingCategory = {
        ...workingCategory,
        category_order: incoming.category_order,
        category_name: incoming.category_name,
        topic_count:
          incoming.topic_count ??
          workingCategory.topic_count ??
          workingCategory.topics?.length ??
          0,
      };
    }

    if (incoming.topics && incoming.topics !== workingCategory.topics) {
      workingCategory = {
        ...workingCategory,
        topics: incoming.topics,
        topic_count: incoming.topics.length,
      };
      syncTopicItems(incoming.topics);
    }
  });

  $effect(() => {
    categoryOrderDraft = String(workingCategory.category_order ?? 1);
  });

  // watch for global refresh tokens and keep this block in sync
  $effect(() => {
    const token = topicsRefreshToken ?? 0;
    if (token === lastRefreshToken) return;
    lastRefreshToken = token;

    if (expandedCategories.has(workingCategory.category_id)) {
      void fetchTopicCollection(workingCategory.category_id, true);
    } else {
      needsForcedRefresh = true;
    }
  });

  async function toggleExpandCategory(categoryId: string) {
    if (workingCategory.topic_count === 0) return;
    const newSet = new Set(expandedCategories);
    if (newSet.has(categoryId)) {
      newSet.delete(categoryId);
    } else {
      newSet.add(categoryId);

      const forceRefresh = needsForcedRefresh;
      // load topics if not already loaded or when marked stale
      await fetchTopicCollection(categoryId, forceRefresh);
      needsForcedRefresh = false;
    }
    expandedCategories = newSet;
  }

  const selectInput = (event: Event) => {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    input.select();
  };

  function clearCategoryOrderTimer() {
    if (categoryOrderTimer) {
      clearTimeout(categoryOrderTimer);
      categoryOrderTimer = null;
    }
  }

  // Debounced handler for the category order input
  const handleCategoryOrderInput = (event: Event) => {
    if (!onManualCategoryOrderChange) return;
    const input = event.currentTarget as HTMLInputElement;
    categoryOrderDraft = input.value;

    const value = Number(input.value);
    if (input.value === '' || Number.isNaN(value)) {
      clearCategoryOrderTimer();
      return;
    }

    clearCategoryOrderTimer();
    categoryOrderTimer = setTimeout(() => {
      categoryOrderTimer = null;
      const maxOrder = Math.max(1, maxCategoryOrder);
      const normalized = clamp(value, 1, maxOrder);
      categoryOrderDraft = String(normalized);
      onManualCategoryOrderChange?.(normalized);
    }, INPUT_DEBOUNCE_MS);
  };

  function clearTopicOrderTimer(topicId: string) {
    const timer = topicOrderTimers.get(topicId);
    if (timer) {
      clearTimeout(timer);
      topicOrderTimers.delete(topicId);
    }
  }

  // Debounced handler for the per-topic order inputs
  const handleTopicOrderInput = (topicId: string, event: Event) => {
    const input = event.currentTarget as HTMLInputElement;
    topicOrderDrafts = {
      ...topicOrderDrafts,
      [topicId]: input.value,
    };

    const value = Number(input.value);
    if (input.value === '' || Number.isNaN(value)) {
      clearTopicOrderTimer(topicId);
      return;
    }

    clearTopicOrderTimer(topicId);
    const timer = setTimeout(() => {
      topicOrderTimers.delete(topicId);
      const total = Math.max(1, topicItems.length);
      const normalized = clamp(value, 1, total);
      topicOrderDrafts = {
        ...topicOrderDrafts,
        [topicId]: String(normalized),
      };
      void applyTopicOrderChange(topicId, normalized);
    }, INPUT_DEBOUNCE_MS);
    topicOrderTimers.set(topicId, timer);
  };

  // Applies a manual reorder for a specific topic, mirroring the drag logic
  async function applyTopicOrderChange(topicId: string, targetOrder: number) {
    if (isReordering) return;
    const items = [...topicItems];
    const currentIndex = items.findIndex((topic) => topic.topic_id === topicId);
    if (currentIndex === -1) return;

    const total = items.length;
    const clampedOrder = clamp(targetOrder, 1, total);
    if (currentIndex === clampedOrder - 1) return;

    const previousTopics = (workingCategory.topics ?? []).map((topic) => ({
      ...topic,
    }));

    const [moved] = items.splice(currentIndex, 1);
    items.splice(clampedOrder - 1, 0, moved);

    const updated = items.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    topicItems = updated;
    workingCategory.topics = updated.map(({ id, ...rest }) => ({ ...rest }));
    workingCategory.topic_count = workingCategory.topics?.length ?? 0;
    syncTopicOrderDrafts(updated, true);

    const updates = updated
      .map(({ topic_id, order }) => {
        const previousOrder = previousTopics.find(
          (topic) => topic.topic_id === topic_id,
        )?.order;
        return { topic_id, order, previousOrder };
      })
      .filter(
        ({ order, previousOrder }) =>
          previousOrder === undefined || order !== previousOrder,
      )
      .map(({ topic_id, order }) => ({ topic_id, order }));

    await persistTopicOrder(workingCategory.category_id, updates);
    await fetchTopicCollection(workingCategory.category_id, true);
  }

  async function toggleAvailability(
    event: Event,
    topic_id: string,
    available: boolean,
  ) {
    event.preventDefault();
    await topicManager.changeAvailability(topic_id, available);
    notifyTopicsChanged();
    await fetchTopicCollection(workingCategory.category_id, true);
  }

  async function toggleVisibility(
    event: Event,
    topic_id: string,
    visibility: 'public' | 'private',
  ) {
    event.preventDefault();
    await topicManager.changeVisibility(topic_id, visibility);
    notifyTopicsChanged();
    await fetchTopicCollection(workingCategory.category_id, true);
  }

  async function submitTopic(event: Event, topic_id: string) {
    event.preventDefault();
    await topicManager.submitTopic(topic_id);
    notifyTopicsChanged();
    await fetchTopicCollection(workingCategory.category_id, true);
  }

  // commit reordering changes sequentially so we can bail out and refresh if any update fails
  async function persistTopicOrder(
    categoryId: string,
    updates: { topic_id: string; order: number }[],
  ) {
    if (updates.length === 0 || isReordering) return;

    isReordering = true;
    let success = true;

    try {
      for (const { topic_id, order } of updates) {
        const response = await topicManager.changeSortOrderInCategory(
          topic_id,
          categoryId,
          order,
          { silent: true },
        );

        if (!response) {
          success = false;
          break;
        }
      }

      if (!success) {
        await fetchTopicCollection(categoryId, true);
        return;
      }

      toastStore.show('Topic order updated', 'info');
      notifyTopicsChanged();
      // // Refresh the parent collections so cached payloads don't reinsert stale ordering
      // await requestGlobalRefresh?.();
    } finally {
      isReordering = false;
    }
  }

  // Keep the UI responsive while dragging, unless a save is still running
  function handleTopicsConsider(event: CustomEvent<DndEvent<DraggableTopic>>) {
    if (isReordering) return;
    topicItems = event.detail.items as DraggableTopic[];
  }

  // Optimistically reorder topics, compute the delta, then persist to the backend
  async function handleTopicsFinalize(
    event: CustomEvent<DndEvent<DraggableTopic>>,
  ) {
    if (isReordering) return;

    const previousTopics = (workingCategory.topics ?? []).map((topic) => ({
      ...topic,
    }));

    const updated = event.detail.items.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    topicItems = updated;
    workingCategory.topics = updated.map(({ id, ...rest }) => ({ ...rest }));
    workingCategory.topic_count = workingCategory.topics?.length ?? 0;

    // build a minimal patch set by comparing new order against the last known ordering
    const updates = updated
      .map(({ topic_id, order }) => {
        const previousOrder = previousTopics.find(
          (topic) => topic.topic_id === topic_id,
        )?.order;
        return { topic_id, order, previousOrder };
      })
      .filter(
        ({ order, previousOrder }) =>
          previousOrder === undefined || order !== previousOrder,
      )
      .map(({ topic_id, order }) => ({ topic_id, order }));

    await persistTopicOrder(workingCategory.category_id, updates);
  }

  onDestroy(() => {
    clearCategoryOrderTimer();
    topicOrderTimers.forEach((timer) => clearTimeout(timer));
    topicOrderTimers.clear();
  });
</script>

<button
  type="button"
  class="category-toggle void-btn fade-in"
  class:active={expandedCategories.has(workingCategory.category_id)}
  class:disabled={workingCategory.topic_count === 0}
  aria-expanded={expandedCategories.has(workingCategory.category_id)}
  onclick={() => toggleExpandCategory(workingCategory.category_id)}
  onkeydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggleExpandCategory(workingCategory.category_id);
    }
  }}
>
  <div class="flex-row">
    <span class="flex-row gap round-8">
      <h5>Order:</h5>
      <input
        id="category-order-{workingCategory.category_id}"
        type="number"
        value={categoryOrderDraft}
        onclick={selectInput}
        oninput={handleCategoryOrderInput}
        min="1"
        max={Math.max(1, maxCategoryOrder)}
        inputmode="numeric"
        disabled={categoryOrderDisabled || !onManualCategoryOrderChange}
      />
    </span>
    <h4>{workingCategory.category_name}</h4>
    <span class="flex-row gap round-8">
      <h5>Stories: {workingCategory.topic_count}</h5>
      <SelectorSVG
        focused={null}
        disabled={false}
        hideForMobiles={false}
        rotate={expandedCategories.has(workingCategory.category_id)
          ? '90'
          : '0'}
      />
    </span>
  </div>
</button>

{#if expandedCategories.has(workingCategory.category_id)}
  {#if topicItems && topicItems.length > 0}
    <section
      class="tiles-collection fade-in"
      class:reordering={isReordering}
      aria-busy={isReordering}
      use:dndzone={{
        items: topicItems,
        type: `topics-${workingCategory.category_id}`,
        dragDisabled: disableDrag || isReordering,
      }}
      onconsider={handleTopicsConsider}
      onfinalize={handleTopicsFinalize}
    >
      {#each topicItems as topic (topic.id)}
        <a class="tile" href={NAV_ROUTES.EXPLORE(topic.topic_id)}>
          <h5>{topic.topic_name}</h5>
          <div class="tile-data flex">
            <span class="input-container">
              <label for="story-order-{topic.topic_id}">Order</label>
              <input
                id="story-order-{topic.topic_id}"
                type="number"
                value={topicOrderDrafts[topic.topic_id] ?? String(topic.order)}
                onclick={selectInput}
                oninput={(event) =>
                  handleTopicOrderInput(topic.topic_id, event)}
                min="1"
                max={topicItems.length}
                inputmode="numeric"
                disabled={isReordering}
              />
            </span>
            {#if $isAdmin}
              <button
                use:tippy={{
                  content: 'Toggle availability',
                  animation: 'scale',
                }}
                class:green-btn={topic.available === true}
                class:red-btn={topic.available === false}
                onclick={(event) =>
                  toggleAvailability(event, topic.topic_id, !topic.available)}
              >
                {topic.available ? 'Available' : 'Unavailable'}
              </button>
            {/if}
            <!-- <button
              use:tippy={{
                content: 'Submit Topic for review',
                animation: 'scale',
                theme: 'light',
              }}
              onclick={(event) => submitTopic(event, topic.topic_id)}
              disabled={topic.visibility === 'public'}
            >
              {topic.visibility === 'public' ? 'Submitted' : 'Submit'}
            </button> -->
            {#if creator}
              <button
                use:tippy={{
                  content: 'Toggle visibility',
                  animation: 'scale',
                }}
                class:green-btn={topic.visibility === 'public'}
                class:red-btn={topic.visibility === 'private'}
                onclick={(event) =>
                  toggleVisibility(
                    event,
                    topic.topic_id,
                    topic.visibility === 'public' ? 'private' : 'public',
                  )}
              >
                {topic.visibility === 'public' ? 'Public' : 'Private'}
              </button>
            {/if}
          </div>
        </a>
      {/each}
    </section>
  {:else}
    <p class="validation">No topics found</p>
  {/if}
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .category-toggle {
    width: 100%;
    padding: 0.5rem;
    stroke: $white;
    fill: $white;
    @include navy;
    @include white-txt(1);

    &.active {
      @include blue;
    }

    &.disabled {
      cursor: not-allowed;
      @include gray(0.25);
    }

    &:hover,
    &:active,
    &:focus-visible {
      @include bright;
    }

    div {
      justify-content: space-between;

      h4 {
        width: auto;
      }

      span {
        h5 {
          display: none;
        }

        @include respond-up(tablet) {
          width: 10rem;
          height: 100%;
          padding: 0.5rem;
          background-color: $transparent-black;
          @include dark-border;

          h5 {
            display: flex;
            align-items: center;
            height: 3rem;
          }
        }
      }
    }
  }

  .tiles-collection {
    width: 100%;
    min-height: unset;

    &.reordering {
      pointer-events: none;
      opacity: 0.75;
    }

    .tile-data {
      padding: 1rem;
      gap: 1rem;
    }
  }
</style>
