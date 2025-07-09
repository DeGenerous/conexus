<script lang="ts">
  import { onMount } from 'svelte';

  import { GetCache, SELECTED_POTENTIAL_KEY } from '@constants/cache';
  import { type NFT } from '@stores/omnihub.svelte';

  let potential = $state<Nullable<NFT>>(null);

  onMount(() => {
    potential = GetCache(SELECTED_POTENTIAL_KEY);
  });
</script>

<section>
  <h2>Portrait</h2>
</section>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  * {
  }
</style>
