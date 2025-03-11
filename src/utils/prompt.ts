/**
 * Generates a prompt for a story based on provided story data, settings, and additional data.
 *
 * @param props - The story data including name, description, and image prompts.
 * @param settings - The settings for the prompt including language, image style, interactivity, difficulty, and length.
 * @param data - Additional data for the prompt which can be a string or an object containing premise, environment, exposition, first action, characters, relationships, scenarios, POV, story arcs, pacing, writing style, and tone.
 *
 * @returns The generated prompt object containing topic, description, image prompt, category, and the full prompt text.
 */
function generatePrompt(
  props: StoryData,
  settings: PromptSettings,
  data: TablePrompt | string,
): CreatePrompt {
  let imagePrompt: string = '';
  if (props.imagePrompts.length > 1) {
    imagePrompt += 'Image prompts:\n';
    props.imagePrompts.map((prompt) => {
      imagePrompt += `- ${prompt}\n`;
    });
  } else imagePrompt = props.imagePrompts[0];

  const setUpSettings = () => {
    let promptSettings: string =
      'Note: Consider the following characteristics for the story, follow these strictly especially the premise.\n\n';

    promptSettings += `You will only write in ${settings.language}.\n`;

    promptSettings += `Use ${settings.imageStyle} style.\n\n`;

    if (settings.interactivity !== 'standard')
      promptSettings +=
        'Adjust the interactivity of the story based on the following:\n';
    switch (settings.interactivity) {
      case 'min': {
        promptSettings +=
          'Make sure user gets to make a decision between options for every little decision.\n\n';
        break;
      }
      case 'max': {
        promptSettings +=
          'Steps will have more text and events, so user gets options only for key decisions.\n\n';
        break;
      }
    }

    if (settings.difficulty !== 'min')
      promptSettings +=
        'Adjust the story based on the following difficulty level: \n';
    switch (settings.difficulty) {
      case 'standard': {
        promptSettings +=
          'It should be difficult for the user to succeed in the story.\n\n';
        break;
      }
      case 'max': {
        promptSettings +=
          'It should be extremely difficult for the user to succeed in the story. They will likely fail every single time.\n\n';
        break;
      }
    }

    promptSettings += 'Adjust the story based on the following: \n';
    switch (settings.length) {
      case 'min': {
        promptSettings +=
          'The story should last maximum 20 steps, usually ending after 15, and each step should have 2 to 3 sentences. You will focus more on character development, interactions, etc making sure the user gets immersed as the main character, and key events should happen rarely. The story should have two arcs or acts if the user makes decisions to last long enough.\n\n';
        break;
      }
      case 'standard': {
        promptSettings +=
          'You will use standard pacing, making sure you focus on both character development and actionable events. The story should have three arcs or acts if the user makes decisions to last long enough.\n\n';
        break;
      }
      case 'max': {
        promptSettings +=
          'The story should have many steps, and 10 sentences per step. You will use quick pacing to the story, going for more action and making sure large events happen faster. The story should have five to eight arcs or acts if the user makes decisions to last enough.\n\n';
        break;
      }
    }

    return promptSettings;
  };

  const setUpPrompt = () => {
    if (typeof data === 'string') {
      return data;
    }

    let promptData = '';

    if (data.premise) promptData += `Premise: ${data.premise}\n`;

    if (data.environment) promptData += `Environment: ${data.environment}\n`;

    if (data.exposition) promptData += `Exposition: ${data.exposition}\n`;

    if (data.firstAction) promptData += `First Act: ${data.firstAction}\n`;

    // CHARACTERS
    promptData += '\n';
    promptData += 'The following characters are involved in the story:\n';

    promptData += `Main Character: name: ${data.mainCharacter.name}, description: ${data.mainCharacter.description}`;

    if (data.mainCharacter.physicality)
      promptData += `, physicality: ${data.mainCharacter.physicality}`;

    if (data.mainCharacter.physicality)
      promptData += `, psychology: ${data.mainCharacter.psychology}`;

    promptData += '\n';

    if (data.sideCharacters.length > 0) {
      promptData += 'Side Characters:\n';
      data.sideCharacters.map((character: Character) => {
        promptData += `name: ${character.name}, description: ${character.description}`;

        if (character.physicality)
          promptData += `, physicality: ${character.physicality}`;

        if (character.physicality)
          promptData += `, psychology: ${character.psychology}`;

        promptData += '\n';
      });
    }

    if (data.relationships.length > 0) {
      promptData +=
        'Consider the following relationships between the characters:\n';
      data.relationships.map((relations: Relationship) => {
        promptData += `${relations.connection[0]} is ${relations.type} with ${relations.connection[1]}.`;
        if (relations.details)
          promptData += `Relationship details: ${relations.details}\n`;
        else promptData += '\n';
      });
    }

    // SCENARIOS
    if (data.winningScenarios.length > 0) {
      promptData += '\n';
      promptData += 'Incorportate the following winning scenarios:\n';
      data.winningScenarios.map((scenario: string, index: number) => {
        promptData += `${index + 1}) ${scenario}\n`;
      });
    }

    if (data.losingScenarios.length > 0) {
      promptData += '\n';
      promptData += 'Incorportate the following losing scenarios:\n';
      data.losingScenarios.map((scenario: string, index: number) => {
        promptData += `${index + 1}) ${scenario}\n`;
      });
    }

    if (data.keyEvents.length > 0) {
      promptData += '\n';
      promptData += 'Incorportate the following key events:\n';
      data.keyEvents.map((event: string, index: number) => {
        promptData += `${index + 1}) ${event}\n`;
      });
    }

    // WRITING STYLE
    if (data.POV) {
      promptData += '\n';
      promptData += `Tell the story from the point of view of: ${data.POV}\n`;
    }

    promptData += '\n';
    switch (data.storyArcs) {
      case 'min': {
        promptData +=
          'The story should have two arcs or acts if the user makes decisions to last long enough.\n';
        break;
      }
      case 'standard': {
        promptData +=
          'The story should have three arcs or acts if the user makes decisions to last long enough.\n';
        break;
      }
      case 'max': {
        promptData +=
          'The story should have five to eight arcs or acts if the user makes decisions to last enough.\n';
        break;
      }
    }

    promptData += '\n';
    switch (data.pacing) {
      case 'min': {
        promptData +=
          'You will focus more on character development, interactions, etc making sure the user gets immersed as the main character, and key events should happen rarely.\n';
        break;
      }
      case 'standard': {
        promptData +=
          'You will use standard pacing, making sure you focus on both character development and actionable events.\n';
        break;
      }
      case 'max': {
        promptData +=
          'You will use quick pacing to the story, going for more action and making sure large events happen faster.\n';
        break;
      }
    }

    promptData += '\n';
    promptData +=
      'The following writing style and tone are to be considered:\n';

    promptData += `Writing Style:\n- Tense: ${data.tense};\n- Style: ${data.writingStyle};\n- Voice: ${data.voice}.\n`;

    promptData += 'Tone:\n';
    data.tone.map(({ name, value }) => {
      if (value !== 'none') promptData += `- ${name}: ${value};\n`;
    });

    return promptData;
  };

  const storySettings = setUpSettings();
  const storyPrompt = setUpPrompt();

  const fullStory: CreatePrompt = {
    topic: props.name,
    description: props.description,
    image_prompt: imagePrompt,
    category: 1,
    prompt: storySettings + storyPrompt,
  };

  console.log(storySettings + storyPrompt);

  return fullStory;
}

export default generatePrompt;
