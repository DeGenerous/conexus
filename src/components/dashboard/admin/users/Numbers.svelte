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
    main: false,
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

  const getAccountsGrowth = async () => {
    fetchingUserGrowth = true;
    const growth = await admin.fetchAccountGrowth(
      includeMetrics ? accountMetrics : {},
    );
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
      <div class="accounts-role input-container">
        <label for="accounts-role" class:disabled={!includeMetrics}>
          User Role
        </label>
        <select id="accounts-role" bind:value={accountMetrics.role_id} disabled={!includeMetrics}>
          <option value="" disabled selected>Coming Soon</option>
        </select>
      </div>
      <span class="accounts-data flex">
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

  input,
  select {
    &:disabled {
      color: transparent !important;
    }
  }

  label.disabled {
    opacity: 0.25;
    cursor: not-allowed;
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
