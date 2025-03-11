<script lang="ts">
  export let topic_name = '';
  export let is_admin = false;
  export let changeTopicName = async (old_name: string, new_name: string) => {};

  let newName = topic_name;
  let contextMenuOpen = { open: false, topic_name: '' };

  function handleRightClick(event: MouseEvent, name: string) {
    event.preventDefault();
    if (is_admin) {
      newName = name;
      contextMenuOpen = { open: true, topic_name: name };
    }
  }

  function handleClick() {
    contextMenuOpen = { open: false, topic_name: '' };
  }

  async function handleNameUpdate() {
    await changeTopicName(topic_name, newName);
    handleClick();
  }
</script>

<div class="container">
  {#if contextMenuOpen.open}
    <div>
      <input type="text" bind:value={newName} class="input" />
      <div class="button-group">
        <button
          title="Save changes"
          disabled={newName === '' || !is_admin}
          on:click={() => handleNameUpdate()}
          class="save-button"
        >
          Save
        </button>
        <button
          title="Cancel changes"
          on:click={handleClick}
          class="cancel-button"
        >
          Cancel
        </button>
      </div>
    </div>
  {:else}
    <div
      class="label-container"
      role="button"
      tabindex="0"
      on:contextmenu={(e) => handleRightClick(e, topic_name)}
    >
      <p class="topic-name">{topic_name}</p>
      <span class="tooltip-text">Right click to edit the name</span>
    </div>
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
  }

  .input {
    border: 1px solid #ccc;
    color: black;
    padding: 8px;
    border-radius: 5px;
  }

  .button-group {
    display: flex;
    gap: 10px;
    margin-top: 8px;
  }

  .save-button {
    background-color: #059669;
    padding: 10px;
    border-radius: 8px;
    color: white;
    cursor: pointer;
  }

  .cancel-button {
    background-color: #6b7280;
    padding: 10px;
    border-radius: 8px;
    color: white;
    cursor: pointer;
  }

  .label-container {
    text-align: center;
    cursor: context-menu;
    position: relative;
  }

  .topic-name {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    text-transform: capitalize;
  }

  .tooltip-text {
    visibility: hidden;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 5px;
    border-radius: 5px;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
  }

  .label-container:hover .tooltip-text {
    visibility: visible;
  }
</style>
