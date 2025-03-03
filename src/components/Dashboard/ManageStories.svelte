<script>
  let stories = [];

  async function deleteStory(id) {
    await fetch(`/api/stories/${id}`, { method: 'DELETE' });
    stories = stories.filter((story) => story.id !== id);
  }
</script>

<h2>Manage Stories</h2>

{#await fetch('/api/stories') then stories}
  {#if stories.length === 0}
    <p>No stories available.</p>
  {:else}
    {#each stories as story}
      <div class="container">
        <h2>{story.title}</h2>
        <p>{story.content}</p>
        <button class="delete-button" on:click={() => deleteStory(story.id)}
          >Delete</button
        >
      </div>
    {/each}
  {/if}
{/await}

<!-- examples -->
<div class="container">
  <h3>Shadow of the Shogun</h3>
  <p>In the shadowed chaos of 16th-century Japan, you lead the Iga Ninja Clan as warlords clash for dominion. With Oda Nobunaga’s armies marching to annihilate your people, every decision—be it guerrilla warfare, assassination, or betrayal—shapes the fate of your clan. Infiltrate enemy castles, manipulate powerful daimyo, and master the art of deception to survive the bloodstained Sengoku era, where honor is fleeting, and the blade is absolute.</p>
  <div class="buttons-wrapper">
    <button
      class="red-button"
      on:click={() => deleteStory(story.id)}
    >
      Delete
    </button>
    <button>Play Demo</button>
    <button class="green-button">Submit</button>
  </div>
</div>

<div class="container">
  <h3>Che Guevara: Revolution</h3>
  <p>Step into the boots of Ernesto "Che" Guevara, the Argentine doctor turned revolutionary icon. From the battlefields of Cuba to the jungles of Bolivia, every decision shapes history—will you forge a lasting rebellion, or meet your fate as a martyr of the revolution?</p>
  <div class="buttons-wrapper">
    <button
      class="red-button"
      on:click={() => deleteStory(story.id)}
    >
      Delete
    </button>
    <button>Play Demo</button>
    <button class="green-button">Submit</button>
  </div>
</div>

<style>
  .container h3 {
    color: rgba(51, 226, 230, 0.9);
  }

  @media only screen and (max-width: 600px) {
    .container {
      width: 100vw;
      border-radius: 0;
    }
  }
</style>
