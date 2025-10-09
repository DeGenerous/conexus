<script lang="ts">
  import { onMount } from 'svelte';

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
  // let draggedCategory = $state<CollectionCategory | null>(null);

  // async function moveCategoryToSection(
  //   category: CollectionCategory,
  //   targetSection: CollectionSection,
  // ) {
  //   // Remove from old section
  //   for (const section of sections) {
  //     section.categories = (section.categories || []).filter(
  //       (c) => c.category_id !== category.category_id,
  //     );
  //   }
  //   // Add to new section
  //   if (!targetSection.categories) {
  //     targetSection.categories =
  //       await topicManager.getSectionCategoryCollection(
  //         targetSection.section_id,
  //         1,
  //         pageSize,
  //       );
  //   }
  //   targetSection.categories.push(category);

  //   topicManager.moveCategory(category.category_id, targetSection.section_id);
  // }
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
            {#each section.categories as category}
              <CategoryBlock {isAdmin} {category} {topicManager} />
            {/each}
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
