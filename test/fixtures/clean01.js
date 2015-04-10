var sailorMoonCharacters = [
    {
		'name': ['Tsukino', 'Usagi'],
		'identity': 'Sailor Moon'
	}, {
        'name': ['Hino', 'Rei'],
        'identity': 'Sailor Mars'
    }, {
        'name': ['Mizuno', 'Ami'],
        'identity': 'Sailor Mercury'
    }, {
        'name': ['Kino', 'Makoto'],
        'identity': 'Sailor Jupiter'
    }, {
        'name': ['Aino', 'Minako'],
        'identity': 'Sailor Venus'
    }
];

function getNameFromIdentity(identity) {
  var name = '';

  for (var x = 0; x < sailorMoonCharacters.length; x++) {
    var character = sailorMoonCharacters[x];

    if (character.identity === identity) {
      name = character.name.join(' ');
    }
  }

  return name;
}

function initialize() {
  getNameFromIdentity('Sailor Moon');
}


initialize();
