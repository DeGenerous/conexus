<script lang="ts">
  import Account from '@lib/auth';
  import { toastStore } from '@stores/toast';

  let code: string = '';
  let isValid: boolean = false;

  // Validate the referral code's length
  const validateCode = () => {
    isValid = code.length === 16; // Ensure it's exactly 16 characters
  };

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
</script>

<div class="referral-container">
  <div class="ref-code-form">
    <label class="signup-label" for="referral-code">
      Enter your referral code:
    </label>
    <input
      class="user-input"
      type="text"
      id="referral-code"
      placeholder="A11A7528D9C82915"
      minlength="16"
      maxlength="16"
      bind:value={code}
      on:input={validateCode}
      required
    />
    {#if isValid}
      <p class="validation">Invalid referral code</p>
    {/if}
    <p class="signup-label">
      Don't have one yet? Find yours
      <a
        href="https://discord.gg/349FgMSUK8"
        target="_blank"
        rel="noopener noreferrer">here</a
      >!
    </p>
    <button
      class="submit-button"
      on:click={useReferralCode}
      disabled={!isValid}
    >
      Use Referral Code
    </button>
  </div>
</div>

<style>
  .referral-container {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ref-code-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.5vw;
    background-color: rgba(1, 0, 32, 0.75);
    border: 0.05vw solid rgba(51, 226, 230, 0.75);
    border-radius: 2vw;
    padding: 2vw 3vw;
  }

  .signup-label {
    font-size: 1.5vw;
    line-height: 2vw;
    color: rgba(51, 226, 230, 0.75);
    text-align: center;
  }

  .user-input {
    text-align: center;
    width: 30vw;
    font-size: 2vw;
    line-height: 1vw;
    padding: 1vw 2vw;
    color: rgba(51, 226, 230, 0.75);
    border: 0.1vw solid rgba(51, 226, 230, 0.5);
    border-radius: 1.5vw;
    background-color: rgba(1, 0, 32, 0.75);
    outline: none;
  }

  .validation {
    font-size: 1.25vw;
    line-height: 1.5vw;
    color: rgba(255, 50, 50, 0.8);
  }

  .submit-button {
    padding: 1vw 2vw;
    border: 0.05vw solid rgba(51, 226, 230, 0.75);
    border-radius: 1.5vw;
    font-size: 1.5vw;
    line-height: 1.5vw;
    color: rgba(51, 226, 230, 0.75);
    background-color: rgba(51, 226, 230, 0.1);
    filter: drop-shadow(0 0 0.1vw rgba(51, 226, 230, 0.4));
    transition: transform 0.15s ease-in-out;
  }

  .submit-button:hover,
  .submit-button:active {
    color: rgba(51, 226, 230, 1);
    background-color: rgba(51, 226, 230, 0.5);
    filter: drop-shadow(0 0 1vw rgba(51, 226, 230, 0.4));
    transform: scale(1.05);
  }

  .submit-button:disabled,
  .submit-button:disabled:hover,
  .submit-button:disabled:active {
    opacity: 0.5;
    color: rgba(51, 226, 230, 0.75);
    background-color: rgba(51, 226, 230, 0.1);
    filter: drop-shadow(0 0 0.1vw rgba(51, 226, 230, 0.4));
    cursor: not-allowed;
  }

  @media only screen and (max-width: 600px) {
    .ref-code-form {
      width: 85vw;
      padding: 1em;
      border-radius: 1em;
      gap: 1em;
    }

    .signup-label {
      font-size: 1em;
      line-height: 1.5em;
    }

    .user-input {
      width: 70vw;
      font-size: 1.25em;
      line-height: 1.5em;
    }

    .validation {
      font-size: 1em;
      line-height: 1.5em;
    }

    .submit-button {
      font-size: 1.25em;
      line-height: 1.5em;
      padding: 0.25em 1em;
      border-radius: 0.5em;
    }
  }
</style>
