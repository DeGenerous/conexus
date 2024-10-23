<script lang="ts">
  import Intro from './Intro.svelte';
  // import { authenticated, web3LoggedIn } from "@stores/account";

  let isLogged: boolean = true;

  let web3LoggedIn: boolean = true;

  // authenticated.subscribe((value) => {
  //   isLogged = value.loggedIn;
  // });
</script>

<!-- Logged In -->

{#if isLogged}
  <!-- We3b3 -->

  {#if web3LoggedIn}
      <Intro />
  {/if}
{:else}
  <!-- Intro -->
  <Intro />
{/if}
