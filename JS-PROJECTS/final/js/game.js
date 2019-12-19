class Game {
  constructor() {
    this.level = 1;
    this.world = null;
    this.interval = null;
    this.highScore = 0;
  }

  init = () => {
    this.world = new World(this.level);
    document.addEventListener('keydown', controller.keyListener);
    document.addEventListener('keyup', controller.keyListener);
    this.fetchHighScore();
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

  fetchHighScore = () => {
    if (localStorage.getItem(HIGHSCOREKEY) == null) {
      this.highScore = 0;
    } else {
      this.highScore = localStorage.getItem(HIGHSCOREKEY);
    }
  };

  handleScore = () => {
    let score = this.world.player.score;
    if (score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem(HIGHSCOREKEY, score);
    }
  };

  handleGameOver = () => {
    console.log('gameOver');
    clearInterval(this.interval);
    this.handleScore();
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
