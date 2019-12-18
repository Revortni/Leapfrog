let SCALE = 2;
let IMAGESIZE = { x: 3584, y: 720 };
let SCREEN = { width: 280, height: 224 };

let mainScreen = document.getElementById('container');
mainScreen.style.width = SCREEN.width;
mainScreen.style.height = SCREEN.height;

let canvas = document.getElementById('app');
let ctx = canvas.getContext('2d');

canvas.width = SCREEN.width * SCALE;
canvas.height = SCREEN.height * SCALE;

Object.keys(gameAssets).forEach(key => {
  assetCount++;
  let img = new Image();
  img.src = gameAssets[key].src;
  img.onload = () => {
    gameAssets[key].img = img;
    loaded++;
    if (loaded == assetCount) {
      gameAssets.upgrade0.upgrade.image = gameAssets.mgbullet.img;
      new Game().init();
    }
  };
});
