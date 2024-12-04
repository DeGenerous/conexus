<script lang="ts">
  import Intro from './Intro.svelte';
  // import { authenticated, web3LoggedIn } from "@stores/account";

  let isLogged: boolean = false;
  let isWeb3LoggedIn: boolean = false;

  // authenticated.subscribe((value) => {
  //   isLogged = value.loggedIn;
  // });

  // web3LoggedIn.subscribe((value) => {
  //   isWeb3LoggedIn = value;
  // });
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
