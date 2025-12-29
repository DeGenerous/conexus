<script lang="ts">
  import Account from '@lib/account';
  import Authentication from '@lib/authentication';
  import { toastStore } from '@stores/toast.svelte';
  import { NAV_ROUTES } from '@constants/routes';
  import { redirectTo, getCurrentUser } from '@utils/route-guard';
  import { ClearCache, REFERRAL_CODE_KEY } from '@constants/cache';

  import DiscordSVG from '@components/icons/Discord.svelte';

  let acct: Account = new Account();
  let auth: Authentication = new Authentication();

  let code = $state<string>('');
  let referralCodeValid = $state<boolean>(false);
  let codeValidated = $state<boolean>(false);
  let termsAccepted = $state<boolean>(false);
  const REFERRAL_CODE_DEBOUNCE_MS = 500;
  let referralValidationHandle: ReturnType<typeof setTimeout> | undefined;

  $effect(() => {
    if (code.length >= 3 && code.length <= 20) validateReferralCode();
    else if (code.length < 3 || code.length > 20) {
      referralCodeValid = false;
      codeValidated = false;
    }
  });

  const useReferralCode = async () => {
    try {
      await acct.useReferralCode(code);
      toastStore.show('Referral code submitted successfully!');
      setTimeout(async () => {
        ClearCache(REFERRAL_CODE_KEY);
        await getCurrentUser(true); // Refresh user data
        redirectTo('back'); // Redirect to previous page
      }, 100);
    } catch (error) {
      console.error('Error using referral code:', error);
      toastStore.show('Failed to use referral code. Please try again.');
    }
  };

  async function validateReferralCode() {
    if (referralValidationHandle) clearTimeout(referralValidationHandle);

    referralValidationHandle = setTimeout(async () => {
      referralValidationHandle = undefined;

      const currentCode = code;
      if (currentCode.length < 3 || currentCode.length > 20) return;

      try {
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
      }
    }, REFERRAL_CODE_DEBOUNCE_MS);
  }
</script>

<div class="container">
  <h4>Please provide a referral code to complete your registration</h4>
  <input
    class="user-input"
    class:red-border={!code || !referralCodeValid}
    type="text"
    placeholder="A11A7528D9C82915"
    minlength="3"
    maxlength="20"
    bind:value={code}
    required
  />

  {#if code.length >= 3 && code.length <= 20}
    {#if codeValidated}
      {#if referralCodeValid}
        <p class="validation green-txt">Referral code is valid</p>
      {:else}
        <p class="validation">Referral code is invalid</p>
      {/if}
    {/if}
  {:else if code}
    <p class="validation">Code should contain 3-20 characters</p>
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
        href={NAV_ROUTES.TERMS}
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
