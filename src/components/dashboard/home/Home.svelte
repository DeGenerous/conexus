<script lang="ts">
  import { onMount } from 'svelte';

  import Account from '@lib/account';
  import { NAV_ROUTES } from '@constants/routes';
  import { blankImage, serveUrl } from '@constants/media';
  import { GetCache, SetCache, UNFINISHED_STORIES_RANGE_KEY } from '@constants/cache';

  let account: Account = new Account();

  let unfinishedStories = $state<DashboardTopic[] | null>(null);

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
      if (cachedRange && timeRanges.includes(cachedRange)) selectedRange = cachedRange;
      else selectedRange = timeRanges[0];
  })
</script>

<h2>Continue Shaping</h2>

<div class="input-container">
  <label for="unfinished-stories-timerange">Unfinished for</label>
  <select id="unfinished-stories-timerange" bind:value={selectedRange}>
    {#each timeRanges as range}
      <option value={range}>{range.toLocaleLowerCase()}</option>
    {/each}
  </select>
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
      </a>
    {/each}
  {/if}
</div>

<footer class="flex">
  <h5>Report bugs or ask for help</h5>
  <div class="flex-row gap">
    <a href={NAV_ROUTES.SUPPORT}>Support</a>
    <span aria-hidden="true">|</span>
    <a href={NAV_ROUTES.DISCORD}>Discord</a>
    <span aria-hidden="true">|</span>
    <a href={NAV_ROUTES.FAQ}>FAQ</a>
    <span aria-hidden="true">|</span>
    <a href={NAV_ROUTES.BLOG}>Blog</a>
  </div>
</footer>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  footer {
    width: 100%;
    margin-top: auto;
    @include white-txt;
  }
</style>
