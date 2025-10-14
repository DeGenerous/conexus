<script lang="ts">
  import { dndzone, type DndEvent } from 'svelte-dnd-action';
  import { tippy } from 'svelte-tippy';

  import { NAV_ROUTES } from '@constants/routes';
  import Topics from '@lib/topics';
  import { SetCache, MANAGE_CATEGORY_TOPICS_KEY } from '@constants/cache';

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

  let workingCategory = $state<CollectionCategory>(category);
  let expandedCategories = $state<Set<string>>(new Set());

  type DraggableTopic = CollectionTopic & { id: string };

  function createTopicItems(
    topics: CollectionTopic[] = workingCategory.topics ?? [],
  ): DraggableTopic[] {
    return topics.map((topic) => ({
      ...topic,
      id: topic.topic_id,
    }));
  }

  let topicItems = $state<DraggableTopic[]>(createTopicItems());

  function syncTopicItems(
    topics: CollectionTopic[] = workingCategory.topics ?? [],
  ) {
    topicItems = createTopicItems(topics);
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
    workingCategory.topic_count = workingCategory.topics?.length ?? 0;
    SetCache(
      MANAGE_CATEGORY_TOPICS_KEY(workingCategory.category_id),
      workingCategory.topics ?? [],
    );
    syncTopicItems(workingCategory.topics ?? []);
  }

  $effect(() => {
    const incoming = category;
    const idChanged = workingCategory.category_id !== incoming.category_id;

    if (idChanged) {
      const topics = incoming.topics ?? workingCategory.topics ?? [];
      workingCategory = {
        ...incoming,
        topics,
        topic_count: topics.length || incoming.topic_count,
      };
      syncTopicItems(workingCategory.topics ?? []);
      return;
    }

    const orderChanged =
      workingCategory.category_order !== incoming.category_order;
    const nameChanged =
      workingCategory.category_name !== incoming.category_name;
    const countChanged =
      incoming.topic_count !== undefined &&
      workingCategory.topic_count !== incoming.topic_count;

    if (orderChanged || nameChanged || countChanged) {
      workingCategory = {
        ...workingCategory,
        category_order: incoming.category_order,
        category_name: incoming.category_name,
        topic_count:
          incoming.topic_count ??
          workingCategory.topic_count ??
          workingCategory.topics?.length ??
          0,
      };
    }

    if (incoming.topics && incoming.topics !== workingCategory.topics) {
      workingCategory = {
        ...workingCategory,
        topics: incoming.topics,
        topic_count: incoming.topics.length,
      };
      syncTopicItems(incoming.topics);
    }
  });

  async function toggleExpandCategory(categoryId: string) {
    if (workingCategory.topic_count === 0) return;
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

  async function toggleAvailability(
    event: Event,
    topic_id: string,
    available: boolean,
  ) {
    event.preventDefault();
    await topicManager.changeAvailability(topic_id, available);
    await fetchTopicCollection(workingCategory.category_id, true);
  }

  async function toggleVisibility(
    event: Event,
    topic_id: string,
    visibility: 'public' | 'private',
  ) {
    event.preventDefault();
    await topicManager.changeVisibility(topic_id, visibility);
    await fetchTopicCollection(workingCategory.category_id, true);
  }

  async function submitTopic(event: Event, topic_id: string) {
    event.preventDefault();
    await topicManager.submitTopic(topic_id);
    await fetchTopicCollection(workingCategory.category_id, true);
  }

  function handleTopicsConsider(event: CustomEvent<DndEvent<DraggableTopic>>) {
    topicItems = event.detail.items as DraggableTopic[];
  }

  function handleTopicsFinalize(event: CustomEvent<DndEvent<DraggableTopic>>) {
    const updated = event.detail.items.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    topicItems = updated;
    workingCategory.topics = updated.map(({ id, ...rest }) => ({ ...rest }));
    workingCategory.topic_count = workingCategory.topics?.length ?? 0;

    console.log('[Collections] Topic order updated', {
      categoryId: workingCategory.category_id,
      topics: updated.map(({ topic_id, order }) => ({ topic_id, order })),
    });
  }
</script>

<button
  type="button"
  class="category-toggle void-btn fade-in"
  class:active={expandedCategories.has(workingCategory.category_id)}
  class:disabled={workingCategory.topic_count === 0}
  aria-expanded={expandedCategories.has(workingCategory.category_id)}
  onclick={() => toggleExpandCategory(workingCategory.category_id)}
  onkeydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggleExpandCategory(workingCategory.category_id);
    }
  }}
>
  <div class="flex-row">
    <span class="flex-row gap round-8">
      <h5>Order:</h5>
      <input
        id="category-order-{workingCategory.category_id}"
        type="number"
        value={workingCategory.category_order}
        onclick={selectInput}
        min="1"
        max="99"
        readonly
      />
    </span>
    <h4>{workingCategory.category_name}</h4>
    <span class="flex-row gap round-8">
      <h5>Topics: {workingCategory.topic_count}</h5>
      <SelectorSVG
        focused={null}
        disabled={false}
        hideForMobiles={false}
        rotate={expandedCategories.has(workingCategory.category_id)
          ? '90'
          : '0'}
      />
    </span>
  </div>
</button>

{#if expandedCategories.has(workingCategory.category_id)}
  {#if topicItems && topicItems.length > 0}
    <section
      class="tiles-collection fade-in"
      use:dndzone={{
        items: topicItems,
        type: `topics-${workingCategory.category_id}`,
      }}
      onconsider={handleTopicsConsider}
      onfinalize={handleTopicsFinalize}
    >
      {#each topicItems as topic (topic.id)}
        <a class="tile" href={NAV_ROUTES.EXPLORE(topic.topic_id)}>
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
                readonly
              />
            </span>
            <button
              use:tippy={{
                content: 'Toggle availability',
                animation: 'scale',
              }}
              class:green-btn={topic.available === true}
              class:red-btn={topic.available === false}
              onclick={(event) =>
                toggleAvailability(event, topic.topic_id, !topic.available)}
            >
              {topic.available ? 'Available' : 'Unavailable'}
            </button>
            <!-- <button
              use:tippy={{
                content: 'Submit Topic for review',
                animation: 'scale',
                theme: 'light',
              }}
              onclick={(event) => submitTopic(event, topic.topic_id)}
              disabled={topic.visibility === 'public'}
            >
              {topic.visibility === 'public' ? 'Submitted' : 'Submit'}
            </button> -->
            {#if isAdmin}
              <button
                use:tippy={{
                  content: 'Toggle visibility',
                  animation: 'scale',
                }}
                onclick={(event) =>
                  toggleVisibility(
                    event,
                    topic.topic_id,
                    topic.visibility === 'public' ? 'private' : 'public',
                  )}
                disabled={topic.available === false && !isAdmin}
              >
                {topic.visibility === 'public' ? 'Public' : 'Private'}
              </button>
            {/if}
          </div>
        </a>
      {/each}
    </section>
  {:else}
    <p class="validation">No topics found</p>
  {/if}
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .category-toggle {
    width: 100%;
    padding: 0.5rem;
    stroke: $white;
    fill: $white;
    @include navy;
    @include white-txt(1);

    &.active {
      @include blue;
    }

    &.disabled {
      cursor: not-allowed;
      @include gray(0.25);
    }

    &:hover,
    &:active,
    &:focus-visible {
      @include bright;
    }

    div {
      justify-content: space-between;

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
            display: flex;
            align-items: center;
            height: 3rem;
          }
        }
      }
    }
  }

  .tiles-collection {
    width: 100%;
    min-height: unset;

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
