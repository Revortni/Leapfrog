let SCALE = 2;
let IMAGESIZE = { x: 3584, y: 720 };
let SCREEN = { width: 280, height: 224 };
let canvas = document.getElementById('app');
let ctx = canvas.getContext('2d');
let assetCount = 0;
let loaded = 0;
const gameAssets = {
  enemy1L: { src: './assets/enemy1L.png', w: 19, h: 33, frameCount: 6 },
  enemy1R: { src: './assets/enemy1R.png', w: 19, h: 33, frameCount: 6 },
  player1: { src: './assets/player1.png' }
};

const playerFrames = Object.keys(gameAssets).forEach(key => {
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
