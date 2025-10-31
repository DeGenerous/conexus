<script lang="ts">
  import { onMount } from 'svelte';

  import AdminApp from '@lib/admin';
  import Collection from '@lib/collection';

  import Collections from '@components/dashboard/admin/web3/Collections.svelte';
  import Gates from '@components/dashboard/admin/web3/Gates.svelte';

  const admin = new AdminApp();
  const collection = new Collection();

  let collections = $state<Partial<CollectionResponse>[]>([]);
  onMount(async () => {
    collections = await collection.listCollections();
    console.log('collections', collections);
  });
</script>

<h3>Collections & Gates</h3>

<!-- <p>
  TODO: createNewContract deleteContract createNewTokenGate createNewClassGate
  getAllGates getGate deleteGate
</p> -->

<Collections />

<Gates />
