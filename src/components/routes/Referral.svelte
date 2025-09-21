<script lang="ts">
  import Account from '@lib/account';
  import Authentication from '@lib/authentication';
  import { toastStore } from '@stores/toast.svelte';
  import { ClearCache } from '@constants/cache';

  import DiscordSVG from '@components/icons/Discord.svelte';

  let acct: Account = new Account();
  let auth: Authentication = new Authentication();

  let code = $state<string>('');
  let referralCodeValid = $state<boolean>(false);
  let isValidatingCode = $state<boolean>(false);
  let codeValidated = $state<boolean>(false);
  let termsAccepted = $state<boolean>(false);

  $effect(() => {
    if (code.length === 16) validateReferralCode();
    else if (code.length < 16) {
      referralCodeValid = false;
      codeValidated = false;
      isValidatingCode = false;
    }
  });

  const useReferralCode = async () => {
    try {
      await acct.useReferralCode(code);
      toastStore.show('Referral code submitted successfully!');
      ClearCache('auth');
      window.location.href = '/'; // Redirect to the home page
    } catch (error) {
      console.error('Error using referral code:', error);
      toastStore.show('Failed to use referral code. Please try again.');
    }
  };

  async function validateReferralCode() {
    const currentCode = code;
    if (currentCode.length !== 16) return;

    try {
      isValidatingCode = true;
      referralCodeValid = false;
      codeValidated = false;

      const validated = await auth.validateReferralCode(currentCode);

      if (code !== currentCode) return;

      referralCodeValid = validated;
      codeValidated = true;
    } catch (error) {
      console.error('Failed to validate referral code:', error);
      if (code !== currentCode) return;

      referralCodeValid = false;
      codeValidated = true;
    } finally {
      if (code === currentCode) {
        isValidatingCode = false;
      }
    }
  }
</script>

<div class="container">
  <h4>Please provide a referral code to complete your registration</h4>
  <input
    class="user-input"
    class:red-border={!code || !referralCodeValid}
    type="text"
    placeholder="A11A7528D9C82915"
    minlength="16"
    maxlength="16"
    bind:value={code}
    required
  />

  {#if code.length === 16}
    {#if isValidatingCode}
      <p class="validation gray">Checking referral code...</p>
    {:else if codeValidated}
      {#if referralCodeValid}
        <p class="validation green">Referral code is valid</p>
      {:else}
        <p class="validation">Referral code is invalid</p>
      {/if}
    {/if}
  {:else if code}
    <p class="validation">Code should contain 16 characters</p>
  {/if}

  <div class="flex-row gap-8">
    <input
      type="checkbox"
      id="terms"
      onchange={(event: any) => {
        termsAccepted = event.target?.checked;
      }}
    />
    <label
      for="terms"
      style={termsAccepted ? '' : 'color: rgba(255, 50, 50, 0.75);'}
    >
      * I have read and agree to the <a
        href="https://dgrslabs.ink/terms-of-service"
        target="_blank"
        style={termsAccepted ? '' : 'color: rgba(255, 50, 50, 0.9);'}
      >
        Terms of Service</a
      >.
    </label>
  </div>

  <button
    onclick={useReferralCode}
    disabled={!referralCodeValid || !termsAccepted}
  >
    Use Referral Code
  </button>

  <hr />

  <h5>Don't have one yet?</h5>
  <DiscordSVG text="Find Yours on Discord" />
</div>
