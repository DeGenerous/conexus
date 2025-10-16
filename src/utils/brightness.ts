// Determine if the provided color string is light enough for dark text overlays
// @see https://gist.github.com/krabs-github/ec56e4f1c12cddf86ae9c551aa9d9e04
function isColorLight(color: any): boolean {
  let r: number;
  let g: number;
  let b: number;

  // Check the format of the color, HEX or RGB?
  if (color.match(/^rgb/)) {
    // If HEX --> store the red, green, blue values in separate variables
    color = color.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/,
    );

    r = color[1];
    g = color[2];
    b = color[3];
  } else {
    // If RGB --> Convert it to HEX: http://gist.github.com/983661
    color = +('0x' + color.slice(1).replace(color.length < 5 && /./g, '$&$&'));

    r = Number(color) >> 16;
    g = (Number(color) >> 8) & 255;
    b = Number(color) & 255;
  }

  // HSP equation from http://alienryderflex.com/hsp.html
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  // Using the HSP value, determine whether the color is light or dark
  if (hsp > 127.5) {
    return true;
  } else {
    return false;
  }
}

export default isColorLight;
