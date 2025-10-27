<script lang="ts">
  import { onMount } from 'svelte';

  import { dndzone, type DndEvent } from 'svelte-dnd-action';

  import Topics from '@lib/topics';
  import CategoryView from '@lib/category';
  import { toastStore } from '@stores/toast.svelte';
  import { checkUserRoles, getCurrentUser } from '@utils/route-guard';
  import { isAdmin, isPlayer } from '@stores/account.svelte';

  import CategoryBlock from '@components/dashboard/dream/manage/collections/CategoryBlock.svelte';
  import Dropdown from '@components/utils/Dropdown.svelte';

  const topicManager = new Topics();
  const categoryManager = new CategoryView();

  let userID = $state<string>('');

  let page = $state(1);
  let pageSize = $state(10);

  let sections = $state<CollectionSection[]>([]);
  let creators = $state<CollectionCreator[]>([]);
  let creatorCategories = $state<CollectionCategory[]>([]);

  // Load initial collections for the active role
  onMount(async () => {
    const user = await getCurrentUser();
    await checkUserRoles();

    if ($isAdmin) {
      sections = await topicManager.getSectionCollection(page, pageSize, true);
      creators = await topicManager.getCreatorCollection(page, pageSize, true);
    } else if ($isPlayer) {
      userID = user?.id ?? '';
      creatorCategories = await topicManager.getCreatorCategoryCollection(
        userID,
        page,
        pageSize,
        true,
      );
      creatorCategoryItems = {
        ...creatorCategoryItems,
        [CREATOR_SELF_KEY]: createCategoryItems(creatorCategories ?? []),
      };
    }
  });

  let adminToggle = $state<'sections' | 'creators'>('sections');

  let expandedSections = $state<Set<string>>(new Set());
  let expandedCreators = $state<Set<string>>(new Set());

  type DraggableCategory = CollectionCategory & { id: string };
  // local mirror of section categories so drag reordering stays responsive before the API round-trip
  let sectionCategoryItems = $state<Record<string, DraggableCategory[]>>({});
  let creatorCategoryItems = $state<Record<string, DraggableCategory[]>>({});
  let sectionReordering = $state<Set<string>>(new Set());
  let creatorReordering = $state<Set<string>>(new Set());
  const CREATOR_SELF_KEY = 'creator-self';

  // Track which sections/creators are currently persisting their new order
  function setSectionReordering(sectionId: string, active: boolean) {
    const next = new Set(sectionReordering);
    if (active) {
      next.add(sectionId);
    } else {
      next.delete(sectionId);
    }
    sectionReordering = next;
  }

  function setCreatorReordering(creatorId: string, active: boolean) {
    const next = new Set(creatorReordering);
    if (active) {
      next.add(creatorId);
    } else {
      next.delete(creatorId);
    }
    creatorReordering = next;
  }

  function createCategoryItems(
    categories: CollectionCategory[] = [],
  ): DraggableCategory[] {
    return categories.map((category) => ({
      ...category,
      id: category.category_id,
    }));
  }

  function ensureSectionCategoryItems(section: CollectionSection) {
    sectionCategoryItems = {
      ...sectionCategoryItems,
      [section.section_id]:
        sectionCategoryItems[section.section_id] ??
        createCategoryItems(section.categories ?? []),
    };
  }

  function checkUserRolesCategoryItems(creator: CollectionCreator) {
    creatorCategoryItems = {
      ...creatorCategoryItems,
      [creator.creator_id]:
        creatorCategoryItems[creator.creator_id] ??
        createCategoryItems(creator.categories ?? []),
    };
  }

  async function toggleExpandSection(id: string) {
    const newSet = new Set(expandedSections);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);

      // load categories lazily the first time a section expands to avoid redundant requests
      const section = sections.find((s) => s.section_id === id);
      if (section) {
        if (!section.categories) {
          section.categories = await topicManager.getSectionCategoryCollection(
            id,
            1,
            pageSize,
            true,
          );
        }
        ensureSectionCategoryItems(section);
      }
    }
    expandedSections = newSet;
  }

  async function toggleExpandCreator(id: string) {
    const newSet = new Set(expandedCreators);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);

      // load categories if not already loaded
      const creator = creators.find((c) => c.creator_id === id);
      if (creator && !creator.categories) {
        creator.categories = await topicManager.getCreatorCategoryCollection(
          id,
          1,
          pageSize,
          true,
        );
      }
      if (creator) {
        checkUserRolesCategoryItems(creator);
      }
    }
    expandedCreators = newSet;
  }

  function getSectionCategoryItems(
    sectionId: string,
    fallback: CollectionCategory[] = [],
  ): DraggableCategory[] {
    return (
      sectionCategoryItems[sectionId] ?? createCategoryItems(fallback ?? [])
    );
  }

  function getCreatorCategoryItems(
    creatorId: string,
    fallback: CollectionCategory[] = [],
  ): DraggableCategory[] {
    return (
      creatorCategoryItems[creatorId] ?? createCategoryItems(fallback ?? [])
    );
  }

  function handleCategoryConsider(
    sectionId: string,
    event: CustomEvent<DndEvent<DraggableCategory>>,
  ) {
    if (sectionReordering.has(sectionId)) return;
    sectionCategoryItems = {
      ...sectionCategoryItems,
      [sectionId]: event.detail.items as DraggableCategory[],
    };
  }

  // Persist section category reorder (admin scope)
  async function handleCategoryFinalize(
    sectionId: string,
    event: CustomEvent<DndEvent<DraggableCategory>>,
  ) {
    if (sectionReordering.has(sectionId)) return;

    const previousCategories = (
      sections.find((section) => section.section_id === sectionId)
        ?.categories ?? []
    ).map((category) => ({ ...category }));

    const updated = event.detail.items.map((item, index) => ({
      ...item,
      category_order: index + 1,
    }));

    sectionCategoryItems = {
      ...sectionCategoryItems,
      [sectionId]: updated,
    };

    sections = sections.map((section) =>
      section.section_id === sectionId
        ? {
            ...section,
            categories: updated.map(({ id, ...rest }) => ({ ...rest })),
          }
        : section,
    );

    const updates = updated
      .map(({ category_id, category_order }) => {
        const previousOrder = previousCategories.find(
          (category) => category.category_id === category_id,
        )?.category_order;
        return { category_id, order: category_order, previousOrder };
      })
      .filter(
        ({ order, previousOrder }) =>
          previousOrder === undefined || order !== previousOrder,
      )
      .map(({ category_id, order }) => ({ category_id, order }));

    await persistCategoryOrder('sections', sectionId, updates, () =>
      refreshSectionCategories(sectionId),
    );
  }

  function handleCreatorCategoryConsider(
    creatorKey: string,
    event: CustomEvent<DndEvent<DraggableCategory>>,
  ) {
    if (creatorReordering.has(creatorKey)) return;
    creatorCategoryItems = {
      ...creatorCategoryItems,
      [creatorKey]: event.detail.items as DraggableCategory[],
    };
  }

  // Persist creator category reorder (admin + self scopes)
  async function handleCreatorCategoryFinalize(
    creatorKey: string,
    event: CustomEvent<DndEvent<DraggableCategory>>,
    context: 'admin' | 'self' = 'admin',
  ) {
    if (creatorReordering.has(creatorKey)) return;

    const previousCategories =
      context === 'admin'
        ? (
            creators.find((creator) => creator.creator_id === creatorKey)
              ?.categories ?? []
          ).map((category) => ({ ...category }))
        : creatorCategories.map((category) => ({ ...category }));

    const updated = event.detail.items.map((item, index) => ({
      ...item,
      category_order: index + 1,
    }));

    creatorCategoryItems = {
      ...creatorCategoryItems,
      [creatorKey]: updated,
    };

    if (context === 'admin') {
      creators = creators.map((creator) =>
        creator.creator_id === creatorKey
          ? {
              ...creator,
              categories: updated.map(({ id, ...rest }) => ({ ...rest })),
            }
          : creator,
      );
    } else {
      creatorCategories = updated.map(({ id, ...rest }) => ({ ...rest }));
    }

    const updates = updated
      .map(({ category_id, category_order }) => {
        const previousOrder = previousCategories.find(
          (category) => category.category_id === category_id,
        )?.category_order;
        return { category_id, order: category_order, previousOrder };
      })
      .filter(
        ({ order, previousOrder }) =>
          previousOrder === undefined || order !== previousOrder,
      )
      .map(({ category_id, order }) => ({ category_id, order }));

    const onFailure =
      context === 'admin'
        ? () => refreshCreatorCategories(creatorKey)
        : () => refreshStandaloneCreatorCategories();

    await persistCategoryOrder('creators', creatorKey, updates, onFailure);
  }

  // Shared persistence flow used by both section and creator reorder handlers
  async function persistCategoryOrder(
    mode: 'sections' | 'creators',
    key: string,
    updates: { category_id: string; order: number }[],
    onFailure?: () => Promise<void>,
  ) {
    if (updates.length === 0) return;

    if (mode === 'sections') {
      if (sectionReordering.has(key)) return;
      setSectionReordering(key, true);
    } else {
      if (creatorReordering.has(key)) return;
      setCreatorReordering(key, true);
    }

    let success = true;

    try {
      for (const { category_id, order } of updates) {
        const result =
          mode === 'sections'
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
      if (mode === 'sections') {
        setSectionReordering(key, false);
      } else {
        setCreatorReordering(key, false);
      }
    }

    if (!success) {
      if (onFailure) {
        await onFailure();
      }
      return;
    }

    toastStore.show('Category order updated', 'info');
  }

  // Admin: re-fetch a single section's categories to resync after failures
  async function refreshSectionCategories(sectionId: string) {
    const categories = await topicManager.getSectionCategoryCollection(
      sectionId,
      1,
      pageSize,
      true,
    );

    sections = sections.map((section) =>
      section.section_id === sectionId ? { ...section, categories } : section,
    );

    sectionCategoryItems = {
      ...sectionCategoryItems,
      [sectionId]: createCategoryItems(categories ?? []),
    };
  }

  // Admin: re-fetch creator categories for a specific creator
  async function refreshCreatorCategories(creatorId: string) {
    const categories = await topicManager.getCreatorCategoryCollection(
      creatorId,
      1,
      pageSize,
      true,
    );

    creators = creators.map((creator) =>
      creator.creator_id === creatorId ? { ...creator, categories } : creator,
    );

    creatorCategoryItems = {
      ...creatorCategoryItems,
      [creatorId]: createCategoryItems(categories ?? []),
    };
  }

  // Creator dashboard: re-fetch personal categories
  async function refreshStandaloneCreatorCategories() {
    const categories = await topicManager.getCreatorCategoryCollection(
      userID,
      1,
      pageSize,
      true,
    );

    creatorCategories = categories ?? [];

    creatorCategoryItems = {
      ...creatorCategoryItems,
      [CREATOR_SELF_KEY]: createCategoryItems(creatorCategories ?? []),
    };
  }
</script>

<!-- Admin collections management -->
{#if $isAdmin}
  <div class="dream-container">
    <div class="flex-row">
      <h4>Scope</h4>
      <div class="container">
        <button
          class="void-btn dream-radio-btn"
          class:active={adminToggle === 'sections'}
          onclick={() => (adminToggle = 'sections')}
        >
          Sections
        </button>
        <button
          class="void-btn dream-radio-btn"
          class:active={adminToggle === 'creators'}
          onclick={() => (adminToggle = 'creators')}
        >
          Creators
        </button>
      </div>
    </div>
  </div>

  {#if adminToggle === 'creators'}
    {#if creators && creators.length > 0}
      {#each creators as creator}
        <Dropdown
          name={creator.creator_name}
          dropdownFunc={() => toggleExpandCreator(creator.creator_id)}
        >
          {#if expandedCreators.has(creator.creator_id)}
            {#if creator.categories && creator.categories.length > 0}
              <div
                class="category-dnd-zone flex"
                class:reordering={creatorReordering.has(creator.creator_id)}
                aria-busy={creatorReordering.has(creator.creator_id)}
                use:dndzone={{
                  items: getCreatorCategoryItems(
                    creator.creator_id,
                    creator.categories,
                  ),
                  type: `creator-categories-${creator.creator_id}`,
                  dropFromOthersDisabled: true,
                  dragDisabled: creatorReordering.has(creator.creator_id),
                }}
                onconsider={(event) =>
                  handleCreatorCategoryConsider(creator.creator_id, event)}
                onfinalize={(event) =>
                  handleCreatorCategoryFinalize(
                    creator.creator_id,
                    event,
                    'admin',
                  )}
              >
                {#each getCreatorCategoryItems(creator.creator_id, creator.categories) as category (category.id)}
                  <div class="category-draggable">
                    <CategoryBlock {category} {topicManager} />
                  </div>
                {/each}
              </div>
            {:else}
              <p class="validation">No categories found</p>
            {/if}
          {/if}
        </Dropdown>
      {/each}
    {:else}
      <p class="validation">No creators found</p>
    {/if}
  {:else if sections && sections.length > 0}
    {#each sections as section}
      <Dropdown
        name={section.section_name}
        dropdownFunc={() => toggleExpandSection(section.section_id)}
      >
        {#if expandedSections.has(section.section_id)}
          {#if section.categories && section.categories.length > 0}
            <div
              class="category-dnd-zone flex"
              class:reordering={sectionReordering.has(section.section_id)}
              aria-busy={sectionReordering.has(section.section_id)}
              use:dndzone={{
                items: getSectionCategoryItems(
                  section.section_id,
                  section.categories,
                ),
                type: `categories-${section.section_id}`,
                dropFromOthersDisabled: true,
                dragDisabled: sectionReordering.has(section.section_id),
              }}
              onconsider={(event) =>
                handleCategoryConsider(section.section_id, event)}
              onfinalize={(event) =>
                handleCategoryFinalize(section.section_id, event)}
            >
              {#each getSectionCategoryItems(section.section_id, section.categories) as category (category.id)}
                <div class="category-draggable">
                  <CategoryBlock {category} {topicManager} />
                </div>
              {/each}
            </div>
          {:else}
            <p class="validation">No categories found</p>
          {/if}
        {/if}
      </Dropdown>
    {/each}
  {:else}
    <p class="validation">No categories found</p>
  {/if}
{/if}

<!-- Creator-only category management -->
{#if $isPlayer && !$isAdmin}
  {#if creatorCategories && creatorCategories.length > 0}
    <div
      class="category-dnd-zone flex"
      class:reordering={creatorReordering.has(CREATOR_SELF_KEY)}
      aria-busy={creatorReordering.has(CREATOR_SELF_KEY)}
      use:dndzone={{
        items: getCreatorCategoryItems(CREATOR_SELF_KEY, creatorCategories),
        type: `creator-categories-${CREATOR_SELF_KEY}`,
        dropFromOthersDisabled: true,
        dragDisabled: creatorReordering.has(CREATOR_SELF_KEY),
      }}
      onconsider={(event) =>
        handleCreatorCategoryConsider(CREATOR_SELF_KEY, event)}
      onfinalize={(event) =>
        handleCreatorCategoryFinalize(CREATOR_SELF_KEY, event, 'self')}
    >
      {#each getCreatorCategoryItems(CREATOR_SELF_KEY, creatorCategories) as category (category.id)}
        <div class="category-draggable">
          <CategoryBlock {category} {topicManager} />
        </div>
      {/each}
    </div>
  {:else}
    <p class="validation">No categories found</p>
  {/if}
{/if}

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
    width: calc(100vw - 6rem);

    @include respond-up(small-desktop) {
      width: 100%;
    }
  }
</style>
