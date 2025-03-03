<script lang="ts">
  import { onMount } from 'svelte';

  import GeneralInfo from '@components/Dashboard/GeneralInfo.svelte';
  import CreateStory from '@components/Dashboard/CreateStory.svelte';
  import ManageStories from '@components/Dashboard/ManageStories.svelte';
  import StoryMetrics from '@components/Dashboard/StoryMetrics.svelte';
  import ProfileSettings from '@components/Dashboard/ProfileSettings.svelte';
  import { checkUserState } from '@utils/route-guard';

  onMount(async () => {
    await checkUserState(`/dashboard`);
  });

  type Section = {
    name: string;
    component?: any;
    subsections?: { name: string; component: any }[];
    expanded?: boolean;
  };

  let dashboardSections: Section[] = [
    { name: 'Stats', component: GeneralInfo },
    {
      name: 'Stories',
      subsections: [
        { name: 'Create Story', component: CreateStory },
        { name: 'Manage Stories', component: ManageStories },
        { name: 'Story Metrics', component: StoryMetrics },
      ],
      expanded: false,
    },
    { name: 'Profile', component: ProfileSettings },
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

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="dashboard">
  <!-- Sidebar Navigation -->
  <nav class="blur">
    {#each dashboardSections as section, i}
      <div class="nav-section">
        <div
          class="nav-item"
          class:active={currentComponent === section.component ||
            (section.subsections && section.expanded)}
          on:click={() => toggleSection(i)}
          role="button"
          tabindex="0"
        >
          <span>{section.name}</span>
          {#if section.subsections}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-100 -100 200 200"
              class="option-selector-svg"
              fill={section.expanded ? 'rgb(51, 226, 230)' : '#dedede'}
              stroke={section.expanded ? 'rgb(51, 226, 230)' : '#dedede'}
              stroke-width="20"
              stroke-linecap="round"
              stroke-linejoin="round"
              transform={section.expanded ? 'rotate(90)' : ''}
            >
              <polygon
                class="option-selector-icon"
                points="
                  -40 -90 -40 90 50 0
                "
                opacity="0.75"
              />
            </svg>
          {/if}
        </div>
        {#if section.subsections && section.expanded}
          <div class="subsections blur">
            {#each section.subsections as sub}
              <div
                class="sub-nav-item"
                on:click={() => {
                  selectComponent(sub.component);
                  dashboardSections[i].expanded = false;
                }}
                role="button"
                tabindex="0"
              >
                {sub.name}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </nav>

  <!-- Content Display -->
  <div class="content blur">
    <svelte:component this={currentComponent} />
  </div>
</div>

<style>
  .dashboard {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
  }

  nav {
    width: 100vw;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: center;
    background-color: rgba(36, 65, 189, 0.75);
    box-shadow: 0 0 0.5vw #010020;
    z-index: 100;
    position: sticky;
    top: 0;
  }

  .nav-section {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
  }

  .nav-item {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: 0.5vw;
    cursor: pointer;
    padding: 1vw 1.5vw;
    font-size: 1.5vw;
    position: relative;
    width: 100%;
  }

  .subsections {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 100%;
    background-color: rgba(22, 30, 95);
    animation: fadeIn 0.3s ease-in-out forwards;
    border-bottom-right-radius: 1.5vw;
    border-bottom-left-radius: 1.5vw;
    box-shadow: 0 0.25vw 0.5vw #010020;
  }

  .sub-nav-item {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 1vw 1.5vw;
    font-size: 1.25vw;
    width: 100%;
    border-radius: 1.5vw;
  }

  .nav-item:hover,
  .sub-nav-item:hover {
    background-color: rgba(45, 90, 216, 0.9);
    color: rgba(51, 226, 230, 0.9);
  }

  .active {
    color: rgba(51, 226, 230, 0.9);
    text-shadow: 0 0 0.1vw rgb(51, 226, 230);
  }

  .option-selector-svg {
    width: 1.25vw;
    height: 1.25vw;
  }

  .content {
    width: 100vw;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;
    gap: 1.5vw;
    padding: 2vw;
    background-image: radial-gradient(
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0),
      rgba(51, 226, 230, 0.1)
    );
    box-shadow:
      inset 0 0 0.5vw rgba(51, 226, 230, 0.25),
      0 0vw 0.5vw #010020;
  }

  @media only screen and (max-width: 600px) {
    nav {
      justify-content: center;
      position: static;
    }

    .nav-item {
      padding: 0.5em;
      font-size: 1em;
      gap: 0.5em;
    }

    .subsections {
      width: 100vw;
      border-bottom-right-radius: 0.5em;
      border-bottom-left-radius: 0.5em;
    }

    .sub-nav-item {
      padding: 0.5em;
      font-size: 1em;
      border-radius: 0.5em;
    }

    .option-selector-svg {
      width: 0.75em;
      height: 0.75em;
    }

    .content {
      min-height: 100vw;
      gap: 1em;
      padding: 1em;
    }
  }
</style>
