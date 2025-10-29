<script lang="ts">
  import { regexpEmail } from '@constants/regexp';

  let inputEmail = $state<string>('');
  let emailValid = $derived<boolean>(regexpEmail.test(inputEmail));

  const verifyEmail = async (): Promise<boolean> => {
    console.log('Verifying email:', inputEmail);
    return false; // Simulate verification failure
  };
</script>

<form class="container">
  <h5>Only invited testers can sign in.</h5>
  <input
    name="testing-email"
    type="email"
    placeholder="Enter your email"
    bind:value={inputEmail}
  />
  <button type="submit" onclick={verifyEmail} disabled={!emailValid}>
    Verify Email
  </button>
</form>
