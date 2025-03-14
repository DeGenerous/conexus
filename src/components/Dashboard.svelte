<script lang="ts">
  import { onMount } from 'svelte';
  import { checkUserState } from '@utils/route-guard';

  import GeneralInfo from './dashy/GeneralInfo.svelte';
  import StoryMetrics from './dashy/StoryMetrics.svelte';

  onMount(async () => {
    await checkUserState('/story', true);
  });
</script>

<section class="container-wrapper">
  <GeneralInfo />

  <StoryMetrics />
</section>
