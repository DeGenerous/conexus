<script lang="ts">
  import Account from '@lib/account';
  import { NAV_ROUTES } from '@constants/routes';
  import { blankImage, serveUrl } from '@constants/media';

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
  let selectedRange = $state<DurationEnum>(timeRanges[0]);

  const fetchUnfinishedStories = async (range: DurationEnum) => {
    unfinishedStories = await account.getUserStories(range);
  };

  $effect(() => {
    fetchUnfinishedStories(selectedRange);
  });
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

<div class="tiles-collection">
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

  .tiles-collection {
    width: 100vw;
    margin-inline: -1.5rem;

    @include respond-up(small-desktop) {
      width: calc(100% + 3rem);
      margin-inline: 0;
    }

    .empty-title {
      width: 100%;
      height: 100%;
    }
  }

  footer {
    width: 100%;
    margin-top: auto;
    @include white-txt;
  }
</style>
