<script lang="ts">
  import AdminApp from '@lib/admin';

  import LoadingSVG from '@components/icons/Loading.svelte';

  const admin: AdminApp = new AdminApp();

  let userCount = $state<number>(0);
  let fetchingUserCount = $state<boolean>(false);

  let walletCount = $state<number>(0);
  let fetchingWalletCount = $state<boolean>(false);

  const dateRange = $state<{ start_date: string; end_date: string }>({
    start_date: '',
    end_date: '',
  });
  let includeMetrics = $state<boolean>(false);

  const accountMetrics = $state<AccountMetricFilter>({
    start_date: dateRange.start_date,
    end_date: dateRange.end_date,
    referred: true,
    email_confirmed: true,
  });

  const walletMetrics = $state<WalletMetricFilter>({
    start_date: dateRange.start_date,
    end_date: dateRange.end_date,
    is_faux: false,
    main: true,
  });

  const getAccountsCount = async () => {
    fetchingUserCount = true;
    const cnt = await admin.fetchAccountCount(
      includeMetrics ? accountMetrics : {},
    );
    if (cnt !== null) userCount = cnt;
    fetchingUserCount = false;
  };

  const getWalletsCount = async () => {
    fetchingWalletCount = true;
    const cnt = await admin.fetchWalletCount(walletMetrics);
    if (cnt !== null) walletCount = cnt;
    fetchingWalletCount = false;
  };
</script>

<section class="dream-container">
  <div class="flex-row">
    <h4>Metrics</h4>
    <div class="container">
      <button
        class="void-btn dream-radio-btn"
        class:active={includeMetrics}
        onclick={() => (includeMetrics = true)}
      >
        ENABLED
      </button>
      <button
        class="void-btn dream-radio-btn"
        class:active={!includeMetrics}
        onclick={() => (includeMetrics = false)}
      >
        DISABLED
      </button>
    </div>
  </div>
  <div class="flex-row">
    <h4>Date Range</h4>
    <div class="container">
      <div class="input-container">
        <label for="accounts-start-date" class:disabled={!includeMetrics}>
          From
        </label>
        <input
          id="accounts-start-date"
          type="date"
          bind:value={dateRange.start_date}
          min="2024-01-01"
          max={new Date().toISOString().split('T')[0]}
          disabled={!includeMetrics}
        />
      </div>
      <div class="input-container">
        <label for="accounts-end-date" class:disabled={!includeMetrics}>
          To
        </label>
        <input
          id="accounts-end-date"
          type="date"
          bind:value={dateRange.end_date}
          min="2024-01-01"
          max={new Date().toISOString().split('T')[0]}
          disabled={!includeMetrics}
        />
      </div>
    </div>
  </div>
  <div class="flex-row">
    <h4>Accounts</h4>
    <div class="container">
      <span class="flex-row gap-8">
        <label for="accounts-referred" class:disabled={!includeMetrics}>
          Referred:
        </label>
        <input
          id="accounts-referred"
          type="checkbox"
          bind:checked={accountMetrics.referred}
          disabled={!includeMetrics}
        />
      </span>
      <span class="flex-row gap-8">
        <label for="accounts-confirmed-email" class:disabled={!includeMetrics}>
          Confirmed Email:
        </label>
        <input
          id="accounts-confirmed-email"
          type="checkbox"
          bind:checked={accountMetrics.email_confirmed}
          disabled={!includeMetrics}
        />
      </span>
    </div>
  </div>
  <div class="flex-row">
    <h4>Wallets</h4>
    <div class="container">
      <button
        class="void-btn dream-radio-btn"
        class:active={!walletMetrics.main}
        onclick={() => (walletMetrics.main = false)}
      >
        ALL
      </button>
      <button
        class="void-btn dream-radio-btn"
        class:active={walletMetrics.main}
        onclick={() => (walletMetrics.main = true)}
      >
        ONLY MAIN
      </button>
    </div>
  </div>
  <div class="flex-row">
    <h4>Total Users</h4>
    <div class="container">
      <h5 class="text-glowing">
        {#if userCount}
          {userCount} accounts
        {:else}
          Click to fetch count
        {/if}
      </h5>
    </div>
  </div>
  <div class="flex-row">
    <h4>Total Wallets</h4>
    <div class="container">
      <h5 class="text-glowing">
        {#if walletCount}
          {walletCount} wallets
        {:else}
          Click to fetch count
        {/if}
      </h5>
    </div>
  </div>

  <span class="flex-row flex-wrap">
    <button onclick={getAccountsCount} disabled={fetchingUserCount}>
      {#if fetchingUserCount}
        <LoadingSVG />
        Loading...
      {:else}
        Fetch Accounts
      {/if}
    </button>
    <button onclick={getWalletsCount} disabled={fetchingWalletCount}>
      {#if fetchingWalletCount}
        <LoadingSVG />
        Loading...
      {:else}
        Fetch Wallets
      {/if}
    </button>
  </span>
</section>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  input {
    &[type='date'] {
      &::-webkit-calendar-picker-indicator {
        filter: brightness(0) saturate(100%) invert(1);
      }
    }

    &:disabled {
      color: transparent !important;
    }
  }

  label.disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }
</style>
