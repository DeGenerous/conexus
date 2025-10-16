<script lang="ts">
  import { onMount } from 'svelte';

  import { dndzone, type DndEvent } from 'svelte-dnd-action';

  import Topics from '@lib/topics';
  import { ensureCreator } from '@utils/route-guard';

  import CategoryBlock from '@components/dashboard/dream/manage/collections/CategoryBlock.svelte';
  import Dropdown from '@components/utils/Dropdown.svelte';

  const topicManager = new Topics();

  let isAdmin = $state(false);
  let isCreator = $state(false);

  let page = $state(1);
  let pageSize = $state(10);

  let sections = $state<CollectionSection[]>([]);
  let creators = $state<CollectionCreator[]>([]);
  let creatorCategories = $state<CollectionCategory[]>([]);

  onMount(async () => {
    const { isAdmin: is_admin, isCreator: is_creator } = await ensureCreator();

    isAdmin = is_admin;
    isCreator = is_creator;

    if (isAdmin) {
      sections = await topicManager.getSectionCollection(page, pageSize);
      creators = await topicManager.getCreatorCollection(page, pageSize);
    } else if (isCreator) {
      creatorCategories = await topicManager.getCreatorCategoryCollection(
        'creators', // id retrieved in backend
        page,
        pageSize,
      );
    }
  });

  let adminToggle = $state<'sections' | 'creators'>('sections');

  let expandedSections = $state<Set<string>>(new Set());
  let expandedCreators = $state<Set<string>>(new Set());

  type DraggableCategory = CollectionCategory & { id: string };
  // local mirror of section categories so drag reordering stays responsive before the API round-trip
  let sectionCategoryItems = $state<Record<string, DraggableCategory[]>>({});

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
        );
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

  function handleCategoryConsider(
    sectionId: string,
    event: CustomEvent<DndEvent<DraggableCategory>>,
  ) {
    sectionCategoryItems = {
      ...sectionCategoryItems,
      [sectionId]: event.detail.items as DraggableCategory[],
    };
  }

  function handleCategoryFinalize(
    sectionId: string,
    event: CustomEvent<DndEvent<DraggableCategory>>,
  ) {
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

    // TODO: once backend exposes a batch reorder endpoint, replace this client log / noop with an API call
    console.log('[Collections] Category order updated', {
      sectionId,
      categories: updated.map(({ category_id, category_order }) => ({
        category_id,
        category_order,
      })),
    });
  }
</script>

{#if isAdmin}
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
              {#each creator.categories as category}
                <CategoryBlock {isAdmin} {category} {topicManager} />
              {/each}
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
              use:dndzone={{
                items: getSectionCategoryItems(
                  section.section_id,
                  section.categories,
                ),
                type: `categories-${section.section_id}`,
                dropFromOthersDisabled: true,
              }}
              onconsider={(event) =>
                handleCategoryConsider(section.section_id, event)}
              onfinalize={(event) =>
                handleCategoryFinalize(section.section_id, event)}
            >
              {#each getSectionCategoryItems(section.section_id, section.categories) as category (category.id)}
                <div class="category-draggable">
                  <CategoryBlock {isAdmin} {category} {topicManager} />
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

{#if isCreator && !isAdmin}
  {#if creatorCategories && creatorCategories.length > 0}
    {#each creatorCategories as category}
      <CategoryBlock {isAdmin} {category} {topicManager} />
    {/each}
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
  }

  .category-draggable {
    width: calc(100vw - 6rem);

    @include respond-up(small-desktop) {
      width: 100%;
    }
  }
</style>
