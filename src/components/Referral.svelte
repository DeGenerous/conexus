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
    <p class="signup-label">
      Don't have one yet? Find yours
      <a
        href="https://discord.gg/349FgMSUK8"
        target="_blank"
        rel="noopener noreferrer">here</a
      >!
    </p>
    <button class="submit-button" on:click={useReferralCode}>
      Use Referral Code
    </button>
  </div>
</div>

<style>
  .referral-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding: 1rem;
  }

  .ref-code-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 400px;
    background-color: #ffffff;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .signup-label {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: #333;
    text-align: center;
  }

  .user-input {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    outline: none;
    transition: border-color 0.3s;
  }

  .user-input:focus {
    border-color: #3498db;
  }

  .submit-button {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    font-weight: bold;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition:
      background-color 0.3s,
      transform 0.2s;
  }

  .submit-button:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
  }

  .submit-button:active {
    transform: translateY(0);
  }

  a {
    color: #3498db;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
</style>
