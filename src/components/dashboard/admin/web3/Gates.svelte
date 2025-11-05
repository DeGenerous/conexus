<script lang="ts">
  import { onMount } from 'svelte';

  import Collection from '@lib/collection';

  let {
    collection_id = '00000000-0000-0000-0000-000000000001',
  }: {
    collection_id: string;
  } = $props();

  const collection = new Collection();

  let gates = $state<Partial<GateResponse>[]>([]);

  onMount(async () => {
    gates = await collection.listGates(collection_id);
    console.log('fetched gates for collection', collection_id);
    console.log('gates', gates);
  });
</script>
