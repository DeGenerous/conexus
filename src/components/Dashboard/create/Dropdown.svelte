<script>
  export let name;
  let isOpen = false;

  const toggleDropdown = () => {
    isOpen = !isOpen;
  };
</script>

<div class="dropdown">
  <button on:click={toggleDropdown} class="dropdown-toggle">
    {name}
    <span>{isOpen ? '▲' : '▼'}</span>
  </button>
  {#if isOpen}
    <div class="dropdown-content">
      <slot />
    </div>
  {/if}
</div>

<style>
  .dropdown {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 10px;
  }

  .dropdown-toggle {
    width: 100%;
    text-align: left;
    font-weight: bold;
    background: none;
    border: none;
    cursor: pointer;
  }

  .dropdown-content {
    margin-top: 10px;
  }
</style>
