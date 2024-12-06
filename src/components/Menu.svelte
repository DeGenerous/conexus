<script lang="ts">
  import { authenticated, web3LoggedIn } from '@stores/account';

  import Intro from './Intro.svelte';

  let isLogged: boolean = false;
  let isWeb3LoggedIn: boolean = false;

  authenticated.subscribe((value) => {
    isLogged = value.loggedIn;
  });

  web3LoggedIn.subscribe((value) => {
    isWeb3LoggedIn = value;
  });
</script>

<!-- Logged In -->

{#if isLogged}
  <!-- We3b3 -->
  {#if isWeb3LoggedIn}
    <Intro />
  {/if}
{:else}
  <!-- Intro Logged out -->
{/if}
