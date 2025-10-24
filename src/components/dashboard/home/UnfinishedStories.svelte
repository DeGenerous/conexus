<script lang="ts">
  import { onMount } from 'svelte';

  import Account from '@lib/account';
  import { blankImage, serveUrl } from '@constants/media';
  import {
    GetCache,
    SetCache,
    UNFINISHED_STORIES_RANGE_KEY,
  } from '@constants/cache';

  let account: Account = new Account();

  let unfinishedStories = $state<UserStoriesMetric[] | null>(null);

  let timeRanges: DurationEnum[] = [
    '1 DAY',
    '2 DAYS',
    '5 DAYS',
    '10 DAYS',
    '1 WEEK',
    '1 MONTH',
  ];
  let selectedRange = $state<DurationEnum | null>(null);

  const fetchUnfinishedStories = async (range: DurationEnum) => {
    SetCache(UNFINISHED_STORIES_RANGE_KEY, range);
    unfinishedStories = await account.getUserStories(range);
  };

  $effect(() => {
    if (selectedRange) fetchUnfinishedStories(selectedRange);
  });

  onMount(() => {
    const cachedRange = GetCache<DurationEnum>(UNFINISHED_STORIES_RANGE_KEY);
    if (cachedRange && timeRanges.includes(cachedRange))
      selectedRange = cachedRange;
    else selectedRange = timeRanges[0];
  });
</script>

<div class="collection-header dashboard-collection-header">
  <h4>Continue Shaping</h4>

  <div class="input-container">
    <label for="unfinished-stories-timerange">Unfinished for</label>
    <select id="unfinished-stories-timerange" bind:value={selectedRange}>
      {#each timeRanges as range}
        <option value={range}>{range.toLocaleLowerCase()}</option>
      {/each}
    </select>
  </div>
</div>

<div class="tiles-collection dashboard-collection">
  {#if !unfinishedStories}
    <h5 class="empty-title flex text-glowing">
      Your unfinished stories will be there
    </h5>
  {:else}
    {#each unfinishedStories as topic}
      <a
        class="tile"
        href="/c/CommunityPicks/{topic.topic_id}?title={topic.name}"
      >
        <img
          loading="lazy"
          src={serveUrl(topic.tile_file_url) ?? blankImage}
          alt={topic.name}
          draggable="false"
          height="1024"
          width="1024"
        />
        <h5>{topic.name}</h5>
        <div class="tile-data flex">
          <p>Stories Played: {topic.story_count}</p>
        </div>
      </a>
    {/each}
  {/if}
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .tiles-collection {
    animation: none;
    @include blue(0.1);
  }
</style>
