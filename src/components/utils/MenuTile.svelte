<script lang="ts">
  import tippy, { type Instance } from 'tippy.js';

  import { mediaURL } from '@constants/media';
  import { highlightCommunityPicks } from '@stores/navigation.svelte';

  let { section }: { section: Section } = $props();

  // sectionImage is the name of the section but remove the spaces
  const imageName: string = section.name.replace(/\s/g, '');

  const sectionImage: string = `${mediaURL}/conexus-sections/${imageName.toLocaleLowerCase()}.avif`;

  const blankPicture: string = '/blank.avif'; // temp

  $effect(() => {
    if (section.name === 'Community Picks' && $highlightCommunityPicks) {
      const instance = tippy(
        document.querySelector('.highlighted-menu-tile')!,
        {
          content: 'Check out 100+ stories from 18 different genres',
          trigger: 'manual',
          hideOnClick: false,
        },
      );
      instance.show();
    }
  });
</script>

<a
  class="menu-tile"
  class:big-menu-tile={section.name === 'Community Picks'}
  class:highlighted-menu-tile={section.name === 'Community Picks' &&
    $highlightCommunityPicks}
  id={section.name}
  href="/s/{section.name}"
>
  <img
    src={sectionImage ?? blankPicture}
    alt={section.name}
    width="1024"
    height="1024"
    draggable="false"
  />
  <h4>{section.name}</h4>
</a>
