<script lang="ts">
  import { mediaURL } from '@constants/media';
  import { web3LoggedIn } from '@stores/account';

  export let section: Section;

  let isWeb3LoggedIn: boolean = false;

  web3LoggedIn.subscribe((value) => {
    isWeb3LoggedIn = value;
  });

  // sectionImage is the name of the section but remove the spaces
  const imageName: string = section.name.replace(/\s/g, '');

  const sectionImage: string = `${mediaURL}/conexus-sections/${imageName.toLocaleLowerCase()}.avif`;

  const blankPicture: string = '/blank.avif'; // temp
</script>

<a class="menu-tile" id={section.name} href="/sections/{section.name}">
  <img
    class="menu-tile-picture"
    src={sectionImage ?? blankPicture}
    alt={section.name}
    width="1024"
    height="1024"
    draggable="false"
  />
  <p class="menu-tile-title">{section.name}</p>
</a>
