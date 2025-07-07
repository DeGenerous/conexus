<script lang="ts">
  import Account from '@lib/account';
  import { ClearCache } from '@constants/cache';

  import LoadingSVG from '@components/icons/Loading.svelte';

  let { token }: { token: string } = $props();

  const acct: Account = new Account();

  let failed = $state<boolean>(false);

  $effect(() => {
    acct.confirmEmail(token).then((res) => {
      if (res === true) {
        setTimeout(() => {
          ClearCache('auth');
          window.location.href = '/';
        }, 1000);
      } else failed = true;
    });
  });
</script>

<section class="container">
  {#if failed}
    <h4 class="red-txt">Failed to verify email...</h4>
    <h5>Please check your mailbox again and follow the latest link.</h5>
  {:else}
    <span class="flex-row">
      <LoadingSVG />
      <h4 class="text-glowing">Verifying email...</h4>
    </span>
    <h5>Please wait while we verify your email address.</h5>
    <h5>If you are not redirected, please click the button below.</h5>
  {/if}
  <button onclick={() => (window.location.href = '/')}>Return home</button>
</section>
