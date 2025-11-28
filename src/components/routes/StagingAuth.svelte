<script lang="ts">
  import { regexpEmail } from '@constants/regexp';
  import Environment from '@lib/environment';

  const environment = new Environment();

  let inputEmail = $state<string>('');
  let emailValid = $derived<boolean>(regexpEmail.test(inputEmail));

  const verifyEmail = async (): Promise<void> => {
    await environment.login(inputEmail);
  };
</script>

<div class="container">
  <h5>Only invited testers can sign in.</h5>
  <input
    name="testing-email"
    type="email"
    placeholder="Enter your email"
    bind:value={inputEmail}
  />
  <button onclick={verifyEmail} disabled={!emailValid}> Verify Email </button>
</div>
