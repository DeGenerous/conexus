<script lang="ts">
  import { CoNexusGame } from '@lib/story';

  export let section: string;
  export let topicName: string;

  const game: CoNexusGame = new CoNexusGame();

  const storyName: string = (
    topicName.charAt(0).toUpperCase() + topicName.slice(1)
  ).trim();

  const blankPicture = '/blank.avif';
</script>

<a class="tile" href="/{section}/{topicName}">
  {#await game.fetch_story_image(topicName!, 'tile')}
    <img
      class="tile-picture"
      loading="lazy"
      src={blankPicture}
      alt={storyName}
      draggable="false"
      height="1024"
      width="1024"
    />
  {:then storyImage}
    <img
      class="tile-picture"
      loading="lazy"
      src={storyImage ?? blankPicture}
      alt={storyName}
      draggable="false"
      height="1024"
      width="1024"
    />
  {/await}
  <p class="tile-title">{storyName}</p>
</a>
