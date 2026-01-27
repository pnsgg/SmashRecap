export type FighterInfo = {
  id: string;
  name: string;
  slug: string;
};

export const getFighterInfo = (name: string): FighterInfo => {
  switch (name) {
    case 'Mario':
      return { id: '1', name: name, slug: 'mario' };
    case 'Donkey Kong':
      return { id: '2', name: name, slug: 'donkey_kong' };
    case 'Link':
      return { id: '3', name: name, slug: 'link' };
    case 'Samus':
      return { id: '4', name: name, slug: 'samus' };
    case 'Dark Samus':
      return { id: '4e', name: name, slug: 'dark_samus' };
    case 'Yoshi':
      return { id: '5', name: name, slug: 'yoshi' };
    case 'Kirby':
      return { id: '6', name: name, slug: 'kirby' };
    case 'Fox':
      return { id: '7', name: name, slug: 'fox' };
    case 'Pikachu':
      return { id: '8', name: name, slug: 'pikachu' };
    case 'Luigi':
      return { id: '9', name: name, slug: 'luigi' };
    case 'Ness':
      return { id: '10', name: name, slug: 'ness' };
    case 'Captain Falcon':
      return { id: '11', name: name, slug: 'captain_falcon' };
    case 'Jigglypuff':
      return { id: '12', name: name, slug: 'jigglypuff' };
    case 'Peach':
      return { id: '13', name: name, slug: 'peach' };
    case 'Daisy':
      return { id: '13e', name: name, slug: 'daisy' };
    case 'Bowser':
      return { id: '14', name: name, slug: 'bowser' };
    case 'Ice Climbers':
      return { id: '15', name: name, slug: 'ice_climbers' };
    case 'Sheik':
      return { id: '16', name: name, slug: 'sheik' };
    case 'Zelda':
      return { id: '17', name: name, slug: 'zelda' };
    case 'Dr. Mario':
      return { id: '18', name: name, slug: 'dr_mario' };
    case 'Pichu':
      return { id: '19', name: name, slug: 'pichu' };
    case 'Falco':
      return { id: '20', name: name, slug: 'falco' };
    case 'Marth':
      return { id: '21', name: name, slug: 'marth' };
    case 'Lucina':
      return { id: '21e', name: name, slug: 'lucina' };
    case 'Young Link':
      return { id: '22', name: name, slug: 'young_link' };
    case 'Ganondorf':
      return { id: '23', name: name, slug: 'ganon' };
    case 'Mewtwo':
      return { id: '24', name: name, slug: 'mewtwo' };
    case 'Roy':
      return { id: '25', name: name, slug: 'roy' };
    case 'Chrom':
      return { id: '25e', name: name, slug: 'chrom' };
    case 'Mr. Game & Watch':
      return { id: '26', name: name, slug: 'mr_game_and_watch' };
    case 'Meta Knight':
      return { id: '27', name: name, slug: 'meta_knight' };
    case 'Pit':
      return { id: '28', name: name, slug: 'pit' };
    case 'Dark Pit':
      return { id: '28e', name: name, slug: 'dark_pit' };
    case 'Zero Suit Samus':
      return { id: '29', name: name, slug: 'zss' };
    case 'Wario':
      return { id: '30', name: name, slug: 'wario' };
    case 'Snake':
      return { id: '31', name: name, slug: 'snake' };
    case 'Ike':
      return { id: '32', name: name, slug: 'ike' };
    case 'Pokemon Trainer':
      return { id: '33', name: name, slug: 'pokemon_trainer' };
    case 'Diddy Kong':
      return { id: '36', name: name, slug: 'diddy' };
    case 'Lucas':
      return { id: '37', name: name, slug: 'lucas' };
    case 'Sonic':
      return { id: '38', name: name, slug: 'sonic' };
    case 'King Dedede':
      return { id: '39', name: name, slug: 'king_dedede' };
    case 'Olimar':
      return { id: '40', name: name, slug: 'olimar' };
    case 'Lucario':
      return { id: '41', name: name, slug: 'lucario' };
    case 'R.O.B.':
      return { id: '42', name: name, slug: 'rob' };
    case 'Toon Link':
      return { id: '43', name: name, slug: 'toon_link' };
    case 'Wolf':
      return { id: '44', name: name, slug: 'wolf' };
    case 'Villager':
      return { id: '45', name: name, slug: 'villager' };
    case 'Mega Man':
      return { id: '46', name: name, slug: 'megaman' };
    case 'Wii Fit Trainer':
      return { id: '47', name: name, slug: 'wii_fit' };
    case 'Rosalina':
      return { id: '48', name: name, slug: 'rosalina' };
    case 'Little Mac':
      return { id: '49', name: name, slug: 'little_mac' };
    case 'Greninja':
      return { id: '50', name: name, slug: 'greninja' };
    case 'Mii Brawler':
      return { id: '51', name: name, slug: 'mii_brawler' };
    case 'Mii Swordfighter':
      return { id: '52', name: name, slug: 'mii_swordman' };
    case 'Mii Gunner':
      return { id: '53', name: name, slug: 'mii_gunner' };
    case 'Palutena':
      return { id: '54', name: name, slug: 'palutena' };
    case 'Pac-Man':
      return { id: '55', name: name, slug: 'pacman' };
    case 'Robin':
      return { id: '56', name: name, slug: 'robin' };
    case 'Shulk':
      return { id: '57', name: name, slug: 'shulk' };
    case 'Bowser Jr.':
      return { id: '58', name: name, slug: 'bowser_jr' };
    case 'Duck Hunt':
      return { id: '59', name: name, slug: 'duckhunt' };
    case 'Ryu':
      return { id: '60', name: name, slug: 'ryu' };
    case 'Ken':
      return { id: '60e', name: name, slug: 'ken' };
    case 'Cloud':
      return { id: '61', name: name, slug: 'cloud' };
    case 'Corrin':
      return { id: '62', name: name, slug: 'corrin' };
    case 'Bayonetta':
      return { id: '63', name: name, slug: 'bayonetta' };
    case 'Inkling':
      return { id: '64', name: name, slug: 'inkling' };
    case 'Ridley':
      return { id: '65', name: name, slug: 'ridley' };
    case 'Simon Belmont':
      return { id: '66', name: name, slug: 'simon' };
    case 'Richter':
      return { id: '66e', name: name, slug: 'richter' };
    case 'King K. Rool':
      return { id: '67', name: name, slug: 'krool' };
    case 'Isabelle':
      return { id: '68', name: name, slug: 'isabelle' };
    case 'Incineroar':
      return { id: '69', name: name, slug: 'incineroar' };
    case 'Piranha Plant':
      return { id: '70', name: name, slug: 'piranha_plant' };
    case 'Joker':
      return { id: '71', name: name, slug: 'joker' };
    case 'Hero':
      return { id: '72', name: name, slug: 'hero' };
    case 'Banjo-Kazooie':
      return { id: '73', name: name, slug: 'banjo' };
    case 'Terry':
      return { id: '74', name: name, slug: 'terry' };
    case 'Byleth':
      return { id: '75', name: name, slug: 'byleth' };
    case 'Min Min':
      return { id: '76', name: name, slug: 'minmin' };
    case 'Steve':
      return { id: '77', name: name, slug: 'steve' };
    case 'Sephiroth':
      return { id: '78', name: name, slug: 'sephiroth' };
    case 'Pyra & Mythra':
      return { id: '79', name: name, slug: 'pyra_mythra' };
    case 'Kazuya':
      return { id: '81', name: name, slug: 'kazuya' };
    case 'Sora':
      return { id: '82', name: name, slug: 'sora' };
    case 'Random Character':
      return { id: '83', name: 'Random', slug: 'random' };
    default:
      throw new Error(`Unknown fighter name: ${name}`);
  }
};

