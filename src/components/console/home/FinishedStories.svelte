<script lang="ts">
  import { onMount } from 'svelte';

  import Account from '@lib/account';
  import { blankImage, serveUrl } from '@constants/media';
  import {
    GetCache,
    SetCache,
    FINISHED_STORIES_RANGE_KEY,
  } from '@constants/cache';
  import { resolveRenderableImage } from '@utils/file-validation';

  let account: Account = new Account();

  let finishedStories = $state<UserStoriesMetric[] | null>(null);
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

  const fetchFinishedStories = async (range: DurationEnum) => {
    SetCache(FINISHED_STORIES_RANGE_KEY, range);
    finishedStories = await account.getUserStories(range, true);
  };

  $effect(() => {
    if (selectedRange) fetchFinishedStories(selectedRange);
  });

  // Map each topic to a verified tile URL so list renders stay safe
  $effect(() => {
    const topics = finishedStories;
    if (!topics) {
      tileImages = {};
      return;
    }

    let cancelled = false;

    tileImages = Object.fromEntries(
      topics.map((topic) => [
        String(topic.topic_id),
        serveUrl(topic.tile_file_url),
      ]),
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
    const cachedRange = GetCache<DurationEnum>(FINISHED_STORIES_RANGE_KEY);
    if (cachedRange && timeRanges.includes(cachedRange))
      selectedRange = cachedRange;
    else selectedRange = timeRanges[0];
  });
</script>

<div class="collection-header console-collection-header blur">
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

<div class="tiles-collection console-collection">
  {#if !finishedStories}
    <h5 class="empty-title flex soft-white-txt">
      Your finished stories will be there
    </h5>
  {:else}
    {#each finishedStories as topic}
      <a
        class="tile gray-tile"
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

  .collection-header {
    @include gray(0.25);
  }

  .tiles-collection {
    animation: none;
    @include gray(0.1);
  }
</style>
