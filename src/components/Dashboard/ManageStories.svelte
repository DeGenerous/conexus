<script>
    import { onMount } from 'svelte';
    let stories = [];

    onMount(async () => {
        const response = await fetch('/api/stories');
        stories = await response.json();
    });

    async function deleteStory(id) {
        await fetch(`/api/stories/${id}`, { method: 'DELETE' });
        stories = stories.filter(story => story.id !== id);
    }
</script>

<style>
    .story {
        margin-bottom: 1rem;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    .delete-button {
        background-color: red;
        color: white;
        border: none;
        padding: 0.5rem;
        cursor: pointer;
    }
</style>

<div>
    <h1>Manage Stories</h1>
    {#if stories.length === 0}
        <p>No stories available.</p>
    {/if}
    {#each stories as story}
        <div class="story">
            <h2>{story.title}</h2>
            <p>{story.content}</p>
            <button class="delete-button" on:click={() => deleteStory(story.id)}>Delete</button>
        </div>
    {/each}
</div>