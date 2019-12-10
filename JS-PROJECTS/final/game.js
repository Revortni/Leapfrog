class Game {
  constructor() {
    this.level = 1;
    this.world = null;
  }

  init = () => {
    this.world = new World(this.level);
    document.addEventListener('keydown', controller.keyListener);
    document.addEventListener('keyup', controller.keyListener);
    let mainBackground = new Image();
    mainBackground.src = './assets/area' + this.level + '_Labeled.png';
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

  startGame = () => {
    setInterval(() => {
      this.update();
      this.render();
      this.clock++;
    }, 50);
  };
}
