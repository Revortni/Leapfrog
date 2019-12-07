const HIGHSCOREKEY = '@highscore';
class Game {
  constructor(width, height, parentElement) {
    this.width = width;
    this.height = height;
    this.parentElement = parentElement;
    this.context = this.parentElement.getContext('2d');
    this.player = null;
  }

  init = () => {
    this.player = this.createPlayer(this.width, this.height, this.context);
    this.startGame();
  };

  createPlayer = () => {
    let player = new Player(this.context, this.height, this.width);
    player.draw();
    return player;
  };

  update = () => {
    this.player.update();
  };

  render = () => {
    this.player.draw();
  };

  startGame = () => {
    setInterval(() => {
      this.context.clearRect(0, 0, this.width, this.height);
      this.update();
      this.render();
    }, 50);
  };
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
