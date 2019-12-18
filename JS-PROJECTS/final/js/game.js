class Game {
  constructor() {
    this.level = 1;
    this.world = null;
    this.interval = null;
  }

  init = () => {
    this.world = new World(this.level);
    document.addEventListener('keydown', controller.keyListener);
    document.addEventListener('keyup', controller.keyListener);

    let mainBackground = new Image();
    mainBackground.src = './assets/area' + this.level + '_bg.png';
    mainBackground.onload = () => {
      this.world.init(mainBackground);
      this.startGame();
    };
  };

  update = () => {
    this.world.update();
  };

  render = () => {
    this.world.render();
  };

  handleGameOver = () => {
    console.log('gameOver');
    clearInterval(this.interval);
  };

  startGame = () => {
    this.interval = setInterval(() => {
      this.update();
      this.render();
      if (this.world.gameOver) {
        this.handleGameOver();
      }
      this.clock++;
    }, 50);
  };
}
