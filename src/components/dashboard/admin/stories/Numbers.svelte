<script lang="ts">
  import AdminApp from '@lib/admin';

  import TopTopics from '@components/dashboard/admin/stories/TopTopics.svelte';
  import LoadingSVG from '@components/icons/Loading.svelte';

  const admin: AdminApp = new AdminApp();

  const getEndDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const dateRange = $state<{ start_date: string; end_date: string }>({
    start_date: '2023-01-01',
    end_date: getEndDate(),
  });

  let topicCount = $state<number | null>(null);
  let fetchingTopicCount = $state<boolean>(false);

  let storyCount = $state<number | null>(null);
  let fetchingStoryCount = $state<boolean>(false);

  let topicGrowth = $state<number | null>(null);
  let fetchingTopicGrowth = $state<boolean>(false);

  let storyGrowth = $state<number | null>(null);
  let fetchingStoryGrowth = $state<boolean>(false);

  const topicMetrics = $state<TopicMetricFilter>({
    start_date: dateRange.start_date,
    end_date: dateRange.end_date,
    available: undefined,
    visibility: undefined,
  });

  let topicAvailability = $state<'' | 'available' | 'unavailable'>('');
  let topicVisibility = $state<'' | 'public' | 'private'>('');

  const storyMetrics = $state<StoryMetricFilter>({
    start_date: dateRange.start_date,
    end_date: dateRange.end_date,
    topic_id: undefined,
    account_id: undefined,
    ended: undefined,
  });

  let storyCompletion = $state<'' | 'completed' | 'active'>('');

  $effect(() => {
    topicMetrics.start_date = dateRange.start_date;
    topicMetrics.end_date = dateRange.end_date;
    storyMetrics.start_date = dateRange.start_date;
    storyMetrics.end_date = dateRange.end_date;
  });

  $effect(() => {
    topicMetrics.available =
      topicAvailability === '' ? undefined : topicAvailability === 'available';
  });

  $effect(() => {
    topicMetrics.visibility =
      topicVisibility === '' ? undefined : topicVisibility;
  });

  $effect(() => {
    storyMetrics.ended =
      storyCompletion === '' ? undefined : storyCompletion === 'completed';
  });

  const getTopicsCount = async () => {
    fetchingTopicCount = true;
    const cnt = await admin.fetchTopicCount(topicMetrics);
    if (cnt !== null) topicCount = cnt;
    fetchingTopicCount = false;
  };

  const getStoriesCount = async () => {
    fetchingStoryCount = true;
    const cnt = await admin.fetchStoryCount(storyMetrics);
    if (cnt !== null) storyCount = cnt;
    fetchingStoryCount = false;
  };

  const getTopicGrowth = async () => {
    fetchingTopicGrowth = true;
    const growth = await admin.fetchTopicGrowth(topicMetrics);
    if (growth !== null) topicGrowth = growth;
    fetchingTopicGrowth = false;
  };

  const getStoryGrowth = async () => {
    fetchingStoryGrowth = true;
    const growth = await admin.fetchStoryGrowth(storyMetrics);
    if (growth !== null) storyGrowth = growth;
    fetchingStoryGrowth = false;
  };
</script>

<section class="dream-container">
  <div class="flex-row">
    <h4>Date Range</h4>
    <div class="container">
      <div class="input-container">
        <label for="accounts-start-date"> From </label>
        <input
          id="accounts-start-date"
          type="date"
          bind:value={dateRange.start_date}
          min="2022-01-01"
          max={new Date().toISOString().split('T')[0]}
        />
      </div>
      <div class="input-container">
        <label for="accounts-end-date"> To </label>
        <input
          id="accounts-end-date"
          type="date"
          bind:value={dateRange.end_date}
          min="2024-01-01"
          max={new Date().toISOString().split('T')[0]}
        />
      </div>
    </div>
  </div>
  <div class="flex-row">
    <h4>Topics</h4>
    <div class="container">
      <div class="input-container">
        <label for="topics-availability"> Availability </label>
        <select id="topics-availability" bind:value={topicAvailability}>
          <option value="">All Topics</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>
      <div class="input-container">
        <label for="topics-visibility"> Visibility </label>
        <select id="topics-visibility" bind:value={topicVisibility}>
          <option value="">All Topics</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>
    </div>
  </div>

  <div class="flex-row">
    <h4>Stories</h4>
    <div class="container flex-wrap">
      <!-- <div class="input-container">
        <label for="stories-topic-id"> Topic ID </label>
        <input
          id="stories-topic-id"
          type="text"
          bind:value={storyMetrics.topic_id}
          placeholder="optional"
        />
      </div>
      <div class="input-container">
        <label for="stories-account-id"> Account ID </label>
        <input
          id="stories-account-id"
          type="text"
          bind:value={storyMetrics.account_id}
          placeholder="optional"
        />
      </div> -->
      <div class="input-container">
        <label for="stories-completion"> Status </label>
        <select id="stories-completion" bind:value={storyCompletion}>
          <option value="">All Stories</option>
          <option value="completed">Completed</option>
          <option value="active">In progress</option>
        </select>
      </div>
    </div>
  </div>

  <hr />

  <div class="flex-row">
    <h4>Total Topics</h4>
    <div class="container">
      <h5 class="text-glowing">
        {#if topicCount !== null}
          {topicCount} topics
        {:else}
          Click to fetch count
        {/if}
      </h5>
      <button onclick={getTopicsCount} disabled={fetchingTopicCount}>
        {#if fetchingTopicCount}
          <LoadingSVG />
          Loading...
        {:else}
          Fetch Data
        {/if}
      </button>
    </div>
  </div>
  <div class="flex-row">
    <h4>Total Stories</h4>
    <div class="container">
      <h5 class="text-glowing">
        {#if storyCount !== null}
          {storyCount} stories
        {:else}
          Click to fetch count
        {/if}
      </h5>
      <button onclick={getStoriesCount} disabled={fetchingStoryCount}>
        {#if fetchingStoryCount}
          <LoadingSVG />
          Loading...
        {:else}
          Fetch Data
        {/if}
      </button>
    </div>
  </div>

  <div class="flex-row">
    <h4>Topic Growth</h4>
    <div class="container">
      <h5 class="text-glowing">
        {#if topicGrowth !== null}
          {topicGrowth > 0 ? '+' : ''}{topicGrowth} topics
        {:else}
          Click to fetch count
        {/if}
      </h5>
      <button onclick={getTopicGrowth} disabled={fetchingTopicGrowth}>
        {#if fetchingTopicGrowth}
          <LoadingSVG />
          Loading...
        {:else}
          Fetch Data
        {/if}
      </button>
    </div>
  </div>
  <div class="flex-row">
    <h4>Story Growth</h4>
    <div class="container">
      <h5 class="text-glowing">
        {#if storyGrowth !== null}
          {storyGrowth > 0 ? '+' : ''}{storyGrowth} stories
        {:else}
          Click to fetch count
        {/if}
      </h5>
      <button onclick={getStoryGrowth} disabled={fetchingStoryGrowth}>
        {#if fetchingStoryGrowth}
          <LoadingSVG />
          Loading...
        {:else}
          Fetch Data
        {/if}
      </button>
    </div>
  </div>

  <hr />

  <TopTopics {dateRange} />
</section>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  input[type='date'] {
    &::-webkit-calendar-picker-indicator {
      filter: brightness(0) saturate(100%) invert(1);
    }
  }

  h5 {
    width: 100%;
  }

  .flex-wrap {
    flex-wrap: wrap;
  }
</style>
