<script lang="ts">
  import { onMount } from 'svelte';
  import { checkUserState } from '@utils/route-guard';

  import GeneralInfo from './dashboard/GeneralInfo.svelte';
  import StoryMetrics from './dashboard/StoryMetrics.svelte';

  onMount(async () => {
    await checkUserState('/story', checkAdmin = true);
  });
</script>

<section class="container-wrapper">
  <div class="container buttons-wrapper blur">
    <a href="/dashboard/dream">Dream</a>
    |
    <a href="/dashboard/profile">Profile</a>
  </div>

  <GeneralInfo />

  <StoryMetrics />
</section>
