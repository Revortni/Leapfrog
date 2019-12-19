const DATA = {
  //[x,y,width,height,function]
  ground1: [
    [-200, 56, 748, 56, 0],
    [548, 24, 77, 24, 0],
    [625, 56, 190, 56, 0],
    [815, 56, 1070, 182, 1],
    [1080, 182, 260, 182, 0],
    [1330, 185, 1554, 296, 1],
    [1564, 296, 280, 296, 0],
    [1844, 296, 2094, 424, 1],
    [2104, 424, 238, 424, 0],
    [2342, 390, 76, 390, 0],
    [2418, 424, 198, 424, 0],
    [2612, 424, 2830, 536, 1],
    [2840, 536, 298, 536, 0],
    [3138, 504, 76, 504, 0],
    [3216, 536, 366, 536, 0]
  ]
};

const getRandom = (min, max) => {
  return Math.random() * (max - min) + min;
};

const ENEMYCLASS = {
  1: x => new Soldier(x),
  2: x => new Sniper(x),
  3: x => new SBSniper(x),
  4: x => new MechGun(x),
  5: x => new LastShooter(x)
};

//spawn Positions
const SPAWNPOS = [
  {
    pos: 200,
    enemy: [],
    soldierPos: 1
  },
  {
    pos: 300,
    enemy: [
      {
        id: 2,
        x: 432,
        y: 165
      }
    ],
    soldierPos: 1
  },
  {
    pos: 525,
    enemy: [
      {
        id: 2,
        x: 608,
        y: 150
      },
      {
        id: 2,
        x: 688,
        y: 166
      },
      {
        id: 2,
        x: 864,
        y: 198
      }
    ],
    soldierPos: 1
  },
  {
    pos: 1150,
    enemy: [
      {
        id: 3,
        x: 1286,
        y: 200 //
      }
    ],
    soldierPos: {
      x: 1196,
      y: 312
    }
  },
  {
    pos: 1600,
    enemy: [
      {
        id: 2,
        x: 1634,
        y: 422
      }
    ],
    soldierPos: {
      x: 1678,
      y: 422
    }
  },
  {
    pos: 2040,
    enemy: [
      {
        id: 2,
        x: 2260,
        y: 550
      }
    ],
    soldierPos: {
      x: 1678,
      y: 424
    }
  },
  {
    pos: 2040,
    enemy: [
      {
        id: 2,
        x: 2170,
        y: 550
      }
    ],
    soldierPos: {
      x: 2220,
      y: 550
    }
  },
  {
    pos: 2280,
    enemy: [
      {
        id: 2,
        x: 2388,
        y: 550
      }
    ],
    soldierPos: {
      x: 2474,
      y: 550
    }
  },
  {
    pos: 2280,
    enemy: [
      {
        id: 2,
        x: 2430,
        y: 550
      },
      {
        id: 4,
        x: 2434,
        y: 462
      },
      {
        id: 2,
        x: 2512,
        y: 550
      },
      {
        id: 4,
        x: 2560,
        y: 466
      }
    ],
    soldierPos: {
      x: 2478,
      y: 554
    }
  },
  {
    pos: 2900,
    enemy: [
      {
        id: 4,
        x: 3040,
        y: 576
      }
    ],
    soldierPos: {
      x: 2956,
      y: 664
    }
  },
  {
    pos: 3082,
    enemy: [
      {
        id: 5,
        x: 3158,
        y: 535
      }
    ],
    soldierPos: 0
  }
];

const ANIMATE = {
  right: {
    offset: 2,
    frames: 4,
    pos: 2
  },
  up: {
    offset: 12,
    frames: 2,
    pos: 1
  },
  down: {
    offset: 0,
    frames: 1,
    pos: 3,
    w: 32
  },
  jump: {
    offset: 0,
    frames: 4,
    pos: 5
  },
  upRight: {
    offset: 2,
    frames: 5,
    pos: 4
  },
  standing: {
    offset: 0,
    frames: 1,
    pos: 0
  },
  dead: {
    frames: 1,
    pos: 6,
    offset: 0,
    w: 32
  },
  shoot: {
    offset: 0,
    frames: 2,
    pos: 0
  }
};

const HIGHSCOREKEY = '@highscoreContra';
