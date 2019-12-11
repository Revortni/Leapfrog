let SCALE = 3;
let IMAGESIZE = { x: 3584, y: 720 };
let SCREEN = { width: 280, height: 224 };
let canvas = document.getElementById('app');
let ctx = canvas.getContext('2d');
const playerValues = {
  dx: 2,
  dy: 40,
  gravity: 3,
  frictionY: 0.9,
  frictionX: 0.5,
  width: 23,
  height: 34,
  crouchWidth: 32,
  crouchHeight: 15,
  jumpSize: 18,
  reloadTime: 5,
  jumpDist: 24
};

let assetCount = 0;
let loaded = 0;
const gameAssets = {
  enemy1L: { src: './assets/enemy1L.png', w: 19, h: 33, frameCount: 6 },
  player1: { src: './assets/player1.png', w: 19, h: 33, frameCount: 6 }
};

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
