<script lang="ts">
  import { onMount } from 'svelte';

  import Account from '@lib/account';
  import { blankImage, serveUrl } from '@constants/media';
  import {
    GetCache,
    SetCache,
    FINISHED_STORIES_RANGE_KEY,
  } from '@constants/cache';

  let account: Account = new Account();

  let finishedStories = $state<DashboardTopic[] | null>(null);

  let timeRanges: DurationEnum[] = [
    '1 DAY',
    '2 DAYS',
    '5 DAYS',
    '10 DAYS',
    '1 WEEK',
    '1 MONTH',
  ];
  let selectedRange = $state<DurationEnum | null>(null);

  const fetchFinishedStories = async (range: DurationEnum) => {
    SetCache(FINISHED_STORIES_RANGE_KEY, range);
    finishedStories = await account.getUserStories(range, true);
  };

  $effect(() => {
    if (selectedRange) fetchFinishedStories(selectedRange);
  });

  onMount(() => {
    const cachedRange = GetCache<DurationEnum>(FINISHED_STORIES_RANGE_KEY);
    if (cachedRange && timeRanges.includes(cachedRange))
      selectedRange = cachedRange;
    else selectedRange = timeRanges[0];
  });
</script>

<div class="collection-header dashboard-collection-header">
  <h4>Completed Runs</h4>

  <div class="input-container">
    <label for="finished-stories-timerange">Finished in</label>
    <select id="finished-stories-timerange" bind:value={selectedRange}>
      {#each timeRanges as range}
        <option value={range}>{range.toLocaleLowerCase()}</option>
      {/each}
    </select>
  </div>
</div>

<div class="tiles-collection dashboard-collection">
  {#if !finishedStories}
    <h5 class="empty-title flex text-glowing">
      Your finished stories will be there
    </h5>
  {:else}
    {#each finishedStories as topic}
      <a
        class="tile gray-tile"
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
      </a>
    {/each}
  {/if}
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .collection-header {
    @include gray(0.25);
  }

  .tiles-collection {
    animation: none;
    @include gray(0.1);
  }
</style>
