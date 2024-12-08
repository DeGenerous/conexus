<script lang="ts">
  import { authenticated } from '@stores/account';

  import Intro from './Intro.svelte';

  let isLogged: boolean = false;

  authenticated.subscribe((value) => {
    isLogged = value.loggedIn;
  });
</script>

<!-- Logged In -->

{#if isLogged}
  <Intro />
{:else}
  <!-- Intro Logged out -->
{/if}
