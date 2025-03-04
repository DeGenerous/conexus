<script lang="ts">
  import { onMount } from 'svelte';

  import GeneralInfo from '@components/Dashboard/GeneralInfo.svelte';
  import CreateStory from '@components/Dashboard/CreateStory.svelte';
  import ManageStories from '@components/Dashboard/ManageStories.svelte';
  import Media from '@components/Dashboard/Media.svelte';
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
        { name: 'Media', component: Media },
      ],
      expanded: false,
    },
    { name: 'Profile', component: ProfileSettings },
  ];

  // let currentComponent: any = GeneralInfo;
  let currentComponent: any = CreateStory;

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

<section class="container-wrapper">
  <a href="/dashboard/dream">Dream</a>
  <a href="/dashboard/profile">Profile</a>

  <h3>General Info</h3>
  <h3>Recent Interactions</h3>
  <h3>Story Metrics</h3>
</section>
