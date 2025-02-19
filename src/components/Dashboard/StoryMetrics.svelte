<script lang="ts">
  const storySections: string[] = ['Top Stories', 'Most Played', 'Most Liked'];
  let currentSection = 0;

  function changeStorySection() {
    currentSection = (currentSection + 1) % storySections.length;
  }
</script>

<div class="metrics-container">
  <h1>Metrics</h1>
  <select
    class="drop-down"
    value={currentSection}
    on:change={changeStorySection}
  >
    {#each storySections as section, i}
      <option value={i}>{section}</option>
    {/each}
  </select>
</div>

<style>
  .metrics-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .drop-down {
    padding: 0.5rem;
    font-size: 1rem;
  }
</style>
