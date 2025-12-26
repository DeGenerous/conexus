<script lang="ts">
  import { mediaURL, blankImage } from '@constants/media';

  let { section }: { section: Section } = $props();

  // sectionImage is the name of the section but remove the spaces
  const imageName: string = section.name!.replace(/\s/g, '');

  const sectionImage: string = `${mediaURL}/conexus-sections/${imageName.toLocaleLowerCase()}.avif`;
</script>

<a
  class="menu-tile"
  class:big-menu-tile={section.name === 'Community Picks'}
  id={section.name}
  href="/s/{section.name}"
>
  <img
    src={sectionImage ?? blankImage}
    alt={section.name}
    width="1024"
    height="1024"
    draggable="false"
  />
  <h4>{section.name}</h4>
</a>
