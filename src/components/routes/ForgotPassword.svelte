<script lang="ts">
  import { Account } from '@lib/account';

  const acct: Account = new Account();

  let email: string = '';

  $: emailValidation = email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );
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
      Send verification link
    </button>
  </div>
</div>
