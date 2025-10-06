<script lang="ts">
  import { onMount } from 'svelte';

  import AdminApp from '@lib/admin';

  import LoadingSVG from '@components/icons/Loading.svelte';

  const admin = new AdminApp();

  let users = $state<Partial<User>[]>([]);
  let count = $state<number>(0);

  onMount(() => {
    admin.listAccounts(1, 1000).then((res) => {
      if (res) {
        users = res.users;
        count = res.count;
      }
    });
  });
</script>

<h2>Accounts & Roles</h2>

<span class="flex-row">
  {#if !count}
    <LoadingSVG />
  {/if}
  <h5>
    {#if count}
      Total users: {count}
    {:else}
      Fetching users...
    {/if}
  </h5>
</span>

<p>
  listAccounts disableUserAccount changeUserRole fetchAccountCount
  fetchWalletCount fetchAccountGrowth fetchWalletGrowth fetchTopAccounts
</p>
