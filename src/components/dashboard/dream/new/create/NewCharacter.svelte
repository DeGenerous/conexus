<script lang="ts">
  let {
    character = $bindable({
      name: '',
      description: '',
      psychology: '',
      physicality: '',
    }),
  }: {
    character: Character;
  } = $props();
</script>

<div class="input-container">
  <label for="name">Name</label>
  <input
    class="dream-input character-name"
    placeholder="Enter character's name"
    bind:value={character.name}
  />
</div>

<div class="input-container">
  <label for="description">Description</label>
  <textarea
    class="dream-input"
    placeholder="Provide an overview of the character’s role, background, or significance in the story. E.g. A fearless space explorer searching for a lost civilization, torn between duty and personal ambition."
    rows="3"
    bind:value={character.description}
  ></textarea>
</div>

<div class="input-container">
  <label for="physicality">Physicality</label>
  <textarea
    class="dream-input"
    placeholder="Describe the character’s whole appearance in detail - face, body, hair, eyes, skin tone, vibe… Be specific with color, shape, and style. E.g. A medium-height teenage boy with wavy, messy dark brown hair, blue eyes, and light olive skin, usually wearing a hoodie and ripped jeans, soft facial features with a slightly tired but thoughtful expression."
    rows="3"
    bind:value={character.physicality}
  ></textarea>
</div>

<div class="input-container">
  <label for="psychology">Psychology</label>
  <textarea
    class="dream-input"
    placeholder="Explore the character’s personality, motivations, and inner struggles. E.g. A brilliant but skeptical scientist who hides their emotions behind logic, driven by an obsession to prove the existence of extraterrestrial life."
    rows="3"
    bind:value={character.psychology}
  ></textarea>
</div>
