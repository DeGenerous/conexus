<script lang="ts">
  import { onMount } from 'svelte';

  import openModal from '@stores/modal.svelte';
  import { ensureMessage } from '@constants/modal';

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

  const deleteGate = async (gate_id: string) => {
    openModal(
      ensureMessage('delete this gate permanently'),
      'Delete Gate',
      async () => {
        try {
          await collection.deleteGate(gate_id);
          gates = gates.filter((gate) => gate.id !== gate_id);
        } catch (error) {
          console.error('Error deleting gate:', error);
        }
      },
    );
  };
</script>

<ul class="flex-row flex-wrap">
  {#each gates as gate}
    <li class="orange-tile transition">
      <h5>{gate.name}</h5>
      <p>
        {#if gate.gate_kind === 'erc20_token'}
          ERC20 Token
        {:else if gate.gate_kind === 'erc721_token'}
          ERC721 Token
        {:else if gate.gate_kind === 'erc721_class'}
          ERC721 Class
        {/if}
      </p>
      {#if gate.specific_token_ids || gate.token_id_min || gate.token_id_max || gate.min_amount}
        <span class="tile-data">
          {#if gate.gate_kind === 'erc20_token'}
            <p>Minimum Amount:</p>
            <p>{gate.min_amount}</p>
          {:else if gate.gate_kind === 'erc721_token'}
            <p>Allowed IDs:</p>
            <p>{gate.specific_token_ids?.join(', ')}</p>
          {:else if gate.gate_kind === 'erc721_class'}
            <p>IDs Range:</p>
            <p>{gate.token_id_min} - {gate.token_id_max}</p>
          {/if}
        </span>
      {/if}
      <button class="red-btn" onclick={() => deleteGate(gate.id!)}>
        Delete
      </button>
    </li>
  {/each}
</ul>

<style lang="scss">
  @use '/src/styles/mixins/' as *;

  ul {
    width: 100%;

    // .gate-tile {
    //   @include orange;
    // }
  }
</style>
