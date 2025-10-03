<script lang="ts">
  import { onMount } from 'svelte';

  import Topics from '@lib/topics';
  import { ensureCreator } from '@utils/route-guard';

  import CategoryBlock from './CollectionCategoryBlock.svelte';

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

  async function toggleExpandSection(id: string) {
    const newSet = new Set(expandedSections);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);

      // load categories if not already loaded
      const section = sections.find((s) => s.section_id === id);
      if (section && !section.categories) {
        section.categories = await topicManager.getSectionCategoryCollection(
          id,
          1,
          pageSize,
        );
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

  // drag state
  let draggedCategory = $state<CollectionCategory | null>(null);

  function reorder<T>(list: T[], from: number, to: number) {
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
  }

  async function moveCategoryToSection(
    category: CollectionCategory,
    targetSection: CollectionSection,
  ) {
    // Remove from old section
    for (const section of sections) {
      section.categories = (section.categories || []).filter(
        (c) => c.category_id !== category.category_id,
      );
    }
    // Add to new section
    if (!targetSection.categories) {
      targetSection.categories =
        await topicManager.getSectionCategoryCollection(
          targetSection.section_id,
          1,
          pageSize,
        );
    }
    targetSection.categories.push(category);

    topicManager.moveCategory(category.category_id, targetSection.section_id);
  }
</script>

<section class="collection-container">
  {#if isAdmin}
    <div class="admin-select-buttons">
      <button
        class="btn btn-sm"
        class:btn-primary={adminToggle === 'sections'}
        onclick={() => (adminToggle = 'sections')}
      >
        Sections
      </button>
      <button
        class="btn btn-sm"
        class:btn-primary={adminToggle === 'creators'}
        onclick={() => (adminToggle = 'creators')}
      >
        Creators
      </button>
    </div>

    {#if adminToggle === 'creators'}
      {#if creators && creators.length > 0}
        {#each creators as creator}
          <div class="section" role="list" ondragover={() => {}}>
            <button
              type="button"
              class="section-toggle"
              aria-expanded={expandedCreators.has(creator.creator_id)}
              onclick={() => toggleExpandCreator(creator.creator_id)}
              onkeydown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleExpandCreator(creator.creator_id);
                }
              }}
            >
              <h3>{creator.creator_name}</h3>
            </button>

            {#if expandedCreators.has(creator.creator_id)}
              {#if creator.categories && creator.categories.length > 0}
                {#each creator.categories as category}
                  <CategoryBlock
                    {isAdmin}
                    {category}
                    {topicManager}
                    {reorder}
                  />
                {/each}
              {:else}
                <p class="validation">No categories found</p>
              {/if}
            {/if}
          </div>
        {/each}
      {:else}
        <p class="validation">No creators found</p>
      {/if}
    {:else if sections && sections.length > 0}
      {#each sections as section}
        <div
          class="section"
          role="list"
          ondragover={() => {}}
          ondrop={() =>
            draggedCategory && moveCategoryToSection(draggedCategory, section)}
        >
          <button
            type="button"
            class="section-toggle"
            aria-expanded={expandedSections.has(section.section_id)}
            onclick={() => toggleExpandSection(section.section_id)}
            onkeydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                toggleExpandSection(section.section_id);
              }
            }}
          >
            <h3>{section.section_name}</h3>
          </button>

          {#if expandedSections.has(section.section_id)}
            {#if section.categories && section.categories.length > 0}
              {#each section.categories as category}
                <CategoryBlock {isAdmin} {category} {topicManager} {reorder} />
              {/each}
            {:else}
              <p class="validation">No categories found</p>
            {/if}
          {/if}
        </div>
      {/each}
    {:else}
      <p class="validation">No categories found</p>
    {/if}
  {/if}

  {#if isCreator}
    {#if creatorCategories && creatorCategories.length > 0}
      {#each creatorCategories as category}
        <CategoryBlock {isAdmin} {category} {topicManager} {reorder} />
      {/each}
    {:else}
      <p class="validation">No categories found</p>
    {/if}
  {/if}
</section>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .collection-container {
    outline: none !important;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem;
  }

  .admin-select-buttons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  /* Section container */
  .section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    border-radius: 0.75rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  /* Section header */
  .section-toggle {
    background: transparent;
    border: none;
    text-align: left;
    /* REMOVE this: width: 100vh; */
    width: 100%; // <- what you really want
    cursor: pointer;
    padding: 0.5rem 0;

    h3 {
      margin: 0;
      font-size: 1.3rem;
      font-weight: 600;
    }
  }

  @include mobile-only {
    .collection-container {
      gap: 1rem;
      padding: 0.5rem;
    }

    .section-toggle h3 {
      font-size: 1.1rem;
    }
  }
</style>
