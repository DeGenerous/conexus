<script lang="ts">
  import type { DynSection } from '@lib/conexus';
  import { web3LoggedIn } from '@stores/account';

  import Modal from './Modal.svelte';

  export let section: DynSection;

  let isWeb3LoggedIn: boolean = false;
  let showDialog = false;

  web3LoggedIn.subscribe((value) => {
    isWeb3LoggedIn = value;
  });

  const handleClick = (event: MouseEvent, href: string) => {
    if (!isWeb3LoggedIn && section.name !== 'Community Picks') {
      event.preventDefault(); // Prevent the default navigation
      showDialog = true; // Show the dialog
    } else {
      // Allow navigation to proceed
      window.location.href = href;
    }
  };

  let isPrimary: boolean = true;
  function tileHover() {
    isPrimary = !isPrimary;
  }

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
  on:mouseenter={tileHover}
  on:mouseleave={tileHover}
  on:touchstart={tileHover}
  on:touchend={tileHover}
>
  <img
    class="tile-picture {isPrimary ? 'visible' : ''}"
    src={sectionImage ?? blankPicture}
    alt={section.name}
    draggable="false"
  />
  <img
    class="tile-picture {!isPrimary ? 'visible' : ''}"
    src={sectionImage ?? blankPicture}
    alt={section.name}
    draggable="false"
  />
  <p class="title">{section.name}</p>
</a>

{#if showDialog}
  <Modal bind:showModal={showDialog}>
    <div class="modal-content">
      <p>Connect your wallet to access this section.</p>
      <button class="close-modal" on:click={() => (showDialog = false)}
        >Close</button
      >
    </div>
  </Modal>
{/if}

<style>
  .tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 28vw;
    margin: 1vw;
    background-color: rgba(22, 30, 95, 0.75);
    color: rgba(51, 226, 230, 0.75);
    border: 0.05vw solid rgba(51, 226, 230, 0.75);
    border-radius: 1.5vw;
    filter: drop-shadow(0 0 0.1vw #010020);
    cursor: pointer;
    text-decoration: none;
    transition: all 0.15s ease-in-out;
  }

  .tile:hover,
  .tile:active {
    background-color: rgba(51, 226, 230, 0.3);
    color: #010020;
    filter: drop-shadow(0 0 0.5vw #33e2e6);
    transform: scale(1.01);
  }

  .tile-picture {
    display: none;
    object-fit: cover;
    width: 95%;
    height: 80%;
    margin: 2.5%;
    margin-bottom: 0;
    border: 0.05vw solid rgba(51, 226, 230, 0.75);
    border-radius: 1vw;
    background-color: black;
  }

  .visible {
    display: block;
  }

  .title {
    font-size: 2.3vw;
    line-height: 3vw;
    padding-block: 1vw;
    white-space: nowrap;
    text-shadow: 0 0 1vw #010020;
  }

  @media only screen and (max-width: 600px) {
    .tile {
      width: 80vw;
      flex: none;
      margin-bottom: 3vw;
      border-radius: 5vw;
    }

    .tile-picture {
      width: 95%;
      aspect-ratio: 3/2;
      border-radius: 4vw;
    }

    .title {
      font-size: 1.3em;
      line-height: 2em;
      padding-block: 0.25em;
    }
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 80%;
    margin-inline: 10%;
    margin-block: 10%;
    padding-inline: 2vw;
    border: 0.05vw solid rgba(51, 226, 230, 0.75);
    border-radius: 2vw;
    font-size: 2.5vw;
    line-height: 4vw;
    color: rgba(51, 226, 230, 0.75);
    background-color: rgba(51, 226, 230, 0.1);
    filter: drop-shadow(0 0 0.1vw rgba(51, 226, 230, 0.4));
  }

  .close-modal {
    width: 70%;
    margin-inline: 15%;
    margin-block: 1vw;
    padding-inline: 2vw;
    border: 0.05vw solid rgba(51, 226, 230, 0.75);
    border-radius: 2vw;
    font-size: 2.5vw;
    line-height: 4vw;
    color: rgba(51, 226, 230, 0.75);
    background-color: rgba(51, 226, 230, 0.1);
    filter: drop-shadow(0 0 0.1vw rgba(51, 226, 230, 0.4));
  }

  .close-modal:hover,
  .close-modal:active {
    color: rgba(51, 226, 230, 1);
    background-color: rgba(51, 226, 230, 0.5);
    filter: drop-shadow(0 0 1vw rgba(51, 226, 230, 0.4));
  }
</style>
