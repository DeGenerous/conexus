<script lang="ts">
  import { checkUserState } from '@utils/route-guard';

  let loading = $state<boolean>(true);

  $effect(() => {
    checkUserState('/dashboard', true);
    loading = false;
  });
</script>

{#if loading}
  <img class="loading-logo" src="/icons/loading.png" alt="Loading" />
{:else}
  <section class="container">
    <h4 class="text-glowing">This part of the realm is still unwritten</h4>
  </section>
{/if}
