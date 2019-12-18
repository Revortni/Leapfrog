const ENEMYCLASS = {
  1: x => new Soldier(x),
  2: x => new Sniper(x),
  3: x => new SBSniper(x),
  4: x => new MechGun(x),
  5: x => new LastShooter(x)
};

const SPAWNPOS = [
  {
    pos: 250,
    enemy: [
      {
        id: 2,
        x: 432,
        y: 165
      }
    ],
    soldierPos: null
  },
  {
    pos: 1250,
    enemy: [
      {
        id: 2,
        x: 608,
        y: 570
      },
      {
        id: 2,
        x: 688,
        y: 554
      },
      {
        id: 2,
        x: 864,
        y: 522
      }
    ],
    soldierPos: null
  },
  {
    pos: 1250,
    enemy: [
      {
        id: 2,
        x: 1286,
        y: 200 //
      }
    ],
    soldierPos: {
      x: 1196,
      y: 408
    }
  },
  {
    pos: 1552,
    enemy: [
      {
        id: 2,
        x: 1634,
        y: 298
      }
    ],
    soldierPos: {
      x: 1678,
      y: 296
    }
  },
  {
    pos: 2040,
    enemy: [
      {
        id: 2,
        x: 2220,
        y: 170
      }
    ],
    soldierPos: {
      x: 1678,
      y: 296
    }
  },
  {
    pos: 2040,
    enemy: [
      {
        id: 2,
        x: 2220,
        y: 170
      }
    ],
    soldierPos: {
      x: 2220,
      y: 170
    }
  },
  {
    pos: 2280,
    enemy: [
      {
        id: 2,
        x: 2430,
        y: 170
      }
    ],
    soldierPos: {
      x: 2474,
      y: 170
    }
  },
  {
    pos: 2280,
    enemy: [
      {
        id: 2,
        x: 2430,
        y: 170
      },
      {
        id: 4,
        x: 2432,
        y: 170
      },
      {
        id: 2,
        x: 2512,
        y: 170
      },
      {
        id: 4,
        x: 2560,
        y: 254
      }
    ],
    soldierPos: {
      x: 2478,
      y: 170
    }
  },
  {
    pos: 2800,
    enemy: [
      {
        id: 4,
        x: 3040,
        y: 144
      }
    ],
    soldierPos: {
      x: 2956,
      y: 56
    }
  },
  {
    pos: 3082,
    enemy: [
      {
        id: 5,
        x: 3150,
        y: 185
      }
    ],
    soldierPos: null
  }
];
