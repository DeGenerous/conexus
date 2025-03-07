const dreamData = {
  tense: ['past', 'present', 'future'],
  style: ['descriptive', 'narrative', 'expository'],
  voice: ['active', 'passive'],
  tone: [
    'Optimistic',
    'Pessimistic',
    'Sarcastic',
    'Assertive',
    'Aggressive',
    'Passionate',
    'Entertaining',
    'Serious',
    'Educational',
    'Persuasive',
    'Motivating',
    'Curious',
    'Humoristic',
    'Surreal'
  ],
  relationship: ['friends', 'neutral', 'enemies'],
  min_max: ['min', 'standard', 'max'],
  capitalize: (input) => input.charAt(0).toUpperCase() + input.slice(1),
}

export default dreamData;