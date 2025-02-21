<script>
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';

    import { authenticated } from '@stores/account';

    let storiesPlayedLastWeek = [];
    let topPerformingStories = [];

    const { user } = get(authenticated);

    // Assume these functions fetch data from APIs
    async function fetchUserInfo() {
        // Fetch user info from API
        userInfo = await fetch('/api/user/info').then(res => res.json());
    }

    async function fetchStoriesPlayedLastWeek() {
        // Fetch stories played last week from API
        storiesPlayedLastWeek = await fetch('/api/stories/played/last-week').then(res => res.json());
    }

    async function fetchTopPerformingStories() {
        // Fetch top performing stories from API
        topPerformingStories = await fetch('/api/stories/top-performing').then(res => res.json());
    }

    // onMount(async () => {
    //     await fetchUserInfo();
    //     await fetchStoriesPlayedLastWeek();
    //     await fetchTopPerformingStories();
    // });
</script>

<style>
    .general-info {
        padding: 1rem;
    }
    .welcome {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }
    .metrics {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    @media (min-width: 600px) {
        .metrics {
            flex-direction: row;
        }
    }
</style>

<div class="general-info">
    <div class="welcome">
        Welcome, {user?.first_name}!
    </div>
    <div class="metrics">
        <div class="metric">
            <h3>Stories Played Last Week</h3>
            <ul>
                {#each storiesPlayedLastWeek as story}
                    <li>{story.title}</li>
                {/each}
            </ul>
        </div>
        <div class="metric">
            <h3>Top Performing Stories</h3>
            <ul>
                {#each topPerformingStories as story}
                    <li>{story.title}</li>
                {/each}
            </ul>
        </div>
    </div>
</div>