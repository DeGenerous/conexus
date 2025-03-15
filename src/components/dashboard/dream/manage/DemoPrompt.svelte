<script lang="ts">
  import { onMount } from 'svelte';
  import { AdminApp } from '@lib/admin';
  import { CoNexusGame } from '@lib/story';

  let adminApp: AdminApp = new AdminApp();
  let game: CoNexusGame = new CoNexusGame();

  let promptId: string | null = null;
  let topic_name: string | null = null;
  let story: GameData | null = null;
  let step: StepData | null = null;

  let loading: boolean = false;
  let demoStarted: boolean = false;

  onMount(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      promptId = urlParams.get('demoID');
      topic_name = urlParams.get('demoName');

      console.log('Prompt ID:', promptId);
      console.log('Topic Name:', topic_name);

      if (!promptId) {
        window.history.back();
      }
    }
  });

  const startDemo = async () => {
    demoStarted = true;
    loading = true;

    if (promptId) {
      story = await adminApp.demoPrompt(parseInt(promptId));
      loading = false;
    }
  };

  const handleResponse = async (story_id: string, choice: number) => {
    loading = true;
    const { data } = await game.respond(story_id, choice);
    if (data) story = data;
    loading = false;
  };

  $: step = story as StepData;
</script>

{#if !demoStarted}
  <!-- Start Button -->
  <div class="container">
    <button class="start-btn" on:click={startDemo}
      >Start {topic_name} Demo</button
    >
  </div>
{:else if loading}
  <!-- Loading Animation -->
  <div class="container">
    <div class="dots">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  </div>
{:else if !story}
  <!-- Error State -->
  <div class="container">
    <h1 class="error-text">Sorry, we couldn't find that prompt</h1>
  </div>
{:else}
  <!-- Story UI -->
  <div class="container">
    <h1 class="story-text">{step.story}</h1>
    <div class="options">
      {#each step.options as option, i}
        <button
          class="option-btn"
          on:click={() => story && handleResponse(story.id.toString(), i + 1)}
        >
          {option}
        </button>
      {/each}
    </div>
  </div>
{/if}

<style>
  /* General Styling */
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
    color: white;
  }

  /* Start Button */
  .start-btn {
    background: linear-gradient(135deg, #007bff, #0056b3);
    color: white;
    padding: 12px 24px;
    font-size: 18px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition:
      transform 0.2s ease,
      background 0.3s ease;
  }

  .start-btn:hover {
    transform: scale(1.05);
    background: linear-gradient(135deg, #0056b3, #003d82);
  }

  /* Loading Dots */
  .dots {
    display: flex;
    gap: 10px;
  }

  .dot {
    width: 16px;
    height: 16px;
    background-color: white;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
  }

  .dot:nth-child(1) {
    animation-delay: -0.3s;
  }
  .dot:nth-child(2) {
    animation-delay: -0.15s;
  }
  .dot:nth-child(3) {
    animation-delay: 0s;
  }

  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: translateY(0);
      opacity: 0.3;
    }
    40% {
      transform: translateY(-10px);
      opacity: 1;
    }
  }

  /* Error Text */
  .error-text {
    font-size: 22px;
    color: #ff4d4d;
  }

  /* Story Text */
  .story-text {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  /* Option Buttons */
  .options {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .option-btn {
    background: #2c3e50;
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition:
      background 0.3s ease,
      transform 0.2s ease;
  }

  .option-btn:hover {
    background: #1c2833;
    transform: scale(1.05);
  }
</style>
