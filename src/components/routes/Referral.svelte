<script lang="ts">
  import { Account } from '@lib/account';
  import { toastStore } from '@stores/toast';
  import { USER_CACHE_KEY, ClearCache } from '@constants/cache';

  let code: string = '';

  let acct: Account = new Account();

  const useReferralCode = async () => {
    try {
      await acct.useReferralCode(code);
      toastStore.show('Referral code submitted successfully!');
      ClearCache(USER_CACHE_KEY);
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
      await acct.validateReferralCode(code);
    if (referralObject) {
      referralCodeValid = true;
    } else {
      referralCodeValid = false;
    }
  }

  let termsAccepted: boolean = false;
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

    <h3>
      Don't have one yet? Find yours
      <a
        href="https://discord.gg/349FgMSUK8"
        target="_blank"
        rel="noopener noreferrer">here</a
      >!
    </h3>

    <div class="agreement">
      <input
        type="checkbox"
        id="terms"
        on:change={(event: any) => {
          termsAccepted = event.target?.checked;
        }}
      />
      <label
        for="terms"
        class="terms"
        style={termsAccepted ? '' : 'color: rgba(255, 50, 50, 0.75);'}
      >
        * I have read and agree to the <a
          href="https://docs.google.com/document/d/1fEemq6HVM_h8ZTbc_Fl_k3RvlPdjYd70TI1iloT5gXA/edit?usp=sharing"
          target="_blank"
          style={termsAccepted
            ? ''
            : 'color: rgba(255, 50, 50, 0.9);'}
        >
          Terms of Service</a
        >.
      </label>
    </div>

    <button on:click={useReferralCode} disabled={!referralCodeValid || !termsAccepted}>
      Use Referral Code
    </button>
  </div>
</div>

<style>
  .agreement {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    padding: 1vw;
    gap: 1vw;
  }

  .agreement label {
    cursor: pointer;
  }

  #terms {
    width: 1.5vw;
    height: 1.5vw;
    flex: 1;
    accent-color: rgba(51, 226, 230, 0.75);
    cursor: pointer;
  }

  .terms > a {
    color: rgba(255, 255, 255, 0.65);
  }

  @media only screen and (max-width: 600px) {
    .agreement {
      gap: 1em;
    }

    #terms {
      width: 1em;
      height: 1em;
    }
  }
</style>
