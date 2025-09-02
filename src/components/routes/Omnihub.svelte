<script lang="ts">
  import NFTs from '@components/omnihub/NFTs.svelte';

  import {
    type NFT,
    potentials,
    potentialsPower,
    userRank,
  } from '@stores/omnihub.svelte';
</script>

<NFTs
  potentials={$potentials}
  potentialsPower={$potentialsPower}
  userRank={$userRank}
/>
