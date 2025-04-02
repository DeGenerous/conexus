<script lang="ts">
  import { onMount } from 'svelte';

  import { Account } from '@lib/account';

  export let token: string;

  const acct: Account = new Account();

  onMount(() => {
    acct.confirmEmail(token).then((res) => {
      if (res === true) {
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
