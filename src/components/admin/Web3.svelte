<script lang="ts">
  import { onMount } from 'svelte';

  import AdminApp from '@lib/admin';
  import Collection from '@lib/collection';

  import Collections from '@components/admin/web3/Collections.svelte';

  const admin = new AdminApp();
  const collection = new Collection();

  let collections = $state<Partial<CollectionResponse>[]>([]);
  onMount(async () => {
    collections = await collection.listCollections();
  });
</script>

<h3>Collections & Gates</h3>

<Collections />
