<script lang="ts">
  import { onMount } from 'svelte';

  import Collection from '@lib/collection';

  const collection = new Collection();

  let gates = $state<Partial<GateResponse>[]>([]);
  onMount(async () => {
    gates = await collection.listGates('00000000-0000-0000-0000-000000000001');
    console.log('gates', gates);
  });
</script>

<p>
  TODO: listGates createERC20TokenGate createERC721NFTGate createERC721ClassGate
  deleteGate
</p>
