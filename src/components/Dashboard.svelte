<script lang="ts">
  import GeneralInfo from './dashboard/GeneralInfo.svelte';
  import StoryMetrics from './dashboard/StoryMetrics.svelte';
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
