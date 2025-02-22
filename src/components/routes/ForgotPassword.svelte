<script lang="ts">
  import { Account } from '@lib/account';

  const acct: Account = new Account();

  let email: string = '';
</script>

<div class="container-wrapper">
  <div class="container blur">
    <h3>You will receive a confirmation email with link</h3>
    <input
      class="user-input"
      class:red-border={!email}
      type="email"
      bind:value={email}
      placeholder="Email"
      required
    />

    {#if !email}
      <p class="validation">Provide the email associated with your profile</p>
    {/if}

    <button on:click={() => acct.forgotPassword(email)} disabled={!email}>
      Send verification link
    </button>
  </div>
</div>