export const ALL_FIGHTERS = [
  'Mario',
  'Donkey Kong',
  'Link',
  'Samus',
  'Dark Samus',
  'Yoshi',
  'Kirby',
  'Fox',
  'Pikachu',
  'Luigi',
  'Ness',
  'Captain Falcon',
  'Jigglypuff',
  'Peach',
  'Daisy',
  'Bowser',
  'Ice Climbers',
  'Sheik',
  'Zelda',
  'Dr. Mario',
  'Pichu',
  'Falco',
  'Marth',
  'Lucina',
  'Young Link',
  'Ganondorf',
  'Mewtwo',
  'Roy',
  'Chrom',
  'Mr. Game & Watch',
  'Meta Knight',
  'Pit',
  'Dark Pit',
  'Zero Suit Samus',
  'Wario',
  'Snake',
  'Ike',
  'Pokemon Trainer',
  'Diddy Kong',
  'Lucas',
  'Sonic',
  'King Dedede',
  'Olimar',
  'Lucario',
  'R.O.B.',
  'Toon Link',
  'Wolf',
  'Villager',
  'Mega Man',
  'Wii Fit Trainer',
  'Rosalina',
  'Little Mac',
  'Greninja',
  'Mii Brawler',
  'Mii Swordfighter',
  'Mii Gunner',
  'Palutena',
  'Pac-Man',
  'Robin',
  'Shulk',
  'Bowser Jr.',
  'Duck Hunt',
  'Ryu',
  'Ken',
  'Cloud',
  'Corrin',
  'Bayonetta',
  'Inkling',
  'Ridley',
  'Simon Belmont',
  'Richter',
  'King K. Rool',
  'Isabelle',
  'Incineroar',
  'Piranha Plant',
  'Joker',
  'Hero',
  'Banjo-Kazooie',
  'Terry',
  'Byleth',
  'Min Min',
  'Steve',
  'Sephiroth',
  'Pyra & Mythra',
  'Kazuya',
  'Sora',
  'Random Character'
];
