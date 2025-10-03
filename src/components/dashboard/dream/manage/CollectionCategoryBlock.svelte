<script lang="ts">
  import { tippy } from 'svelte-tippy';

  import { NAV_ROUTES } from '@constants/routes';
  import Topics from '@lib/topics';

  let {
    isAdmin,
    category,
    topicManager,
    reorder,
  }: {
    isAdmin: boolean;
    category: CollectionCategory;
    topicManager: Topics;
    reorder: <T>(list: T[], from: number, to: number) => void;
  } = $props();

  let debounceTimeout: NodeJS.Timeout;

  let workingCategory = $state<CollectionCategory>(category);

  let expandedCategories = $state<Set<string>>(new Set());

  let draggedTopic = $state<CollectionTopic | null>(null);

  function setDraggedTopic(topic: CollectionTopic | null) {
    draggedTopic = topic;
  }

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
  }

  async function toggleExpandCategory(categoryId: string) {
    const newSet = new Set(expandedCategories);
    if (newSet.has(categoryId)) {
      newSet.delete(categoryId);
    } else {
      newSet.add(categoryId);

      // load topics if not already loaded
      fetchTopicCollection(categoryId);
    }
    expandedCategories = newSet;
  }

  const selectInput = (event: Event) => {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    input.select();
  };

  function handleChangeCategoryOrder(event: Event, category_id: string) {
    clearTimeout(debounceTimeout);
    const input = event.target as HTMLInputElement;

    debounceTimeout = setTimeout(async () => {
      if (input.value == '') input.value = '0';

      // await topicManager.changeSortOrderInCategory(
      //   category_id,
      //   Number(input.value),
      // );

      // await fetchCollections();
    }, 1000);
  }

  function handleChangeTopicOrder(
    event: Event,
    topic_id: string,
    category_id: string,
  ) {
    clearTimeout(debounceTimeout);
    const input = event.target as HTMLInputElement;

    debounceTimeout = setTimeout(async () => {
      if (input.value == '') input.value = '0';

      await topicManager.changeSortOrderInCategory(
        topic_id,
        category_id,
        Number(input.value),
      );

      await fetchTopicCollection(category_id, true);
    }, 1000);
  }

  async function toggleAvailability(topic_id: string, available: boolean) {
    await topicManager.changeAvailability(topic_id, available);
    await fetchTopicCollection(workingCategory.category_id, true);
  }

  async function toggleVisibility(
    topic_id: string,
    visibility: 'public' | 'private',
  ) {
    await topicManager.changeVisibility(topic_id, visibility);
    await fetchTopicCollection(workingCategory.category_id, true);
  }

  async function submitTopic(topic_id: string) {
    await topicManager.submitTopic(topic_id);
    await fetchTopicCollection(workingCategory.category_id, true);
  }

  function moveTopicToCategory(
    topic: CollectionTopic,
    targetCategory: CollectionCategory,
  ) {
    // Remove from old category
    workingCategory.topics = (workingCategory.topics || []).filter(
      (t) => t.topic_id !== topic.topic_id,
    );

    // Add to new category
    if (!targetCategory.topics) {
      targetCategory.topics = [];
    }
    targetCategory.topics.push(topic);

    topicManager.moveTopic(topic.topic_id, targetCategory.category_id);
  }
</script>

<div
  class="category"
  role="listitem"
  draggable="true"
  ondragover={() => {}}
  ondrop={() =>
    draggedTopic && moveTopicToCategory(draggedTopic, workingCategory)}
