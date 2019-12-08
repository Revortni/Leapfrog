class Game {
  constructor(width, height, parentElement) {
    this.parentElement = parentElement;
    this.context = this.parentElement.getContext('2d');
    this.world = new World(width, height, this.context);
  }

  init = () => {
    this.startGame();
  };

  update = () => {
    this.world.update();
  };

  render = () => {
    // this.setBackground();
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
