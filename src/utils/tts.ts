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
