<script lang="ts">
  import { Account } from '@lib/account';
  import EyeSVG from '@components/icons/Eye.svelte';
  import passwordVisible from '@stores/password-visibility';
  import {
    regexpEmail,
    regexpPasswordValidation,
    regexpLengthCheck,
    regexpCapitalLetterCheck,
    regexpLowercaseLetterCheck,
    regexpNumberCheck,
    regexpSpecialCharCheck,
    regexpRestrictedCharsCheck,
  } from '@constants/regexp';

  export let token: string;

  let acct: Account = new Account();

  let email: string = '';
  let password: string = '';
  let confirmPassword: string = '';

  $: validation =
    email &&
    regexpPasswordValidation.test(password) &&
    password === confirmPassword &&
    emailValidation;

  $: emailValidation = regexpEmail.test(email);
</script>

<div class="container-wrapper">
  <div class="container blur">
    <h3>Confirm your email address and create a new password</h3>
    <input
      class="user-input"
      class:red-border={!email || !emailValidation}
      type="email"
      bind:value={email}
      placeholder="Email"
      required
    />

    {#if !email || !emailValidation}
      <p class="validation">Provide the email associated with your profile</p>
    {/if}

    <div class="password-input-container">
      <input
        class="user-input"
        class:red-border={!regexpPasswordValidation.test(password)}
        type={$passwordVisible.reset ? 'text' : 'password'}
        bind:value={password}
        placeholder="New password"
        required
        autocomplete="new-password"
      />
      <EyeSVG visibility="reset" />
    </div>

    <input
      class="user-input"
      class:red-border={!regexpPasswordValidation.test(password) ||
        password !== confirmPassword}
      type={$passwordVisible.reset ? 'text' : 'password'}
      bind:value={confirmPassword}
      placeholder="Confirm new password"
      required
    />

    {#if password}
      {#if !regexpRestrictedCharsCheck.test(password)}
        <p class="validation">Password contains a restricted character!</p>
      {:else if !regexpLengthCheck.test(password)}
        <p class="validation">Password should contain 8 - 24 characters</p>
      {/if}

      {#if !regexpSpecialCharCheck.test(password)}
        <p class="validation">
          Provide at least one special character: @ $ ! % * # ? & , .
        </p>
      {/if}

      {#if !regexpCapitalLetterCheck.test(password)}
        <p class="validation">Provide at least one capital letter</p>
      {/if}

      {#if !regexpLowercaseLetterCheck.test(password)}
        <p class="validation">Provide at least one lowercase letter</p>
      {/if}

      {#if !regexpNumberCheck.test(password)}
        <p class="validation">Provide at least one number</p>
      {/if}

      {#if confirmPassword && password !== confirmPassword}
        <p class="validation">Passwords do not match!</p>
      {/if}
    {:else}
      <p class="validation">Please enter new password</p>
    {/if}

    <button
      on:click={() => acct.resetPassword({ email, password, token })}
      disabled={!validation}
    >
      Reset Password
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
