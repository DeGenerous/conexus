<script lang="ts">
  import { Account } from '@lib/account';
  import EyeSVG from '@components/icons/Eye.svelte';
  import passwordVisible from '@stores/password-visibility';

  export let token: string;

  let acct: Account = new Account();

  let email: string = '';
  let password: string = '';
  let passwordConfirm: string = '';

  $: passwordsMatch = password && password === passwordConfirm;
  $: validation =
    email && password.length >= 8 && passwordsMatch && emailValidation;

  $: emailValidation = email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );
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
        class:red-border={!password || password.length < 8}
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
      class:red-border={!passwordsMatch}
      type={$passwordVisible.reset ? 'text' : 'password'}
      bind:value={passwordConfirm}
      placeholder="Confirm new password"
      required
    />

    {#if !password}
      <p class="validation">Provide new password</p>
    {:else if password.length < 8}
      <p class="validation">Password should contain at least 8 characters!</p>
    {:else if !passwordsMatch}
      <p class="validation">Passwords do not match!</p>
    {/if}

    <button
      on:click={() => acct.resetPassword({ email, password, token })}
      disabled={!validation}
    >
      Reset Password
    </button>
  </div>
</div>
