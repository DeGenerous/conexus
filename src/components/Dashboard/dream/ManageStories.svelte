<script>
  import { AdminApp } from "@lib/admin";
  import { onMount } from "svelte";

  let admin = new AdminApp();

  onMount(() => {
    admin.fetchCollections().then((res) => {
      console.log(res)
    })
  })

  const switchAvailable = (available) => {
    if (available === 'available') return 'unavailable';
    else return 'available';
  }
</script>

<section class="container-wrapper">
  {#await admin.fetchCollections()}
    <h2>Loading collections...</h2>
  {:then { collections }}
    {#each collections as { category_name, section_name, topics }}
      <section class="container blur">
        <div class="buttons-wrapper category-header">
          <p class="collection-header">{category_name}</p>
          <div>
            <label for="section">Select section:</label>
            <select
              class="selector blur"
              value={section_name}
            >
              <option value={section_name}>{section_name}</option>
            </select>
          </div>
        </div>
        <div class="tiles-collection">
          {#each topics as {topic_name, order, available, prompt_id}}
            <a class="tile" href="/dashboard/dream/manage/{topic_name}">
              <h2>{topic_name}</h2>
              <h3>Order: {order}</h3>
              <button
                class:green-button={available === 'available'}
                class:red-button={available === 'unavailable'}
                on:click|preventDefault={() =>
                  (admin.changeAvailability(prompt_id, switchAvailable(available)))
                }
              >
                {available}
              </button>
            </a>
          {/each}
        </div>
      </section>
    {/each}
  {/await}
</section>

<style>
  .container {
    width: 100vw;
    padding-inline: 0;
    border-radius: 0;
  }

  .tiles-collection {
    background-image: none;
    background-color: rgba(22, 30, 95, 0.75);
  }

  .tile {
    padding: 1vw;
    gap: 1vw;
  }

  button {
    text-transform: capitalize;
  }

  .category-header {
    width: 95%;
    justify-content: space-between;
  }
</style>
