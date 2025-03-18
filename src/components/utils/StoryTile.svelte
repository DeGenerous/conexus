<script lang="ts">
  import MediaManager from '@lib/media';

  export let section: string;
  export let topicID: number;
  export let topicName: string;

  const media: MediaManager = new MediaManager();

  const storyName: string = (
    topicName.charAt(0).toUpperCase() + topicName.slice(1)
  ).trim();

  const blankPicture = '/blank.avif';
</script>

<a class="tile" href="/{section}/{topicName}?id={topicID}">
  {#await media.fetchStoryImage(topicID, 'tile')}
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
      src={storyImage}
      alt={storyName}
      draggable="false"
      height="1024"
      width="1024"
    />
  {/await}
  <p class="tile-title">{storyName}</p>
</a>
