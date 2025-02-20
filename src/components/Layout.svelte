<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { authenticated } from '@stores/account';

  const { user, loggedIn } = get(authenticated);
  let allowed = false;

  console.log("User in protected route: ", user);

  onMount(() => {
    if (!user) {
      window.location.href = '/';
    } else {
      allowed = true;
    }
  });
</script>

{#if allowed}
  <slot />
{/if}
