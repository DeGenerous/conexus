<script lang="ts">
  import AdminApp from '@lib/admin';
  import openModal from '@stores/modal.svelte';
  import { disableAccountWarning } from '@constants/modal';

  let { roles }: { roles: TenantRole[] } = $props();

  type AccountRow = Partial<User> & { localDisabled?: boolean };

  const admin = new AdminApp();
  const PAGE_SIZE = 50;

  let accounts = $state<AccountRow[]>([]);
  let totalCount = $state<number>(0);

  let page = $state<number>(0);
  let fetching = $state<boolean>(false);
  let allLoaded = $state<boolean>(false);
  let hasLoaded = $state<boolean>(false);

  let roleBusy = $state<Record<string, boolean>>({});
  let disableBusy = $state<Record<string, boolean>>({});

  let sentinel: HTMLDivElement | null = null;
  let observer: IntersectionObserver | null = null;

  const fetchNextPage = async () => {
    if (fetching || allLoaded) return;

    fetching = true;
    const nextPage = page + 1;
    try {
      const response = await admin.listAccounts(nextPage, PAGE_SIZE);

      if (response) {
        const { users, count } = response;
        const batch = Array.isArray(users)
          ? (users as AccountRow[]).map((user) => ({ ...user }))
          : ([] as AccountRow[]);

        if (typeof count === 'number') {
          totalCount += count;
        }

        if (!batch.length) {
          allLoaded = true;
          return;
        }

        page = nextPage;
        accounts = nextPage === 1 ? batch : [...accounts, ...batch];

        if (batch.length < PAGE_SIZE) {
          allLoaded = true;
        }
      } else {
        allLoaded = true;
      }
    } finally {
      hasLoaded = true;
      fetching = false;
    }
  };

  const fetchAllUsers = async () => {
    if (fetching) return;

    // reset pagination state
    accounts = [];
    totalCount = 0;
    page = 0;
    allLoaded = false;
    hasLoaded = false;

    await fetchNextPage();
  };

  const observeSentinel = () => {
    if (!sentinel || !hasLoaded || allLoaded) return;

    if (observer) observer.disconnect();

    observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry?.isIntersecting && !fetching && !allLoaded) {
        fetchNextPage();
      }
    });

    observer.observe(sentinel);
  };

  $effect(() => {
    if (!sentinel) return;

    if (hasLoaded && !allLoaded) {
      observeSentinel();
    } else if (observer) {
      observer.disconnect();
    }
  });

  const markAccountDisabled = (account_id: string) => {
    accounts = accounts.map((account) =>
      account.id === account_id ? { ...account, localDisabled: true } : account,
    );
  };

  const disableAccount = async (account_id: string | undefined) => {
    if (!account_id || disableBusy[account_id]) return;

    disableBusy = { ...disableBusy, [account_id]: true };
    try {
      await admin.disableUserAccount(account_id);
      markAccountDisabled(account_id);
    } finally {
      disableBusy = { ...disableBusy, [account_id]: false };
    }
  };

  const changeRole = async (
    account_id: string | undefined,
    new_role_id: string,
  ) => {
    if (!account_id || roleBusy[account_id]) return;

    roleBusy = { ...roleBusy, [account_id]: true };
    try {
      await admin.changeUserRole(account_id, new_role_id);
      accounts = accounts.map((account) =>
        account.id === account_id
          ? {
              ...account,
              role_id: new_role_id,
              role_name:
                roles.find((role) => role.id === new_role_id)?.name ||
                account.role_name,
            }
          : account,
      );
    } finally {
      roleBusy = { ...roleBusy, [account_id]: false };
    }
  };
</script>

<section class="flex">
  {#if !totalCount}
    <button onclick={fetchAllUsers} disabled={fetching}>
      {#if fetching && !hasLoaded}
        Fetching Users...
      {:else}
        Fetch All Users
      {/if}
    </button>
  {:else}
    <h4 class="fade-in">Accounts Loaded: {totalCount}</h4>
  {/if}

  {#if accounts.length === 0 && hasLoaded && !fetching}
    <p class="validation">No accounts found</p>
  {:else if accounts.length}
    {#each accounts as account (account.id || account.email || account.username)}
      <div
        class="account-row flex-row transition"
        class:disabled={account.localDisabled}
      >
        <span class="user-data flex-row">
          <h5>{account.email}</h5>
          <h5>{account.username || 'no_username'}</h5>
        </span>
        <span class="controls flex-row">
          <select
            disabled={!account.id ||
              roleBusy[account.id || ''] ||
              account.localDisabled}
            onchange={(event) => {
              const select = event.target as HTMLSelectElement;
              const newRoleId = select.value;
              if (!newRoleId || newRoleId === account.role_id) {
                select.value = account.role_id || '';
                return;
              }
              changeRole(account.id, newRoleId);
            }}
          >
            <option value="" disabled hidden selected={!account.role_id}>
              Select role
            </option>
            {#each roles as role}
              <option value={role.id} selected={account.role_id === role.id}>
                {role.name}
              </option>
            {/each}
          </select>
          <button
            class="red-btn"
            disabled={!account.id ||
              account.localDisabled ||
              disableBusy[account.id || '']}
            onclick={() =>
              openModal(disableAccountWarning, 'Disable', () =>
                disableAccount(account.id),
              )}
          >
            {#if disableBusy[account.id || '']}
              Disabling...
            {:else if account.localDisabled}
              Account Disabled
            {:else}
              Disable Account
            {/if}
          </button>
        </span>
      </div>
    {/each}
  {/if}

  <div class="sentinel" bind:this={sentinel} aria-hidden="true"></div>

  {#if fetching && hasLoaded}
    <p class="validation transparent-white-txt">Loading more users...</p>
  {/if}
</section>

<style lang="scss">
  @use '/src/styles/mixins/' as *;

  section {
    width: 100%;
    gap: 0;

    h4 {
      margin-bottom: 1.5rem;
    }

    .account-row {
      width: 100%;
      padding: 1rem 1.5rem;
      @include navy;
      @include dark-border;

      &:hover {
        @include bright;
      }

      &.disabled {
        opacity: 0.75;
        @include gray(0.5);
      }

      &:first-of-type {
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
      }

      .user-data {
        width: 100%;
        justify-content: space-between;
      }

      .controls {
        flex: none;
      }

      @include mobile-only {
        flex-wrap: wrap;
        row-gap: 0.5rem;

        .user-data {
          justify-content: center;
        }
      }
    }

    .sentinel {
      width: 100%;
      height: 1px;
    }
  }
</style>
