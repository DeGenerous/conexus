<script lang="ts">
  import UnfinishedStories from '@components/dashboard/home/UnfinishedStories.svelte';
  import FinishedStories from '@components/dashboard/home/FinishedStories.svelte';
  import FooterLinks from '@components/dashboard/common/FooterLinks.svelte';
</script>

<p>
  Your command center for CoNexus. Return to ongoing stories, scan recent
  activity, and branch to resources and settings.
</p>

<UnfinishedStories />
<FinishedStories />

<FooterLinks />
