<script lang="ts">
  import { Account } from '@lib/account';
  import { toastStore } from '@stores/toast.svelte';
  import { ClearCache } from '@constants/cache';

  import DiscordSVG from '@components/icons/Discord.svelte';

  let acct: Account = new Account();

  let code = $state<string>('');
  let referralCodeValid = $state<boolean>(false);
  let termsAccepted = $state<boolean>(false);

  $effect(() => {
    if (code.length === 16) validateReferralCode();
    else if (code.length < 16) referralCodeValid = false;
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
    const referralObject: ReferralCode | null =
      await acct.validateReferralCode(code);
    if (referralObject) {
      referralCodeValid = true;
    } else {
      referralCodeValid = false;
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
    {#await acct.validateReferralCode(code)}
      <p class="validation gray">Checking referral code...</p>
    {:then referralObject}
      {#if referralObject}
        <p class="validation green">Referral code is valid</p>
      {:else}
        <p class="validation">Referral code is invalid</p>
      {/if}
    {:catch}
      <p class="validation">Some error occured...</p>
    {/await}
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
        href="https://docs.google.com/document/d/1fEemq6HVM_h8ZTbc_Fl_k3RvlPdjYd70TI1iloT5gXA/edit?usp=sharing"
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
