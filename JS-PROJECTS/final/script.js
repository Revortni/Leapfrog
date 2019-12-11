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
  crouchHeight: 16,
  jumpSize: 18,
  reloadTime: 8
};

const worldValues = {
  '1': {
    mid: 56,
    bot: 24
  }
};
canvas.width = SCREEN.width * SCALE;
canvas.height = SCREEN.height * SCALE;

(() => {
  new Game().init();
})();
