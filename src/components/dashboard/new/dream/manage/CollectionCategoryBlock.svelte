<script lang="ts">
  import { tippy } from 'svelte-tippy';

  import Topics from '@lib/topics';

  import { NAV_ROUTES } from '@constants/routes';

  let {
    category,
    expandedCategories,
    toggleExpandCategory,
    topicManager,
    reorder,
  }: {
    category: CollectionCategory;
    expandedCategories: Set<string>;
    toggleExpandCategory: (
      id: string,
      categories: CollectionCategory[],
    ) => void;
    topicManager: Topics;
    reorder: <T>(list: T[], from: number, to: number) => void;
  } = $props();

  let debounceTimeout: NodeJS.Timeout;

  let draggedTopic = $state<CollectionTopic | null>(null);
  function setDraggedTopic(topic: CollectionTopic | null) {
    draggedTopic = topic;
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

      // await fetchCollections();
    }, 1000);
  }

  function toggleAvailability(topic_id: string, available: boolean) {
    topicManager.changeAvailability(topic_id, available);
  }

  function toggleVisibility(
    topic_id: string,
    visibility: 'public' | 'private',
  ) {
    topicManager.changeVisibility(topic_id, visibility);
  }

  function moveTopicToCategory(
    topic: CollectionTopic,
    targetCategory: CollectionCategory,
  ) {
    // Remove from old category
    category.topics = (category.topics || []).filter(
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
  ondrop={() => draggedTopic && moveTopicToCategory(draggedTopic, category)}
>
  <button
    type="button"
    class="category-toggle"
    aria-expanded={expandedCategories.has(category.category_id)}
    onclick={() => toggleExpandCategory(category.category_id, [category])}
    onkeydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        toggleExpandCategory(category.category_id, [category]);
      }
    }}
  >
    <h4>{category.category_name}</h4>
    <input
      id="category-order-{category.category_id}"
      type="number"
      value={category.category_order}
      onclick={selectInput}
      min="1"
      max="99"
      oninput={(event) =>
        handleChangeCategoryOrder(event, category.category_id)}
    />
  </button>

  {#if expandedCategories.has(category.category_id)}
    {#if category.topics && category.topics.length > 0}
      <ul>
        {#each category.topics as topic, i}
          <li
            draggable="true"
            ondragstart={() => setDraggedTopic(topic)}
            ondragend={() => setDraggedTopic(null)}
          >
            <a class="tile" href={NAV_ROUTES.EXPLORE(topic.topic_id)}>
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
                      category.category_id,
                    )}
                />
              </div>
              <div class="toggle-container">
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
                    content: 'Toggle visibility',
                    animation: 'scale',
                  }}
                  onclick={() =>
                    toggleVisibility(
                      topic.topic_id,
                      topic.visibility === 'public' ? 'private' : 'public',
                    )}
                >
                  {topic.visibility === 'public'
                    ? 'Make Private'
                    : 'Make Public'}
                </button>
              </div>
              {#if i > 0}
                <button
                  class="reorder-left"
                  onclick={() => reorder(category.topics ?? [], i, i - 1)}
                  >left</button
                >
              {/if}
              {#if i < category.topics.length - 1}
                <button
                  class="reorder-right"
                  onclick={() => reorder(category.topics ?? [], i, i + 1)}
                  >right</button
                >
              {/if}
            </a>
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
      list-style: none;
      padding: 0;
      margin: 0.5rem 0 0;
      display: flex;
      flex-direction: row;
      gap: 1rem;
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
    }

    li {
      flex: 0 0 auto; /* fixed-size tile in row */
      min-width: 200px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 0.5rem;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

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

  @media (max-width: 768px) {
    .category li {
      min-width: 150px;
    }

    .category-toggle h4 {
      font-size: 1rem;
    }
  }

  /* Categories stay stacked */
  // .category {
  //   margin-left: 1rem;
  //   padding-left: 1rem;
  //   border-left: 2px solid rgba(255, 255, 255, 0.15);
  //   display: flex;
  //   flex-direction: column;
  //   gap: 0.75rem;

  //   .category-toggle {
  //     background: transparent;
  //     border: none;
  //     cursor: pointer;
  //     text-align: left;

  //     h4 {
  //       margin: 0;
  //       font-size: 1.1rem;
  //       font-weight: 500;
  //     }
  //   }
  // }

  // /* Topics container → horizontal scroll */
  // .category ul {
  //   list-style: none;
  //   padding: 0;
  //   margin: 0.5rem 0 0;
  //   display: flex;
  //   flex-direction: row;
  //   gap: 1rem;
  //   overflow-x: auto;
  //   scrollbar-width: thin;
  //   scrollbar-color: rgba(255, 255, 255, 0.3) transparent;

  //   /* Webkit scrollbar styling */
  //   &::-webkit-scrollbar {
  //     height: 8px;
  //   }
  //   &::-webkit-scrollbar-thumb {
  //     background: rgba(255, 255, 255, 0.2);
  //     border-radius: 4px;
  //   }
  // }

  // /* Each topic tile */
  // .tiles-collection {
  //   flex: 0 0 auto; /* prevent shrinking */
  //   min-width: 200px;
  //   background: rgba(255, 255, 255, 0.05);
  //   border-radius: 0.5rem;
  //   padding: 0.75rem;
  //   display: flex;
  //   flex-direction: column;
  //   justify-content: space-between;
  //   gap: 0.5rem;

  //   .tile {
  //     color: white;
  //     text-decoration: none;
  //     display: flex;
  //     flex-direction: column;
  //     gap: 0.5rem;

  //     span {
  //       font-weight: 500;
  //       font-size: 1rem;
  //     }

  //     button {
  //       padding: 0.3rem 0.6rem;
  //       border-radius: 0.4rem;
  //       font-size: 0.8rem;
  //       border: none;
  //       cursor: pointer;
  //       background: rgba(100, 181, 246, 0.15);
  //       color: #90caf9;
  //       transition: background 0.2s;

  //       &:hover {
  //         background: rgba(100, 181, 246, 0.3);
  //       }
  //     }
  //   }
  // }

  // /* Responsive tweaks */
  // @media (max-width: 768px) {
  //   .tiles-collection {
  //     min-width: 150px;
  //   }

  //   .category-toggle h4 {
  //     font-size: 1rem;
  //   }
  // }
</style>
