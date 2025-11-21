<script lang="ts">
  import { onMount } from 'svelte';

  import Account from '@lib/account';
  import { blankImage, serveUrl } from '@constants/media';
  import {
    GetCache,
    SetCache,
    UNFINISHED_STORIES_RANGE_KEY,
  } from '@constants/cache';
  import { resolveRenderableImage } from '@utils/file-validation';

  let account: Account = new Account();

  let unfinishedStories = $state<UserStoriesMetric[] | null>(null);
  let tileImages = $state<Record<string, string>>({});

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

  // Map unfinished topics to guarded preview URLs
  $effect(() => {
    const topics = unfinishedStories;
    if (!topics) {
      tileImages = {};
      return;
    }

    let cancelled = false;

    tileImages = Object.fromEntries(
      topics.map((topic) => {
        const key = String(topic.topic_id);
        const candidate = serveUrl(topic.tile_file_url);
        return [key, candidate] as const;
      }),
    );

    (async () => {
      const entries = await Promise.all(
        topics.map(async (topic) => {
          const key = String(topic.topic_id);
          const candidate = serveUrl(topic.tile_file_url);
          const safe = await resolveRenderableImage(candidate);
          return { key, candidate, safe };
        }),
      );
      if (!cancelled) {
        const overrides = entries.filter(
          ({ candidate, safe }) => safe !== candidate,
        );
        if (overrides.length) {
          tileImages = {
            ...tileImages,
            ...Object.fromEntries(
              overrides.map(({ key, safe }) => [key, safe] as const),
            ),
          };
        }
      }
    })();

    return () => {
      cancelled = true;
    };
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
    <h5 class="empty-title flex soft-white-txt">
      Your unfinished stories will be there
    </h5>
  {:else}
    {#each unfinishedStories as topic}
      <a
        class="tile"
        href="/{topic.creator
          ? 'c'
          : 's'}/{topic.route_name}/{topic.topic_id}?title={topic.name}"
      >
        <img
          loading="lazy"
          src={tileImages[String(topic.topic_id)] ?? blankImage}
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
