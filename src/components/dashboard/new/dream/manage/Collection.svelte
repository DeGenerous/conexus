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

  let adminCollection = $state<CollectionSection[]>([]);
  let creatorCollection = $state<CollectionCategory[]>([]);

  onMount(async () => {
    const { isAdmin: is_admin, isCreator: is_creator } = await ensureCreator();

    isAdmin = is_admin;
    isCreator = is_creator;

    if (isAdmin) {
      adminCollection = await topicManager.getAdminCollection(page, pageSize);
    } else if (isCreator) {
      creatorCollection = await topicManager.getCreatorCollection(
        page,
        pageSize,
      );
    }
  });

  let expandedSections = $state<Set<string>>(new Set());
  let expandedCategories = $state<Set<string>>(new Set());

  function toggleExpandSection(setState: typeof expandedSections, id: string) {
    const newSet = new Set(setState); // clone
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    expandedSections = newSet; // reassign so reactivity triggers
  }

  function toggleExpandCategory(
    setState: typeof expandedCategories,
    id: string,
  ) {
    const newSet = new Set(setState); // clone
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    expandedCategories = newSet; // reassign so reactivity triggers
  }

  // drag state
  let draggedCategory = $state<CollectionCategory | null>(null);
  let draggedTopic = $state<CollectionTopic | null>(null);

  function toggleAvailability(topic: CollectionTopic) {
    topic.available = !topic.available;
    topicManager.updateTopic(topic.topic_id, { available: topic.available });
  }

  function toggleVisibility(topic: CollectionTopic) {
    topic.visibility = topic.visibility === 'public' ? 'private' : 'public';
    topicManager.updateTopic(topic.topic_id, { visibility: topic.visibility });
  }

  function reorder<T>(list: T[], from: number, to: number) {
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
  }

  function moveCategoryToSection(
    category: CollectionCategory,
    targetSection: CollectionSection,
  ) {
    // Remove from old section
    for (const section of adminCollection) {
      section.categories = section.categories.filter(
        (c) => c.category_id !== category.category_id,
      );
    }
    // Add to new section
    targetSection.categories.push(category);

    topicManager.moveCategory(category.category_id, targetSection.section_id);
  }

  function moveTopicToCategory(
    topic: CollectionTopic,
    targetCategory: CollectionCategory,
  ) {
    // Remove from old category
    if (isAdmin) {
      for (const section of adminCollection) {
        for (const cat of section.categories) {
          cat.topics = cat.topics.filter((t) => t.topic_id !== topic.topic_id);
        }
      }
    } else if (isCreator) {
      for (const cat of creatorCollection) {
        cat.topics = cat.topics.filter((t) => t.topic_id !== topic.topic_id);
      }
    }

    // Add to new category
    targetCategory.topics.push(topic);

    topicManager.moveTopic(topic.topic_id, targetCategory.category_id);
  }
</script>

<section class="collection-container">
  {#if isAdmin}
    {#if adminCollection && adminCollection.length > 0}
      {#each adminCollection as section}
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
            onclick={() =>
              toggleExpandSection(expandedSections, section.section_id)}
            onkeydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                toggleExpandSection(expandedSections, section.section_id);
              }
            }}
          >
            <h3>{section.section_name}</h3>
          </button>

          {#if expandedSections.has(section.section_id)}
            {#each section.categories as category}
              <CategoryBlock
                {category}
                {expandedCategories}
                {toggleExpandCategory}
                {draggedTopic}
                setDraggedTopic={(t) => (draggedTopic = t)}
                {moveTopicToCategory}
                {toggleAvailability}
                {toggleVisibility}
                {reorder}
              />
            {/each}
          {/if}
        </div>
      {/each}
    {:else}
      <p class="validation">No categories found</p>
    {/if}
  {/if}

  {#if isCreator}
    {#if creatorCollection && creatorCollection.length > 0}
      {#each creatorCollection as category}
        <CategoryBlock
          {category}
          {expandedCategories}
          {toggleExpandCategory}
          {draggedTopic}
          setDraggedTopic={(t) => (draggedTopic = t)}
          {moveTopicToCategory}
          {toggleAvailability}
          {toggleVisibility}
          {reorder}
        />
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
    width: 100%;
    cursor: pointer;
    padding: 0.5rem 0;

    h3 {
      margin: 0;
      font-size: 1.3rem;
      font-weight: 600;
    }
  }

  @media (max-width: 768px) {
    .collection-container {
      gap: 1rem;
      padding: 0.5rem;
    }

    .section-toggle h3 {
      font-size: 1.1rem;
    }
  }
</style>
