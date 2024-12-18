<script lang="ts">
  import type { DynSection } from '@lib/conexus';
  import { web3LoggedIn } from '@stores/account';

  import Modal from './Modal.svelte';
  import { showModal, showProfile } from '@stores/modal';

  export let section: DynSection;

  let isWeb3LoggedIn: boolean = false;

  web3LoggedIn.subscribe((value) => {
    isWeb3LoggedIn = value;
  });

  const handleClick = (event: MouseEvent, href: string) => {
    if (!isWeb3LoggedIn && section.name !== 'Community Picks') {
      event.preventDefault(); // Prevent the default navigation
      $showModal = true; // Show the dialog
    } else {
      // Allow navigation to proceed
      window.location.href = href;
    }
  };

  // sectionImage is the name of the section but remove the spaces
  const imageName: string = section.name.replace(/\s/g, '');

  const sectionImage: string = `https://media.degenerousdao.com/conexus-sections/${imageName.toLocaleLowerCase()}.avif`;

  const blankPicture: string = '/blank.avif'; // temp
</script>

<a
  class="tile"
  id={section.name}
  href="/{section.name}"
  on:click={(event) => handleClick(event, `/${section.name}`)}
>
  <img
    class="tile-picture"
    src={sectionImage ?? blankPicture}
    alt={section.name}
    draggable="false"
  />
  <p class="title">{section.name}</p>
</a>

<Modal
  secondButton="Connect wallet"
  handleSecondButton={() => {
    $showModal = false;
    $showProfile = true;
  }}
>
  <h2>Connect your wallet to access this section.</h2>
</Modal>

<style>
  .tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 28vw;
    background-color: rgba(22, 30, 95, 0.75);
    color: rgba(51, 226, 230, 0.75);
    border: 0.1vw solid rgba(51, 226, 230, 0.5);
    border-radius: 2.5vw;
    filter: drop-shadow(0 0 0.1vw #010020);
    cursor: pointer;
    text-decoration: none;
  }

  .tile:hover,
  .tile:active {
    background-color: rgba(51, 226, 230, 0.3);
    color: #010020;
    filter: drop-shadow(0 0 0.5vw #33e2e6);
    transform: scale(1.01);
  }

  .tile-picture {
    object-fit: cover;
    width: 95%;
    height: 80%;
    margin: 2.5%;
    margin-bottom: 0;
    border: 0.1vw solid rgba(51, 226, 230, 0.5);
    border-radius: 2vw;
    background-color: black;
    cursor: pointer;
  }

  .title {
    font-size: 2vw;
    line-height: 3vw;
    padding-block: 1vw;
    white-space: nowrap;
    text-shadow: 0 0 1vw #010020;
    cursor: pointer;
  }

  @media only screen and (max-width: 600px) {
    .tile {
      width: 85vw;
      border-radius: 1em;
    }

    .tile-picture {
      width: 95%;
      aspect-ratio: 3/2;
      border-radius: 0.5em;
    }

    .title {
      font-size: 1.25em;
      line-height: 2.25em;
      padding-block: 0.25em;
    }
  }
</style>
