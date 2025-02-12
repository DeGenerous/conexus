<script lang="ts">
  import Account from '@lib/auth';
  import { authenticated } from '@stores/account';

  export let token: string;
  let user: Nullable<User> = null;

  authenticated.subscribe((value) => {
    user = value.user;
  });
</script>

{#await Account.confirmEmail(user?.email!, token)}
  <div class="container">
    <h1>Verifying Email...</h1>
  </div>
{:then response}
  <div class="container">
    <h1>Email Verified</h1>
    <p>Your email has been verified. You can now login to your account.</p>
  </div>
{:catch error}
  <div class="container">
    <h1>Error</h1>
    <p>{error.message}</p>
  </div>
{/await}

<style>
  .container {
    max-width: 400px;
    margin: 0 auto;
    padding: 1rem;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
</style>
