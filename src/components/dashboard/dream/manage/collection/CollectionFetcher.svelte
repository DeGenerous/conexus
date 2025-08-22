<script lang="ts">
  import { onMount } from 'svelte';

  import { NAV_ROUTES }from '@constants/routes';
  import Topics from '@lib/topics';
  import { userState } from '@utils/route-guard';

  const topicManager = new Topics();

  let isAdmin = $state(false);
  let isCreator = $state(false);

  let page = $state(1);
  let pageSize = $state(10);

  let adminCollection = $state<CollectionSection[]>([]);
  let creatorCollection = $state<CollectionCategory[]>([]);

  let expandedSections = $state<Set<string>>(new Set());
  let expandedCategories = $state<Set<string>>(new Set());

  // drag state
  let draggedCategory: CollectionCategory | null = null;
  let draggedTopic: CollectionTopic | null = null;

  onMount(async () => {
    isAdmin = await userState('admin');
    isCreator = await userState('creator');

    if (isAdmin) {
      adminCollection = await topicManager.getAdminCollection(page, pageSize);
    } else if (isCreator) {
      creatorCollection = await topicManager.getCreatorCollection(
        page,
        pageSize,
      );
    }
  });

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
  {/if}

  {#if isCreator}
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
          <ul>
            {#each category.topics as topic, i}
              <li
                class="tiles-collection"
                draggable="true"
                ondragstart={() => (draggedTopic = topic)}
                ondragend={() => (draggedTopic = null)}
              >
                <a class="tile" href={NAV_ROUTES.EXPLORE(topic.topic_id)}>
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
  {/if}
</section>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .collection-container {
    outline: none !important;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .section {
    @extend .collection-wrapper !optional; // reuse wrapper styling
    flex-direction: column;
  }

  .section-toggle {
    @extend .collection-header !optional;
    cursor: pointer;
    background: transparent;
    border: none;
    width: 100%;
    text-align: left;

    h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
    }
  }

  .category {
    @extend .collection-wrapper !optional;
    margin-left: 1rem;
    padding-left: 1rem;
    border-left: 2px solid rgba(255, 255, 255, 0.1);

    .category-toggle {
      @extend .collection-header !optional;
      cursor: pointer;
      background: transparent;
      border: none;
      width: 100%;

      h4 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 500;
      }
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0.75rem 0 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    li {
      @include box-glow(inset, 0.25);
      border-radius: 0.5rem;
      padding: 0.5rem 0.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255, 255, 255, 0.05);

      span {
        flex-grow: 1;
      }

      button {
        @include box-glow(outset, 0.25);
        margin-left: 0.5rem;
        padding: 0.25rem 0.75rem;
        border-radius: 0.3rem;
        font-size: 0.85rem;
      }
    }
  }

  .tiles-collection {
    min-height: unset;

    .tile {
      padding-block: 1rem;
      gap: 1rem;

      h4 {
        height: 100%;
      }
    }
  }
</style>
