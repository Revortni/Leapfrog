(() => {
  let canvas = document.getElementById('app');
  canvas.width = 500;
  canvas.height = 500;

  new Game(500, 500, canvas).init();
})();
