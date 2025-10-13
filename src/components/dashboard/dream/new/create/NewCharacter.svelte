<script lang="ts">
  const createEmptyCharacter = (): Character => ({
    name: '',
    description: '',
    psychology: '',
    physicality: '',
  });

  let {
    character = $bindable(createEmptyCharacter()),
  }: { character: Character } = $props();

  const updateCharacter = (field: keyof Character, value: string) => {
    character = {
      ...character,
      [field]: value,
    };
  };
</script>

<div class="input-container">
  <label for="name">Name</label>
  <input
    class="dream-input character-name"
    placeholder="Enter character's name"
    value={character.name}
    oninput={(event) => updateCharacter('name', event.currentTarget.value)}
  />
</div>

<div class="input-container">
  <label for="description">Description</label>
  <textarea
    class="dream-input"
    placeholder="Provide an overview of the character’s role, background, or significance in the story. E.g. A fearless space explorer searching for a lost civilization, torn between duty and personal ambition."
    rows="3"
    value={character.description}
    oninput={(event) =>
      updateCharacter('description', event.currentTarget.value)}
  ></textarea>
</div>

<div class="input-container">
  <label for="physicality">Physicality</label>
  <textarea
    class="dream-input"
    placeholder="Describe the character’s whole appearance in detail - face, body, hair, eyes, skin tone, vibe… Be specific with color, shape, and style. E.g. A medium-height teenage boy with wavy, messy dark brown hair, blue eyes, and light olive skin, usually wearing a hoodie and ripped jeans, soft facial features with a slightly tired but thoughtful expression."
    rows="3"
    value={character.physicality ?? ''}
    oninput={(event) =>
      updateCharacter('physicality', event.currentTarget.value)}
  ></textarea>
</div>

<div class="input-container">
  <label for="psychology">Psychology</label>
  <textarea
    class="dream-input"
    placeholder="Explore the character’s personality, motivations, and inner struggles. E.g. A brilliant but skeptical scientist who hides their emotions behind logic, driven by an obsession to prove the existence of extraterrestrial life."
    rows="3"
    value={character.psychology ?? ''}
    oninput={(event) =>
      updateCharacter('psychology', event.currentTarget.value)}
  ></textarea>
</div>
