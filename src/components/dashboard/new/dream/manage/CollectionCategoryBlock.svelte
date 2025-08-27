<script lang="ts">
  import { NAV_ROUTES } from '@constants/routes';

  let {
    category,
    expandedCategories,
    toggleExpandCategory,
    draggedTopic,
    setDraggedTopic,
    moveTopicToCategory,
    toggleAvailability,
    toggleVisibility,
    reorder,
  }: {
    category: CollectionCategory;
    expandedCategories: Set<string>;
    toggleExpandCategory: (set: Set<string>, id: string) => void;
    draggedTopic: CollectionTopic | null;
    setDraggedTopic: (topic: CollectionTopic | null) => void;
    moveTopicToCategory: (
      topic: CollectionTopic,
      target: CollectionCategory,
    ) => void;
    toggleAvailability: (topic: CollectionTopic) => void;
    toggleVisibility: (topic: CollectionTopic) => void;
    reorder: <T>(list: T[], from: number, to: number) => void;
  } = $props();
</script>

<div
  class="category"
  role="listitem"
  draggable="true"
  ondragover={() => {}}
  ondrop={() => draggedTopic && moveTopicToCategory(draggedTopic, category)}
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
          ondragstart={() => setDraggedTopic(topic)}
          ondragend={() => setDraggedTopic(null)}
        >
          <a href={NAV_ROUTES.EXPLORE(topic.topic_id)}>
            <span>{topic.topic_name}</span>
            <button onclick={() => toggleAvailability(topic)}>
              {topic.available ? 'Disable' : 'Enable'}
            </button>
            <button onclick={() => toggleVisibility(topic)}>
              {topic.visibility === 'public' ? 'Make Private' : 'Make Public'}
            </button>
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

<style lang="scss">
  @use '/src/styles/mixins' as *;

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
    .tiles-collection {
      min-width: 150px;
    }

    .category-toggle h4 {
      font-size: 1rem;
    }
  }
</style>
