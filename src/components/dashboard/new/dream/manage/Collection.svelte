<script lang="ts">
  import { onMount } from 'svelte';

  import { NAV_ROUTES }from '@constants/routes';
  import Topics from '@lib/topics';
  import { isAdmin, isCreator } from '@stores/account.svelte';

  const topicManager = new Topics();

  let Admin = $isAdmin;
  let Creator = $isCreator;

  let page = $state(1);
  let pageSize = $state(10);

  let adminCollection = $state<CollectionSection[]>([]);
  let creatorCollection = $state<CollectionCategory[]>([]);

  onMount(async () => {
    if (Admin) {
      adminCollection = await topicManager.getAdminCollection(page, pageSize);
    } else if (Creator) {
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
  let draggedCategory: CollectionCategory | null = null;
  let draggedTopic: CollectionTopic | null = null;

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
    if (Admin) {
      for (const section of adminCollection) {
        for (const cat of section.categories) {
          cat.topics = cat.topics.filter((t) => t.topic_id !== topic.topic_id);
        }
      }
    } else if (Creator) {
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
  {#if Admin}
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
              <div
                class="category"
                role="listitem"
                draggable="true"
                ondragstart={() => (draggedCategory = category)}
                ondragend={() => (draggedCategory = null)}
                ondragover={() => {}}
                ondrop={() =>
                  draggedTopic && moveTopicToCategory(draggedTopic, category)}
              >
                <button
                  type="button"
                  class="category-toggle"
                  aria-expanded={expandedCategories.has(category.category_id)}
                  onclick={() =>
                    toggleExpandCategory(
                      expandedCategories,
                      category.category_id,
                    )}
                  onkeydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      toggleExpandCategory(
                        expandedCategories,
                        category.category_id,
                      );
                    }
                  }}
                >
                  <h4>{category.category_name}</h4>
                </button>

                {#if expandedCategories.has(category.category_id)}
                  <ul>
                    {#each category.topics as topic, i}
                      <li
                        class="tiles-collection"
                        draggable="true"
                        ondragstart={() => (draggedTopic = topic)}
                        ondragend={() => (draggedTopic = null)}
                      >
                        <a
                          class="tile"
                          href={NAV_ROUTES.EXPLORE(topic.topic_id)}
                        >
                          <span>{topic.topic_name}</span>
                          <button onclick={() => toggleAvailability(topic)}>
                            {topic.available ? 'Disable' : 'Enable'}
                          </button>
                          <button onclick={() => toggleVisibility(topic)}>
                            {topic.visibility === 'public'
                              ? 'Make Private'
                              : 'Make Public'}
                          </button>
                          <!-- reorder buttons -->
                          {#if i > 0}
                            <button
                              onclick={() => reorder(category.topics, i, i - 1)}
                              >↑</button
                            >
                          {/if}
                          {#if i < category.topics.length - 1}
                            <button
                              onclick={() => reorder(category.topics, i, i + 1)}
                              >↓</button
                            >
                          {/if}
                        </a>
                      </li>
                    {/each}
                  </ul>
                {/if}
              </div>
            {/each}
          {/if}
        </div>
      {/each}
    {:else}
      <p class="validation">No categories found</p>
    {/if}
  {/if}

  {#if Creator}
    {#if creatorCollection && creatorCollection.length > 0}
      {#each creatorCollection as category}
        <div
          class="category"
          role="listitem"
          ondragover={() => {}}
          ondrop={() =>
            draggedTopic && moveTopicToCategory(draggedTopic, category)}
        >
          <button
            type="button"
            class="category-toggle"
            aria-expanded={expandedCategories.has(category.category_id)}
            onclick={() =>
              toggleExpandCategory(expandedCategories, category.category_id)}
            onkeydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                toggleExpandCategory(expandedCategories, category.category_id);
              }
            }}
          >
            <h4>{category.category_name}</h4>
          </button>

          {#if expandedCategories.has(category.category_id)}
            <ul class="tiles-collection">
              {#each category.topics as topic, i}
                <li
                  class="tile"
                  draggable="true"
                  ondragstart={() => (draggedTopic = topic)}
                  ondragend={() => (draggedTopic = null)}
                >
                  <a href={NAV_ROUTES.EXPLORE(topic.topic_id)}>
                    <span>{topic.topic_name}</span>
                    <button onclick={() => toggleAvailability(topic)}>
                      {topic.available ? 'Disable' : 'Enable'}
                    </button>
                    <button onclick={() => toggleVisibility(topic)}>
                      {topic.visibility === 'public'
                        ? 'Make Private'
                        : 'Make Public'}
                    </button>
                    <!-- reorder buttons -->
                    {#if i > 0}
                      <button onclick={() => reorder(category.topics, i, i - 1)}
                        >↑</button
                      >
                    {/if}
                    {#if i < category.topics.length - 1}
                      <button onclick={() => reorder(category.topics, i, i + 1)}
                        >↓</button
                      >
                    {/if}
                  </a>
                </li>
              {/each}
            </ul>
          {/if}
        </div>
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

  /* Categories stay stacked */
  .category {
    margin-left: 1rem;
    padding-left: 1rem;
    border-left: 2px solid rgba(255, 255, 255, 0.15);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    .category-toggle {
      background: transparent;
      border: none;
      cursor: pointer;
      text-align: left;

      h4 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 500;
      }
    }
  }

  /* Topics container → horizontal scroll */
  .category ul {
    list-style: none;
    padding: 0;
    margin: 0.5rem 0 0;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;

    /* Webkit scrollbar styling */
    &::-webkit-scrollbar {
      height: 8px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
    }
  }

  /* Each topic tile */
  .tiles-collection {
    // flex: 0 0 auto; /* prevent shrinking */
    // min-width: 200px;
    // background: rgba(255, 255, 255, 0.05);
    // border-radius: 0.5rem;
    // padding: 0.75rem;
    // display: flex;
    // flex-direction: column;
    // justify-content: space-between;
    // gap: 0.5rem;

    .tile {
      color: white;
      text-decoration: none;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      span {
        font-weight: 500;
        font-size: 1rem;
      }

      button {
        padding: 0.3rem 0.6rem;
        border-radius: 0.4rem;
        font-size: 0.8rem;
        border: none;
        cursor: pointer;
        background: rgba(100, 181, 246, 0.15);
        color: #90caf9;
        transition: background 0.2s;

        &:hover {
          background: rgba(100, 181, 246, 0.3);
        }
      }
    }
  }

  /* Responsive tweaks */
  @media (max-width: 768px) {
    .collection-container {
      gap: 1rem;
      padding: 0.5rem;
    }

    .tiles-collection {
      min-width: 150px;
    }

    .section-toggle h3 {
      font-size: 1.1rem;
    }

    .category-toggle h4 {
      font-size: 1rem;
    }
  }
</style>
