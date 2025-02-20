<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { authenticated } from '@stores/account';
  import { checkUserState } from '@utils/route-guard';

  import CreatePrompt from './CreatePrompt.svelte';
  import GeneralInfo from './GeneralInfo.svelte';
  import StoryMetrics from './StoryMetrics.svelte';

  const { user } = get(authenticated);
  
  // onMount(async () => {
  //   await checkUserState(`/dashboard`);
  // });

  const dashboardSections = [
    { name: 'General Info', component: GeneralInfo },
    { name: 'Story Metrics', component: StoryMetrics },
    { name: 'Create Prompt', component: CreatePrompt },
  ];

  let currentSection = 0;

  function selectSection(index: number) {
    currentSection = index;
  }
</script>

<div class="dashboard">
  <!-- Sidebar Navigation -->
  <nav class="sidebar">
    {#each dashboardSections as section, i}
      <button
        class="nav-item {currentSection === i ? 'active' : ''}"
        on:click={() => selectSection(i)}
      >
        {section.name}
      </button>
    {/each}
  </nav>

  <!-- Content Display -->
  <main class="content">
    <svelte:component this={dashboardSections[currentSection].component} />
  </main>
</div>

<style>
  .dashboard {
    display: flex;
    height: 100vh;
  }

  .sidebar {
    width: 220px;
    background-color: #2c3e50;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }

  .nav-item {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    padding: 15px;
    text-align: left;
    cursor: pointer;
    transition: background 0.3s;
    border-radius: 5px;
  }

  .nav-item:hover,
  .nav-item.active {
    background-color: #1a252f;
  }

  .content {
    flex: 1;
    padding: 30px;
  }
</style>
