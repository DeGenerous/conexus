<script lang="ts">
  import { user } from '@stores/account.svelte';

  import UnfinishedStories from '@components/dashboard/home/UnfinishedStories.svelte';
  import FinishedStories from '@components/dashboard/home/FinishedStories.svelte';
  import FooterLinks from '@components/dashboard/common/FooterLinks.svelte';
</script>

<p>
  Your command center for CoNexus. Return to ongoing stories, scan recent
  activity, and branch to resources and settings.
</p>

{#if $user?.username}
  <a class="button-anchor cta" href="/c/{$user.username}" target="_self">
    Go to your section
  </a>
{/if}

<UnfinishedStories />
<FinishedStories />

<FooterLinks />
