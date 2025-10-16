<script lang="ts">
  import AdminApp from '@lib/admin';

  import LoadingSVG from '@components/icons/Loading.svelte';

  let { dateRange }: { dateRange: { start_date: string; end_date: string } } =
    $props();

  const admin: AdminApp = new AdminApp();

  let topUsers = $state<TopNMetricResult>([]);
  let fetching = $state<boolean>(false);

  const topUsersMetrics = $state<TopNMetricFilter>({
    start_date: undefined,
    end_date: undefined,
    n: 10,
  });

  $effect(() => {
    topUsersMetrics.start_date = dateRange.start_date;
    topUsersMetrics.end_date = dateRange.end_date;
  });

  const getTopUsers = async () => {
    fetching = true;
    topUsers = await admin.fetchTopAccounts(topUsersMetrics);
    fetching = false;
  };
</script>

<div class="flex-row">
  <h4>Top Users</h4>
  <div class="container">
    <div class="input-container">
      <label for="accounts-top-count">Count</label>
      <input
        id="accounts-top-count"
        type="number"
        bind:value={topUsersMetrics.n}
        min="1"
      />
    </div>
    <button onclick={getTopUsers}>
      {#if fetching}
        <LoadingSVG />
      {:else}
        Fetch Data
      {/if}
    </button>
  </div>
</div>

{#if topUsers.length}
  <ul class="container round-8 fade-in">
    {#each topUsers as { id, name, activity_count }, index}
      <li
        class="flex-row flex-wrap gap-8"
        style:--rank-progress={topUsers.length > 1
          ? index / (topUsers.length - 1)
          : 0}
      >
        <h5>
          {index + 1}. {name} ({id.split('-')[0]})
          {#if index === 0}
            🥇
          {:else if index === 1}
            🥈
          {:else if index === 2}
            🥉
          {/if}
        </h5>
        <h5>Stories Played: {activity_count}</h5>
      </li>
    {/each}
  </ul>
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  ul {
    width: 100%;
    animation: none;
    background-color: $transparent-black;
    padding: 0;
    gap: 0;

    li {
      width: 100%;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      --rank-progress: var(
        --rank-progress,
        0
      ); // normalized 0 (best) → 1 (last)
      --rank-strength: calc(1 - var(--rank-progress));
      // Default to light-blue RGB, allow overriding via --rank-color-rgb
      --rank-color-rgb: 51 226 230;
      --rank-opacity-max: 0.25;
      --rank-opacity-min: 0;
      --rank-opacity-range: calc(
        var(--rank-opacity-max) - var(--rank-opacity-min)
      );
      --rank-opacity: calc(
        var(--rank-opacity-min) + var(--rank-strength) *
          var(--rank-opacity-range)
      );
      background: none;
      background-color: rgb(var(--rank-color-rgb) / var(--rank-opacity));

      h5 {
        @include white-txt(soft);
        @include mobile-only {
          width: 100%;
        }
      }

      &:nth-of-type(1),
      &:nth-of-type(2),
      &:nth-of-type(3) {
        background-image: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.1) 50%,
          rgba(255, 255, 255, 0) 100%
        );

        h5 {
          color: black;
          font-weight: bold;
        }
      }

      &:nth-of-type(1) {
        background-color: rgba(255, 215, 0, 0.2);
        border-radius: 0.5rem 0.5rem 0 0;
        border: 1px solid rgba(255, 215, 0, 1);

        h5 {
          color: yellow;
        }
      }

      &:nth-of-type(2) {
        background-color: rgba(192, 192, 192, 0.2);
        border: 1px solid rgba(192, 192, 192, 0.75);

        h5 {
          color: white;
        }
      }

      &:nth-of-type(3) {
        background-color: rgba(205, 127, 50, 0.2);
        border: 1px solid rgba(205, 127, 50, 0.5);

        h5 {
          color: orange;
        }
      }

      &:last-of-type {
        border-radius: 0 0 0.5rem 0.5rem;
      }
    }
  }
</style>
