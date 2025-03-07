<script>
  export let character = {
    name: '',
    description: '',
    psychology: '',
    physicality: '',
  };
</script>

<div class="input-container">
  <label for="name">Name</label>
  <input
    class="story-input character-name"
    placeholder="Enter character's name"
    bind:value={character.name}
  />
</div>

<div class="input-container">
  <label for="description">Description</label>
  <textarea
    class="story-input"
    placeholder="Provide an overview of the character’s role, background, or significance in the story. E.g. A fearless space explorer searching for a lost civilization, torn between duty and personal ambition."
    rows="3"
    bind:value={character.description}
  ></textarea>
</div>

<div class="input-container">
  <label for="physicality">Physicality</label>
  <textarea
    class="story-input"
    placeholder="Describe the character’s appearance, including distinguishing features, clothing, or any unique traits. E.g. Tall and broad-shouldered with piercing emerald eyes, dressed in a weathered leather jacket and carrying an old relic from the past."
    rows="3"
    bind:value={character.description}
  ></textarea>
</div>

<div class="input-container">
  <label for="psychology">Psychology</label>
  <textarea
    class="story-input"
    placeholder="Explore the character’s personality, motivations, and inner struggles. E.g. A brilliant but skeptical scientist who hides their emotions behind logic, driven by an obsession to prove the existence of extraterrestrial life."
    rows="3"
    bind:value={character.description}
  ></textarea>
</div>

<style>
  textarea {
    width: 80vw;
    min-height: 20vh;
    max-height: 100vh;
  }

  .character-name {
    text-align: center;
  }

  @media only screen and (max-width: 600px) {
    textarea {
      width: 90vw;
    }
  }
</style>