<script lang="ts">
  import Account from '@lib/auth';
  import { toastStore } from '@stores/toast';

  let code: string = '';

  const useReferralCode = async () => {
    try {
      await Account.userReferralCode(code);
      toastStore.show('Referral code submitted successfully!');
      window.location.href = '/'; // Redirect to the home page
    } catch (error) {
      console.error('Error using referral code:', error);
      toastStore.show('Failed to use referral code. Please try again.');
    }
  };

  $: if (code.length === 16) validateReferralCode();
  $: if (code.length < 16) referralCodeValid = false;
  let referralCodeValid = false;
  async function validateReferralCode() {
    const referralObject: ReferralCode | null =
      await Account.validateReferralCode(code);
    if (referralObject) {
      referralCodeValid = true;
    } else {
      referralCodeValid = false;
    }
  }
</script>

<div class="container-wrapper">
  <div class="container blur">
    <h3>Please provide a referral code to complete your registration</h3>
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
      {#await Account.validateReferralCode(code)}
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

    <h3>
      Don't have one yet? Find yours
      <a
        href="https://discord.gg/349FgMSUK8"
        target="_blank"
        rel="noopener noreferrer">here</a
      >!
    </h3>
    <button on:click={useReferralCode} disabled={!referralCodeValid}>
      Use Referral Code
    </button>
  </div>
</div>
