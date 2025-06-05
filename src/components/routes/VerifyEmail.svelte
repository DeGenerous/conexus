<script lang="ts">
  import { onMount } from 'svelte';

  import { Account } from '@lib/account';
  import { ClearCache } from '@constants/cache';

  import LoadingSVG from '@components/icons/Loading.svelte';

  export let token: string;

  const acct: Account = new Account();

  onMount(() => {
    acct.confirmEmail(token).then((res) => {
      if (res === true) {
        ClearCache('auth');
        window.location.href = '/';
      }
    });
  });
</script>

<section class="container">
  <span class="flex-row">
    <LoadingSVG />
    <h4 class="text-glowing">Verifying email...</h4>
  </span>
  <h5>Please wait while we verify your email address.</h5>
  <h5>If you are not redirected, please click the button below.</h5>
  <button on:click={() => window.open('/', '_self')}>Return home</button>
</section>
