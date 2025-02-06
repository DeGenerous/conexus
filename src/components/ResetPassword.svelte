<script lang="ts">
  import Account from '@lib/auth';
  import { toastStore } from '@stores/toast';

  export let token: string;

  let email = '';
  let password = '';
  let passwordConfirm = '';

  const resetPassword = async () => {
    if (password !== passwordConfirm) {
      alert('Passwords do not match');
      return;
    }

    await Account.resetPassword({ email, password, token });
  };
</script>

<form
  on:submit|preventDefault={Account.resetPassword({ email, password, token })}
>
  <input type="email" bind:value={email} placeholder="Email" required />
  <input
    type="password"
    bind:value={password}
    placeholder="Password"
    required
  />
  <input
    type="password"
    bind:value={passwordConfirm}
    placeholder="Confirm Password"
    required
  />
  <button type="submit">Reset Password</button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
