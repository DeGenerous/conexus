<script lang="ts">
  import { authenticated } from '@stores/account';
  import { Account } from '@lib/account';

  export let token: string;

  const acct: Account = new Account();

  // Use Svelte's reactive store
  $: user = $authenticated.user;

  // Wait for `user` before making the request
  $: if (user?.email) {
    acct.confirmEmail(token);
  }
</script>

<section class="container-wrapper">
  <div class="container blur">
    {#if !user?.email}
      <h2 style="color: rgb(150, 150, 150)">Loading user data...</h2>
    {:else}
      <h2 style="color: rgb(150, 150, 150)">Error verifying email...</h2>
    {/if}
    <button on:click={() => window.open('/', '_self')}>Return home</button>
  </div>
</section>
