<script lang="ts">
  import { onMount } from 'svelte';

  import getNFTs from '@utils/potentials';

  import Ranks from '@components/omnihub/Ranks.svelte';
  import NFTs from '@components/omnihub/NFTs.svelte';

  onMount(getNFTs);
</script>

<NFTs />

<Ranks />
