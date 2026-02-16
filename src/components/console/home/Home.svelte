<script lang="ts">
  import { user } from '@stores/account.svelte';
  import { showProfile } from '@stores/modal.svelte';

  import UnfinishedStories from '@components/console/home/UnfinishedStories.svelte';
  import FinishedStories from '@components/console/home/FinishedStories.svelte';
  import FooterLinks from '@components/console/common/FooterLinks.svelte';
</script>

{#if $user}
  <p>
    Your command center for CoNexus. Return to ongoing stories, scan recent
    activity, and branch to resources and controls.
  </p>

  <UnfinishedStories />
  <FinishedStories />

  <FooterLinks />
{:else}
  <div class="container">
    <h3 class="white-txt">Welcome to CoNexus</h3>
    <p class="white-txt">
      Sign in to access your command center, return to ongoing stories, and
      explore the multiverse.
    </p>
    <button class="cta" onclick={() => ($showProfile = true)}>Sign In</button>
  </div>
{/if}
