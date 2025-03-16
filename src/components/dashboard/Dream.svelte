<script lang="ts">
  import { onMount } from 'svelte';

  import { checkUserState } from '@utils/route-guard';

  onMount(async () => {
    await checkUserState('/dashboard/dream', true);
  });
</script>

<section class="container-wrapper">
  <div class="container blur">
    <h3>Dream It. Create It. Bring It to Life.</h3>
    <a class="button-anchor" href="/dashboard/dream/create">Create</a>
    <h3>Start a new story from an infinite well of possibilities.</h3>

    <hr />

    <h3>Add the finishing touches to your masterpiece.</h3>
    <a class="button-anchor" href="/dashboard/dream/manage">Manage</a>
    <h3>Upload media, refine, and perfect your vision.</h3>
  </div>
</section>

<style>
  a {
    text-transform: uppercase;
  }
</style>
