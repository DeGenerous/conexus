<script lang="ts">
  import { Account } from '@lib/account';
  import { regexpEmail } from '@constants/regexp';

  const acct: Account = new Account();

  let email: string = '';

  $: emailValidation = regexpEmail.test(email);
</script>

<div class="container-wrapper">
  <div class="container blur">
    <h3>You will receive a confirmation email with link</h3>
    <input
      class="user-input"
      class:red-border={!emailValidation}
      type="email"
      bind:value={email}
      placeholder="Email"
      required
    />

    {#if !emailValidation}
      <p class="validation">Provide the email associated with your profile</p>
    {/if}

    <button
      on:click={() => acct.forgotPassword(email)}
      disabled={!email || !emailValidation}
    >
      Send Verification Link
    </button>
  </div>
</div>

<style>
  @media only screen and (max-width: 600px) {
    .container-wrapper {
      margin-top: 2em;
    }
  }
</style>
