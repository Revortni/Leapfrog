let IMAGESIZE = { x: 3584 * 4, y: 720 * 4 };
let canvas = document.getElementById('app');
canvas.width = 1000;
canvas.height = 896;
let ctx = document.getContext('2d');
(() => {
  new Game(1000, 896).init();
})();
