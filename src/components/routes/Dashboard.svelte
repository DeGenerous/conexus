<script lang="ts">
  import { onMount } from 'svelte';

  import GeneralInfo from '@components/dashboard/GeneralInfo.svelte';
  import CreateStory from '@components/dashboard/CreateStory.svelte';
  import ManageStories from '@components/dashboard/ManageStories.svelte';
  import StoryMetrics from '@components/dashboard/StoryMetrics.svelte';
  import ProfileSettings from '@components/dashboard/ProfileSettings.svelte';
  import { checkUserState } from '@utils/route-guard';

  // onMount(async () => {
  //   await checkUserState(`/dashboard`);
  // });

  type Section = {
    name: string;
    component?: any;
    subsections?: { name: string; component: any }[];
    expanded?: boolean;
  };

  let dashboardSections: Section[] = [
    { name: 'General Info', component: GeneralInfo },
    {
      name: 'Stories',
      subsections: [
        { name: 'Create Story', component: CreateStory },
        { name: 'Manage Stories', component: ManageStories },
        { name: 'Story Metrics', component: StoryMetrics },
      ],
      expanded: false,
    },
    { name: 'Profile Settings', component: ProfileSettings },
  ];

  let currentComponent: any = GeneralInfo;

  function selectComponent(component: any) {
    currentComponent = component;
  }

  function toggleSection(index: number) {
    if (dashboardSections[index].subsections) {
      dashboardSections[index].expanded = !dashboardSections[index].expanded;
    } else {
      selectComponent(dashboardSections[index].component);
    }
  }
</script>

<div class="dashboard">
  <!-- Sidebar Navigation -->
  <nav class="sidebar">
    {#each dashboardSections as section, i}
      <div class="nav-section">
        <button
          class="nav-item {currentComponent === section.component
            ? 'active'
            : ''}"
          on:click={() => toggleSection(i)}
        >
          <span>{section.name}</span>
          {#if section.subsections}
            <span class="arrow">{section.expanded ? '↓' : '→'}</span>
          {/if}
        </button>
        {#if section.subsections && section.expanded}
          <div class="subsections">
            {#each section.subsections as sub}
              <button
                class="sub-nav-item"
                on:click={() => selectComponent(sub.component)}
              >
                {sub.name}
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </nav>

  <!-- Content Display -->
  <main class="content">
    <svelte:component this={currentComponent} />
  </main>
</div>

<style>
  .dashboard {
    display: flex;
    height: 100vh;
  }

  .sidebar {
    width: 250px;
    background-color: #2c3e50;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .nav-section {
    display: flex;
    flex-direction: column;
  }

  .nav-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: none;
    border: none;
    color: white;
    font-size: 16px;
    padding: 12px;
    text-align: left;
    cursor: pointer;
    transition: background 0.3s ease;
    border-radius: 5px;
  }

  .nav-item:hover,
  .nav-item.active {
    background-color: #1a252f;
  }

  .subsections {
    display: flex;
    flex-direction: column;
    padding-left: 20px;
  }

  .sub-nav-item {
    font-size: 14px;
    padding: 10px 15px;
    background: none;
    border: none;
    color: white;
    text-align: left;
    cursor: pointer;
    transition: background 0.3s ease;
    border-radius: 5px;
    width: 100%;
  }

  .sub-nav-item:hover {
    background-color: #34495e;
  }

  .arrow {
    transition: transform 0.2s ease;
  }

  .content {
    flex: 1;
    padding: 30px;
    background: black;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }
</style>
