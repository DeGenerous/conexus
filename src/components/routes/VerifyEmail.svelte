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
    <p>Please wait while we verify your email address.</p>
    <p>If you are not redirected, please click the button below.</p>
    <br />
    <button on:click={() => window.open('/', '_self')}>Return home</button>
  </div>
</section>
