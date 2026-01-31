import type { MyPerformance } from './MyPerformances';

export const YEAR = 2025;
export const ATTENDANCE = [
  {
    month: 'Jan',
    attendance: 4
  },
  {
    month: 'Feb',
    attendance: 6
  },
  {
    month: 'Mar',
    attendance: 8
  },
  {
    month: 'Apr',
    attendance: 24
  },
  {
    month: 'May',
    attendance: 0
  },
  {
    month: 'Jun',
    attendance: 10
  },
  {
    month: 'Jul',
    attendance: 12
  },
  {
    month: 'Aug',
    attendance: 14
  },
  {
    month: 'Sep',
    attendance: 16
  },
  {
    month: 'Oct',
    attendance: 18
  },
  {
    month: 'Nov',
    attendance: 20
  },
  {
    month: 'Dec',
    attendance: 22
  }
];
export const ME = {
  image: 'https://images.start.gg/images/user/2858645/image-0a3ba57f70bfa4c26980f4bd9c49fc01.png',
  prefix: 'PNS',
  gamerTag: 'RouxChov',
  country: 'France',
  pronouns: 'He/Him',
  socialMedias: {
    x: 'le_grld'
  }
};
export const PERFORMANCES: MyPerformance[] = [
  {
    finalPlacement: 1,
    initialSeed: 12,
    tournament: {
      name: 'Berbougnoultimate #1',
      image:
        'https://images.start.gg/images/tournament/731650/image-f33f78f1c1555a17d2e97ae8c641aa99.png',
      date: 'Jan 25',
      location: 'Toulouse',
      attendees: 64
    }
  },
  {
    finalPlacement: 64,
    initialSeed: 256,
    tournament: {
      name: 'KanD.I. - Janvier 2026',
      image:
        'https://images.start.gg/images/tournament/861709/image-88fa22c3e812ae16302fb35a9e0d56de.png',
      date: 'Jan 24',
      location: 'Toulouse',
      attendees: 256
    }
  },
  {
    finalPlacement: 3,
    initialSeed: 1,
    tournament: {
      name: 'BloomBagarre - 12 décembre',
      image:
        'https://images.start.gg/images/tournament/859086/image-34c6c5eb0485b9a3be33c7a980a761dc.png',
      date: '12 décembre',
      location: 'Toulouse',
      attendees: 32
    }
  },
  {
    finalPlacement: 9999,
    initialSeed: 64,
    tournament: {
      name: '篝火#14/KAGARIBI#14 篝火#14/KAGARIBI#14',
      image:
        'https://images.start.gg/images/tournament/844950/image-ff2cbed605a056c96cf759925a6f0928.jpg',
      date: 'Nov 2 - Nov 3',
      location: 'Tokyo',
      attendees: 317
    }
  },
  {
    finalPlacement: 800,
    initialSeed: 8,
    tournament: {
      name: 'Session privée chez Célian',
      image:
        'https://images.start.gg/images/user/2858645/image-0a3ba57f70bfa4c26980f4bd9c49fc01.png',
      date: 'Dec 14',
      location: 'QG',
      attendees: 8
    }
  }
];

export const FAVOURITE_CHARACTERS = [
  { name: 'Marth', count: 120, image: '/images/chara_1/marth.webp' },
  { name: 'Fox', count: 95, image: '/images/chara_1/fox.webp' },
  { name: 'Falco', count: 80, image: '/images/chara_1/falco.webp' }
];

export const END_CARD = {
  image: 'https://images.start.gg/images/user/2858645/image-0a3ba57f70bfa4c26980f4bd9c49fc01.png',
  prefix: 'PNS',
  gamerTag: 'RouxChov',
  country: 'France',
  pronouns: 'He/Him',
  socialMedias: {
    x: 'le_grld'
  }
};

export const HIGHEST_UPSET = {
  tournament: {
    name: 'KanDI',
    date: 'Jan 23',
    image:
      'https://images.start.gg/images/tournament/861709/image-88fa22c3e812ae16302fb35a9e0d56de.png'
  },
  opponent: {
    gamerTag: 'Glutonny',
    prefix: 'Solary',
    avatar:
      'https://images.start.gg/images/user/2613/image-abf07000a58994aef3b2172241f27951.jpg?ehk=d%2F3Rws%2BCTuWtXMLI0SV7Dmkw4%2FYSQNWoWPJD9uGNbF8%3D&ehkOptimized=WYVpqvxLkf3v09B0%2B1uCcNQFyX2kQCFz0svZDCX2sMA%3D'
  },
  match: {
    score: '3-2',
    factor: 12,
    round: 'Losers Quarter-Final'
  }
};

export const GAME_5_STATS = {
  totalSets: 20,
  wins: 15,
  winRate: 78.92
};

export const CLEAN_SWEEP_STATS = {
  totalSweeps: 12,
  totalSets: 150
};

export const GAUNTLET_STATS = {
  encountered: [
    'Fox',
    'Falco',
    'Marth',
    'Sheik',
    'Jigglypuff',
    'Captain Falcon',
    'Peach',
    'Ice Climbers',
    'Pikachu',
    'Samus',
    'Yoshi',
    'Luigi',
    'Dr. Mario',
    'Ganondorf',
    'Mario',
    'Donkey Kong',
    'Link',
    'Young Link',
    'Ness',
    'Mewtwo',
    'Roy',
    'Mr. Game & Watch',
    'Bowser',
    'Kirby',
    'Zelda',
    'Pichu',
    'Steve',
    'Kazuya',
    'Sora',
    'Joker',
    'Cloud',
    'Sephiroth',
    'Pyra & Mythra'
  ]
};

export const DQ_STATS = {
  totalDQs: 3
};

export const WORST_MATCHUPS = [
  {
    characterName: 'Steve',
    image: '/images/chara_1/steve.webp',
    count: 10,
    lossCount: 8,
    looseRate: 80.0
  },
  {
    characterName: 'Kazuya',
    image: '/images/chara_1/kazuya.webp',
    count: 8,
    lossCount: 6,
    looseRate: 75.0
  },
  {
    characterName: 'Sonic',
    image: '/images/chara_1/sonic.webp',
    count: 7,
    lossCount: 5,
    looseRate: 71.4
  }
];

export const DAY_OF_WEEK_STATS = {
  activity: [
    { day: 'Mon', count: 5 },
    { day: 'Tue', count: 8 },
    { day: 'Wed', count: 3 },
    { day: 'Thu', count: 12 },
    { day: 'Fri', count: 20 },
    { day: 'Sat', count: 45 },
    { day: 'Sun', count: 30 }
  ]
};

export const BUSTER_RUN_STATS = {
  finalPlacement: 257,
  initialSeed: 32,
  spr: -5,
  tournament: {
    name: 'BloomBagarre',
    date: 'Jan 30',
    image:
      'https://images.start.gg/images/tournament/867940/image-3a856b491f9df7c5d583d98188caa4ba.png',
    location: 'Toulouse, France',
    attendees: 3000
  }
};

export const RIVALRY_STATS = {
  rival: {
    gamerTag: 'Sparg0',
    wins: 5,
    losses: 2,
    image: 'https://images.start.gg/images/user/94369/image-6586d2783cd1fe8a1ed41c181517ad98.jpg'
  },
  nemesis: {
    gamerTag: 'Glutonny',
    wins: 0,
    losses: 4,
    image: 'https://images.start.gg/images/user/2613/image-abf07000a58994aef3b2172241f27951.jpg'
  }
};

export const GAME_STATS = {
  won: 240,
  lost: 160,
  winRate: 60.0
};

export const TOTAL_SETS_MOCK = 200;