>
  <button
    type="button"
    class="category-toggle"
    aria-expanded={expandedCategories.has(workingCategory.category_id)}
    onclick={() => toggleExpandCategory(workingCategory.category_id)}
    onkeydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        toggleExpandCategory(workingCategory.category_id);
      }
    }}
  >
    <h4>{workingCategory.category_name}</h4>
    <input
      id="category-order-{workingCategory.category_id}"
      type="number"
      value={workingCategory.category_order}
      onclick={selectInput}
      min="1"
      max="99"
      oninput={(event) =>
        handleChangeCategoryOrder(event, workingCategory.category_id)}
    />
  </button>

  {#if expandedCategories.has(workingCategory.category_id)}
    {#if workingCategory.topics && workingCategory.topics.length > 0}
      <ul>
        {#each workingCategory.topics as topic, i}
          <li
            draggable="true"
            ondragstart={() => setDraggedTopic(topic)}
            ondragend={() => setDraggedTopic(null)}
          >
            <div class="tile">
              <a href={NAV_ROUTES.EXPLORE(topic.topic_id)}>
                <span>{topic.topic_name}</span>
                <div class="input-container">
                  <label for="story-order-{topic.topic_id}">Order</label>
                  <input
                    id="story-order-{topic.topic_id}"
                    type="number"
                    value={topic.order}
                    onclick={selectInput}
                    min="1"
                    max="99"
                    oninput={(event) =>
                      handleChangeTopicOrder(
                        event,
                        topic.topic_id,
                        workingCategory.category_id,
                      )}
                  />
                </div>
              </a>
              <div class="toggle-container">
                <div class="toggle-container-inner">
                  <button
                    use:tippy={{
                      content: 'Toggle availability',
                      animation: 'scale',
                    }}
                    class:green-btn={topic.available === true}
                    class:red-btn={topic.available === false}
                    onclick={() =>
                      toggleAvailability(topic.topic_id, !topic.available)}
                  >
                    {topic.available ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    use:tippy={{
                      content: 'Submit Topic for review',
                      animation: 'scale',
                      theme: 'light',
                    }}
                    onclick={() => submitTopic(topic.topic_id)}
                    disabled={topic.visibility === 'public'}
                  >
                    {topic.visibility === 'public' ? 'Submitted' : 'Submit'}
                  </button>
                </div>
                {#if isAdmin}
                  <button
                    use:tippy={{
                      content: 'Toggle visibility',
                      animation: 'scale',
                    }}
                    onclick={() =>
                      toggleVisibility(
                        topic.topic_id,
                        topic.visibility === 'public' ? 'private' : 'public',
                      )}
                    disabled={topic.available === false || !isAdmin}
                  >
                    {topic.visibility === 'public'
                      ? 'Make Private'
                      : 'Make Public'}
                  </button>
                {/if}
              </div>
              <div class="toggle-container-inner">
                {#if i > 0}
                  <button
                    class="reorder-left"
                    onclick={() =>
                      reorder(workingCategory.topics ?? [], i, i - 1)}
                    >left</button
                  >
                {/if}
                {#if i < workingCategory.topics.length - 1}
                  <button
                    class="reorder-right"
                    onclick={() =>
                      reorder(workingCategory.topics ?? [], i, i + 1)}
                    >right</button
                  >
                {/if}
              </div>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  {/if}
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

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

    ul {
      display: flex;
      flex-wrap: wrap; // or nowrap if you want them in a row
      gap: 1rem;
      padding: 0;
      margin: 0.5rem 0 0;
      list-style: none;
      max-width: 100%;
      overflow: hidden; // ul itself won't scroll
    }

    li {
      flex: 0 0 auto;
      min-width: 200px;
      max-width: 100%;
      box-sizing: border-box;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 0.5rem;
      padding: 0.75rem;

      /* Add scrolling to the li content itself */
      overflow-x: auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.3) transparent;

      &::-webkit-scrollbar {
        height: 8px;
      }
      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
      }

      .tile {
        color: white;
        text-decoration: none;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        input[type='number'] {
          width: 5rem;
          @include dark-blue(0.75);
        }

        .input-container {
          @include respond-up(tablet) {
            flex-direction: row;

            label {
              position: static;
            }
          }
        }

        span {
          font-weight: 500;
          font-size: 1rem;
        }

        .toggle-container {
          display: flex;
          flex-direction: column; /* stack children vertically */
          gap: 0.5rem;
          z-index: 100;
        }

        .toggle-container-inner {
          display: flex;
          flex-direction: row; /* ensure items inside go side by side */
          gap: 0.5rem;
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
  }

  @include mobile-only {
    .category li {
      min-width: 150px;
    }

    .category-toggle h4 {
      font-size: 1rem;
    }
  }
</style>
