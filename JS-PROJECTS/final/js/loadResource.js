let assetCount = 0;
let loaded = 0;
const gameAssets = {
  enemy1L: {
    src: './assets/enemy1L.png',
    w: 19,
    h: 33,
    frameCount: 6
  },
  soldier: {
    src: './assets/soldier.png',
    w: 19,
    h: 33,
    frameCount: 6
  },
  player1: { src: './assets/p1.png', w: 24, h: 45 },
  player2: { src: './assets/p1.png', w: 24, h: 45 },
  life1: {
    src: './assets/ExtraLifeBlue.png',
    w: 8,
    h: 16
  },
  life2: {
    src: './assets/ExtraLifeRed.png',
    w: 8,
    h: 16
  },
  sniper: { src: './assets/SniperDL.png', w: 16, h: 31 },
  sbsniper: { src: './assets/SandbagSniperL.png', w: 32, h: 17 },
  mechgun: { src: './assets/mechGun.png', w: 32, h: 48 },
  lastsniper: { src: './assets/lastShooter.png', w: 16, h: 31 },
  boss: { src: './assets/boss1.png', w: 262, h: 90 },
  bullet: { src: './assets/bullet1.png' },
  bulletE: { src: './assets/bulletE.png' },
  mgbullet: { src: './assets/mgbullet.png' },
  upgrade0: {
    src: './assets/powerups/MachineGun.png',
    w: 24,
    h: 16,
    upgrade: { reload: 8, size: 3 },
    type: 'upgrade'
  },
  upgrade1: {
    src: './assets/powerups/MegaShell.png',
    w: 24,
    h: 15,
    type: 'destroy'
  },
  upgrade2: {
    src: './assets/powerups/SpreadGun.png',
    w: 24,
    h: 15
  },
  enemyExplode: {
    src: './assets/explode.png',
    w: 32,
    h: 32,
    r: 16
  },
  capsule: { src: './assets/powerups/FlyingCapsule.png' }
};
