<script lang="ts">
  import { web3LoggedIn } from '@stores/account';

  export let section: Section;

  let isWeb3LoggedIn: boolean = false;

  web3LoggedIn.subscribe((value) => {
    isWeb3LoggedIn = value;
  });

  // sectionImage is the name of the section but remove the spaces
  const imageName: string = section.name.replace(/\s/g, '');

  const sectionImage: string = `https://media.degenerousdao.com/conexus-sections/${imageName.toLocaleLowerCase()}.avif`;

  const blankPicture: string = '/blank.avif'; // temp
</script>

<a class="menu-tile" id={section.name} href="/{section.name}">
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
