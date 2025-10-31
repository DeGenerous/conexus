<script lang="ts">
  import { onMount } from 'svelte';

  import Collection from '@lib/collection';

  const collection = new Collection();

  let collections = $state<Partial<CollectionResponse>[]>([]);
  onMount(async () => {
    collections = await collection.listCollections();
    console.log('collections', collections);
  });
</script>

<p>
  TODO: listCollections createERC20Collection createERC721Collection updateCollection deleteCollection
</p>
