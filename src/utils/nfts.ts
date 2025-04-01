export const getPotentialClassName = (range: number[]): string => {
  let className = range[0] + ' - ' + range[1];

  switch (range[1]) {
    case 10: {
      if (range[0] == 1) className = 'NeYon';
      break;
    }
    case 208: {
      if (range[0] == 11) className = 'Oracle';
      break;
    }
    case 406: {
      if (range[0] == 209) className = 'Assassin';
      break;
    }
    case 604: {
      if (range[0] == 407) className = 'Engineer';
      break;
    }
    case 802: {
      if (range[0] == 605) className = 'Spy';
      break;
    }
    case 1000: {
      if (range[0] == 803) className = 'Soldier';
      break;
    }
  }

  return className;
}

export const getPotentialIDsRange = (className: string): number[] => {
  let range;

  switch (className) {
    case 'NeYon': {
      range = [1, 10];
      break;
    }
    case 'Oracle': {
      range = [11, 208];
      break;
    }
    case 'Assassin': {
      range = [209, 406];
      break;
    }
    case 'Engineer': {
      range = [407, 604];
      break;
    }
    case 'Spy': {
      range = [605, 802];
      break;
    }
    case 'Soldier': {
      range = [803, 1000];
      break;
    }
  }

  return range;
}