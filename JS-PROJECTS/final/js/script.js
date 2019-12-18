let SCALE = 2;
let IMAGESIZE = { x: 3584, y: 720 };
let SCREEN = { width: 280, height: 224 };
let canvas = document.getElementById('app');
let ctx = canvas.getContext('2d');
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
  player1: { src: './assets/player1.png' },
  life1: {
    src: './assets/ExtraLifeBlue.png',
    w: 8,
    h: 16
  },
  sniper: { src: './assets/SniperDL.png', w: 16, h: 31 },
  sbsniper: { src: './assets/SandbagSniperL.png', w: 32, h: 17 },
  mechgun: { src: './assets/mechGun.png', w: 32, h: 48 },
  lastsniper: { src: './assets/lastShooter.png', w: 16, h: 31 },
  boss: { src: './assets/boss1.png', w: 262, h: 90 },
  bullet: { src: './assets/bullet1.png' },
  enemyExplode: {
    src: './assets/explode.png',
    w: 32,
    h: 32,
    r: 16
  }
};

const playerFrames = null;
Object.keys(gameAssets).forEach(key => {
  assetCount++;
  let img = new Image();
  img.src = gameAssets[key].src;
  img.onload = () => {
    gameAssets[key].img = img;
    loaded++;
    if (loaded == assetCount) {
      new Game().init();
    }
  };
});

canvas.width = SCREEN.width * SCALE;
canvas.height = SCREEN.height * SCALE;
