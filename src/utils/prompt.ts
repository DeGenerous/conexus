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
): TopicRequest {
  let imagePrompt: string = `Use ${settings.image_style} style.\n\n`;

  imagePrompt += props.image_prompt;

  // ADDING CHARACTERS TO THE IMAGE PROMPT
  if (typeof data !== 'string') {
    imagePrompt += '\n';

    imagePrompt += `Main Character: name: ${data.main_character.name}, description: ${data.main_character.description}`;

    if (data.main_character.physicality)
      imagePrompt += `, physicality: ${data.main_character.physicality}`;

    if (data.main_character.psychology)
      imagePrompt += `, psychology: ${data.main_character.psychology}`;

    imagePrompt += '\n';

    if (data.side_characters.length > 0) {
      imagePrompt += 'Side Characters:\n';
      data.side_characters.map((character: Character) => {
        imagePrompt += `name: ${character.name}, description: ${character.description}`;

        if (character.physicality)
          imagePrompt += `, physicality: ${character.physicality}`;

        if (character.physicality)
          imagePrompt += `, psychology: ${character.psychology}`;

        imagePrompt += '\n';
      });
    }
  }

  const setUpPrompt = () => {
    if (typeof data === 'string') {
      return data;
    }

    let promptData = '';

    if (data.premise) promptData += `Premise: ${data.premise}\n`;

    if (data.environment) promptData += `Environment: ${data.environment}\n`;

    if (data.exposition) promptData += `Exposition: ${data.exposition}\n`;

    if (data.first_action) promptData += `First Act: ${data.first_action}\n`;

    // CHARACTERS
    promptData += '\n';
    promptData += 'The following characters are involved in the story:\n';

    promptData += `Main Character: name: ${data.main_character.name}, description: ${data.main_character.description}`;

    if (data.main_character.physicality)
      promptData += `, physicality: ${data.main_character.physicality}`;

    if (data.main_character.psychology)
      promptData += `, psychology: ${data.main_character.psychology}`;

    promptData += '\n';

    if (data.side_characters.length > 0) {
      promptData += 'Side Characters:\n';
      data.side_characters.map((character: Character) => {
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
    if (data.winning_scenarios.length > 0) {
      promptData += '\n';
      promptData += 'Incorportate the following winning scenarios:\n';
      data.winning_scenarios.map((scenario: string, index: number) => {
        promptData += `${index + 1}) ${scenario}\n`;
      });
    }

    if (data.losing_scenarios.length > 0) {
      promptData += '\n';
      promptData += 'Incorportate the following losing scenarios:\n';
      data.losing_scenarios.map((scenario: string, index: number) => {
        promptData += `${index + 1}) ${scenario}\n`;
      });
    }

    if (data.key_events.length > 0) {
      promptData += '\n';
      promptData += 'Incorportate the following key events:\n';
      data.key_events.map((event: string, index: number) => {
        promptData += `${index + 1}) ${event}\n`;
      });
    }

    // WRITING STYLE
    if (data.pov) {
      promptData += '\n';
      promptData += `Tell the story from the point of view of: ${data.pov}\n`;
    }

    promptData += '\n';
    switch (data.story_arcs) {
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

    promptData += `Writing Style:\n- Tense: ${data.tense};\n- Style: ${data.writing_style};\n- Voice: ${data.voice}.\n`;

    promptData += 'Tone:\n';
    data.tone.map(({ name, value }) => {
      if (value !== 'none') promptData += `- ${name}: ${value};\n`;
    });

    if (data.additional_data)
      promptData += `\nAlso consider:\n${data.additional_data}`;

    return promptData;
  };

  const storyPrompt = setUpPrompt();

  // const fullStory: CreatePrompt = {
  //   topic: props.name.trim(),
  //   description: props.description,
  //   image_prompt: imagePrompt,
  //   category: props.category_id,
  //   prompt: storySettings + storyPrompt,
  // };
  const fullStory: TopicRequest = {
    name: props.name.trim(),
    description: props.description,
    category_id: props.category_id,
    available: true,
    visibility: 'public',
    prompt: storyPrompt,
    image_prompt: imagePrompt,
    settings: settings,
  };

  return fullStory;
}

export default generatePrompt;
