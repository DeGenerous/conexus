<script lang="ts">
  import { mediaURL } from '@constants/media';

  let { section }: { section: Section } = $props();

  // sectionImage is the name of the section but remove the spaces
  const imageName: string = section.name.replace(/\s/g, '');

  const sectionImage: string = `${mediaURL}/conexus-sections/${imageName.toLocaleLowerCase()}.avif`;

  const blankPicture: string = '/blank.avif'; // temp
</script>

<a class="menu-tile" id={section.name} href="/sections/{section.name}">
  <img
    src={sectionImage ?? blankPicture}
    alt={section.name}
    width="1024"
    height="1024"
    draggable="false"
  />
  <h4>{section.name}</h4>
</a>
