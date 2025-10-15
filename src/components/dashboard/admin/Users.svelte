<script lang="ts">
  import Accounts from '@components/dashboard/admin/users/Accounts.svelte';
</script>

<h2>Accounts & Roles</h2>

<Accounts />

<!-- <span class="flex-row">
  {#if !userCount}
    <button onclick={getAccountsCount} disabled={fetchingUserCount}>
      {#if fetchingUserCount}
        <LoadingSVG />
        Loading...
      {:else}
        Get Accounts Count
      {/if}
    </button>
  {:else}
    <h5>Total users: {userCount}</h5>
  {/if}
</span> -->

<p>
  TODO: listAccounts disableUserAccount changeUserRole
  fetchAccountGrowth fetchWalletGrowth fetchTopAccounts
</p>
