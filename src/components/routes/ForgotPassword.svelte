<script lang="ts">
  import Account from '@lib/account';
  import { regexpEmail } from '@constants/regexp';

  const acct: Account = new Account();

  let email = $state<string>('');

  const emailValidation = $derived<boolean>(regexpEmail.test(email));
</script>

<section class="container">
  <h4>You will receive a confirmation email with a link</h4>
  <input
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
    onclick={() => acct.forgotPassword(email)}
    disabled={!email || !emailValidation}
  >
    Send Verification Link
  </button>
</section>
