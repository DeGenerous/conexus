<script lang="ts">
  import { onMount } from 'svelte';

  import { Account } from '@lib/account';
  import { USER_CACHE_KEY, ClearCache } from '@constants/cache';

  export let token: string;

  const acct: Account = new Account();

  onMount(() => {
    acct.confirmEmail(token).then((res) => {
      if (res === true) {
        ClearCache(USER_CACHE_KEY);
        window.location.href = '/';
      }
    });
  });
</script>

<section class="container-wrapper">
  <div class="container blur">
    <h1>Verifying email...</h1>
    <h3>Please wait while we verify your email address.</h3>
    <h3>If you are not redirected, please click the button below.</h3>
    <button on:click={() => window.open('/', '_self')}>Return home</button>
  </div>
</section>

<style>
  @media only screen and (max-width: 600px) {
    .container-wrapper {
      margin-top: 2em;
    }
  }
</style>
