<script lang="ts">
  const openCreate = () => (window.open('/dashboard/dream/create', '_self'));
  const openManage = () => (window.open('/dashboard/dream/manage', '_self'));
</script>

<section class="container-wrapper">
  <div class="container blur">
    <h3>Dream It. Create It. Bring It to Life.</h3>
    <button
      on:click={openCreate}
    >
      Create
    </button>
    <h3>Start a new story from an infinite well of possibilities.</h3>

    <hr>
    
    <h3>Add the finishing touches to your masterpiece.</h3>
    <button
      on:click={openManage}
    >
      Manage
    </button>
    <h3>Upload media, refine, and perfect your vision.</h3>
  </div>
</section>

<style>
  button {
    text-transform: uppercase;
  }
</style>
