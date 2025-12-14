export interface TTSProvider {
  /**
   * Generate TTS audio for the given text.
   * @param game The game data containing the text to convert to speech.
   * @returns A Promise that resolves to a Blob containing the audio data.
   */
  generateTTS(game: GameData): Promise<Blob>;

  /**
   * Stream TTS audio for the given text.
   * @param game The game data containing the text to convert to speech.
   * @returns A Promise that resolves to a ReadableStream of audio data.
   */
  streamTTS?(game: GameData): Promise<ReadableStream<Uint8Array>>;
}

export function constructTextFromGame(game: GameData): string {
  let text = game.story;

  if (game.ended) {
    text += "\nHere's your tale in a nutshell:\n";
    text += game.summary + '\n';
    text += 'CoNexus identified your trait as: ' + game.trait + '.\n';
  } else {
    text += '\nHere are your options:\n';
    game.options.forEach((choice, index) => {
      text += `${index + 1}. ${choice}\n`;
    });
  }

  return text;
}
