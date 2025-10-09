<script lang="ts">
  import { tippy } from 'svelte-tippy';

  import { NAV_ROUTES } from '@constants/routes';
  import Topics from '@lib/topics';

  import SelectorSVG from '@components/icons/Selector.svelte';

  let {
    isAdmin,
    category,
    topicManager,
  }: {
    isAdmin: boolean;
    category: CollectionCategory;
    topicManager: Topics;
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

<button
  type="button"
  class="category-toggle void-btn flex-row fade-in"
  class:active={expandedCategories.has(workingCategory.category_id)}
  aria-expanded={expandedCategories.has(workingCategory.category_id)}
  onclick={() => toggleExpandCategory(workingCategory.category_id)}
  onkeydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggleExpandCategory(workingCategory.category_id);
    }
  }}
  disabled={workingCategory.topic_count === 0}
>
  <span class="flex-row gap round-8">
    <h5>Order:</h5>
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
  </span>
  <h4>{workingCategory.category_name}</h4>
  <span class="flex-row gap round-8">
    <h5>Topics: {workingCategory.topic_count}</h5>
    <SelectorSVG
      focused={null}
      disabled={false}
      hideForMobiles={false}
      rotate={expandedCategories.has(workingCategory.category_id) ? '90' : '0'}
    />
  </span>
</button>

{#if expandedCategories.has(workingCategory.category_id)}
  {#if workingCategory.topics && workingCategory.topics.length > 0}
    <section class="tiles-collection fade-in">
      {#each workingCategory.topics as topic, i}
        <a
          class="tile"
          href={NAV_ROUTES.EXPLORE(topic.topic_id)}
          target="_blank"
        >
          <h5>{topic.topic_name}</h5>
          <div class="flex">
            <span class="input-container">
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
            </span>
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
                {topic.visibility === 'public' ? 'Make Private' : 'Make Public'}
              </button>
            {/if}
          </div>
        </a>
      {/each}
    </section>
  {/if}
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .category-toggle {
    width: calc(100% + 3rem);
    margin-inline: -1.5rem;
    justify-content: space-between;
    padding: 0.5rem;
    stroke: $white;
    fill: $white;
    @include blue;
    @include white-txt(1);

    @include respond-up(small-desktop) {
      margin-inline: 0;
    }

    &.active {
      @include deep-green;
    }

    &:hover,
    &:active,
    &:focus-visible {
      @include bright;
    }

    &:disabled {
      fill: $dark-blue;
      stroke: $dark-blue;
    }

    h4 {
      width: auto;
    }

    span {
      h5 {
        display: none;
      }

      @include respond-up(tablet) {
        width: 10rem;
        height: 100%;
        padding: 0.5rem;
        background-color: rgba(0, 0, 0, 0.5);
        @include dark-border;

        h5 {
          display: block;
        }
      }
    }
  }

  .tiles-collection {
    width: calc(100% + 3rem);
    margin-inline: -1.5rem;
    margin-top: -1.5rem;

    @include respond-up(small-desktop) {
      margin-inline: 0;
    }

    .tile {
      div {
        width: 100%;
        flex-flow: column nowrap;
        gap: 1rem;
        padding: 1rem;
        border-radius: 0.75rem;
        @include box-shadow(soft, inset);
        @include dark-blue(0.5);
      }
    }
  }
</style>
