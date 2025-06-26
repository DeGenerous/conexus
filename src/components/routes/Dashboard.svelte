<script lang="ts">
  import { showProfile } from '@stores/modal.svelte';

  import DoorSVG from '@components/icons/Door.svelte';

  // let loading = $state<boolean>(true);

  // $effect(() => {
  //   loading = false;
  // });
</script>

<section class="container">
  <h4 class="text-glowing">This Part of the Realm Is Yours to Unlock</h4>
  <DoorSVG
    state="inside"
    text="Sign in to view your dashboard"
    onclick={() => {
      $showProfile = true;
    }}
    glow={true}
  />
</section>
