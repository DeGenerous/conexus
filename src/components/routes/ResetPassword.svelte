<script lang="ts">
  import Authentication from '@lib/authentication';
  import EyeSVG from '@components/icons/Eye.svelte';
  import passwordVisible from '@stores/password-visibility.svelte';
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

  let { token }: { token: string } = $props();

  let auth: Authentication = new Authentication();

  let email = $state<string>('');
  let password = $state<string>('');
  let confirmPassword = $state<string>('');

  let emailValidation = $derived<boolean>(regexpEmail.test(email));

  let validation = $derived<boolean>(
    Boolean(email) &&
      regexpPasswordValidation.test(password) &&
      password === confirmPassword &&
      emailValidation,
  );
</script>

<form class="container">
  <h4>Confirm your email address and create a new password</h4>
  <input
    class:red-border={!email || !emailValidation}
    type="email"
    bind:value={email}
    placeholder="Email"
    required
  />

  {#if !email || !emailValidation}
    <p class="validation">Provide the email associated with your profile</p>
  {/if}

  <div class="input-container">
    <input
      class:red-border={!regexpPasswordValidation.test(password)}
      type={passwordVisible.reset ? 'text' : 'password'}
      bind:value={password}
      placeholder="New password"
      required
      autocomplete="new-password"
    />
    <EyeSVG visibility="reset" />
  </div>

  <input
    class:red-border={!regexpPasswordValidation.test(password) ||
      password !== confirmPassword}
    type={passwordVisible.reset ? 'text' : 'password'}
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
    type="submit"
    onclick={(event: Event) => {
      event.preventDefault();
      auth.resetPassword({ email, password, token });
    }}
    disabled={!validation}
  >
    Reset Password
  </button>
</form>
