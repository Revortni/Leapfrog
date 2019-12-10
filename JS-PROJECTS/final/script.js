let SCALE = 3;
let IMAGESIZE = { x: 3584 * SCALE, y: 720 * SCALE };
let SCREEN = { width: 280 * SCALE, height: 224 * SCALE };
let canvas = document.getElementById('app');
let ctx = canvas.getContext('2d');
const playerValues = {
  dx: 8,
  dy: 40 * 2,
  gravity: 3,
  frictionY: 0.9,
  frictionX: 0.5,
  width: 23 * SCALE,
  height: 34 * SCALE,
  crouchWidth: 32 * SCALE,
  crouchHeight: 16 * SCALE,
  jumpSize: 18 * SCALE,
  reloadTime: 8
};

const worldValues = {
  '1': {
    mid: 56,
    bot: 24
  }
};
canvas.width = SCREEN.width;
canvas.height = SCREEN.height;

(() => {
  new Game().init();
})();
