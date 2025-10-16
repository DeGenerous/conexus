<script lang="ts">
  import AdminApp from '@lib/admin';

  import TopUsers from '@components/dashboard/admin/users/TopUsers.svelte';
  import LoadingSVG from '@components/icons/Loading.svelte';

  const admin: AdminApp = new AdminApp();

  let userCount = $state<number>(0);
  let fetchingUserCount = $state<boolean>(false);

  let walletCount = $state<number>(0);
  let fetchingWalletCount = $state<boolean>(false);

  let userGrowth = $state<number>(0);
  let fetchingUserGrowth = $state<boolean>(false);

  let walletGrowth = $state<number>(0);
  let fetchingWalletGrowth = $state<boolean>(false);

  const getEndDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const dateRange = $state<{ start_date: string; end_date: string }>({
    start_date: '2023-01-01',
    end_date: getEndDate(),
  });

  const accountMetrics = $state<AccountMetricFilter>({
    start_date: undefined,
    end_date: undefined,
    role_id: undefined,
    referred: true,
    email_confirmed: true,
  });
  let includeAccountMetrics = $state<boolean>(false);

  const walletMetrics = $state<WalletMetricFilter>({
    start_date: undefined,
    end_date: undefined,
    is_faux: false,
    main: false,
  });

  $effect(() => {
    accountMetrics.start_date = dateRange.start_date;
    accountMetrics.end_date = dateRange.end_date;
  });

  $effect(() => {
    walletMetrics.start_date = dateRange.start_date;
    walletMetrics.end_date = dateRange.end_date;
  });

  const getAccountsCount = async () => {
    fetchingUserCount = true;
    const cnt = await admin.fetchAccountCount(
      includeAccountMetrics ? accountMetrics : {},
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

  const getAccountsGrowth = async () => {
    fetchingUserGrowth = true;
    const growth = await admin.fetchAccountGrowth(accountMetrics);
    if (growth !== null) userGrowth = growth;
    fetchingUserGrowth = false;
  };

  const getWalletsGrowth = async () => {
    fetchingWalletGrowth = true;
    const growth = await admin.fetchWalletGrowth(walletMetrics);
    if (growth !== null) walletGrowth = growth;
    fetchingWalletGrowth = false;
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
    <h4>Accounts</h4>
    <div class="container">
      <div class="accounts-role input-container">
        <label for="accounts-role"> User Role </label>
        <select id="accounts-role" value="">
          <option value="" disabled selected>Coming Soon</option>
        </select>
      </div>
      <span class="accounts-data flex">
        <span class="flex-row gap-8">
          <label for="accounts-referred"> Referred: </label>
          <input
            id="accounts-referred"
            type="checkbox"
            bind:checked={accountMetrics.referred}
          />
        </span>
        <span class="flex-row gap-8">
          <label for="accounts-confirmed-email"> Confirmed Email: </label>
          <input
            id="accounts-confirmed-email"
            type="checkbox"
            bind:checked={accountMetrics.email_confirmed}
          />
        </span>
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

  <hr />

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
      <span class="flex-row gap-8">
        <input
          type="checkbox"
          bind:checked={includeAccountMetrics}
          id="accounts-include-metrics"
        />
        <label for="accounts-include-metrics">Metrics</label>
      </span>
      <button onclick={getAccountsCount} disabled={fetchingUserCount}>
        {#if fetchingUserCount}
          <LoadingSVG />
          Loading...
        {:else}
          Fetch Data
        {/if}
      </button>
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
      <button onclick={getWalletsCount} disabled={fetchingWalletGrowth}>
        {#if fetchingWalletGrowth}
          <LoadingSVG />
          Loading...
        {:else}
          Fetch Data
        {/if}
      </button>
    </div>
  </div>

  <div class="flex-row">
    <h4>Accounts Growth</h4>
    <div class="container">
      <h5 class="text-glowing">
        {#if userGrowth}
          {userGrowth >= 0 ? '+' : '-'}{userGrowth} accounts
        {:else}
          Click to fetch count
        {/if}
      </h5>
      <button onclick={getAccountsGrowth} disabled={fetchingUserGrowth}>
        {#if fetchingUserGrowth}
          <LoadingSVG />
          Loading...
        {:else}
          Fetch Data
        {/if}
      </button>
    </div>
  </div>
  <div class="flex-row">
    <h4>Wallets Growth</h4>
    <div class="container">
      <h5 class="text-glowing">
        {#if walletGrowth}
          {walletGrowth >= 0 ? '+' : '-'}{walletGrowth} wallets
        {:else}
          Click to fetch count
        {/if}
      </h5>
      <button onclick={getWalletsGrowth} disabled={fetchingWalletGrowth}>
        {#if fetchingWalletGrowth}
          <LoadingSVG />
          Loading...
        {:else}
          Fetch Data
        {/if}
      </button>
    </div>
  </div>

  <hr />

  <TopUsers {dateRange} />
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

  .accounts-role {
    width: auto;
  }

  .accounts-data {
    align-items: flex-end;
  }
</style>
