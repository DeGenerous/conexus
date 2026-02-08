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
    placeholder="e.g. &quot;Detective Mara Cole&quot;"
    value={character.name}
    oninput={(event) => updateCharacter('name', event.currentTarget.value)}
  />
</div>

<div class="input-container">
  <label for="description">Description</label>
  <textarea
    class="dream-input"
    placeholder="e.g. &quot;A burned-out space marine turned smuggler, haunted by a mission gone wrong&quot;"
    rows="3"
    value={character.description}
    oninput={(event) =>
      updateCharacter('description', event.currentTarget.value)}
  ></textarea>
  <p class="transparent-white-txt caption-font">
    Who is this character and what role do they play in the story?
  </p>
</div>

<div class="input-container">
  <label for="physicality">Physicality</label>
  <textarea
    class="dream-input"
    placeholder="e.g. &quot;Tall, lean build. Short silver hair, dark brown eyes. Always wears a worn leather jacket.&quot;"
    rows="3"
    value={character.physicality ?? ''}
    oninput={(event) =>
      updateCharacter('physicality', event.currentTarget.value)}
  ></textarea>
  <p class="transparent-white-txt caption-font">
    What does this character look like? Details here shape visual synthesis.
  </p>
</div>

<div class="input-container">
  <label for="psychology">Psychology</label>
  <textarea
    class="dream-input"
    placeholder="e.g. &quot;Outwardly cold and logical, but secretly terrified of being alone&quot;"
    rows="3"
    value={character.psychology ?? ''}
    oninput={(event) =>
      updateCharacter('psychology', event.currentTarget.value)}
  ></textarea>
  <p class="transparent-white-txt caption-font">
    What drives them? What are their strengths, flaws, and inner conflicts?
  </p>
</div>
