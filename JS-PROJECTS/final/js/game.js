class Game {
  constructor() {
    this.level = 1;
    this.world = null;
    this.interval = null;
    this.startInterval = null;
    this.highScore = 0;
    this.pointer = 0;
  }

  init = () => {
    this.world = new World(this.level);
    document.addEventListener('keydown', controller.keyListener);
    document.addEventListener('keyup', controller.keyListener);
    this.fetchHighScore();
    this.startInterval = setInterval(() => {
      this.showMainMenu();
      this.checkKeyPress();
    }, 50);
  };

  checkKeyPress = () => {
    if (controller.right) {
      this.pointer = 1;
    }
    if (controller.left) {
      this.pointer = 0;
    }
    if (controller.select) {
      clearInterval(this.startInterval);
      this.start();
    }
  };

  showMainMenu = () => {
    let image = gameAssets.loadScreen.img;
    let button = gameAssets.button;
    ctx.clearRect(0, 0, SCREEN.width * SCALE, SCREEN.height * SCALE);
    ctx.drawImage(image, 0, 0, SCREEN.width * SCALE, SCREEN.height * SCALE);
    ctx.drawImage(
      button.img,
      (40 + this.pointer * 105) * SCALE,
      157 * SCALE,
      button.r * SCALE,
      button.r * SCALE
    );
  };

  start = () => {
    let mainBackground = new Image();
    mainBackground.src = './assets/area' + this.level + '_bg.png';
    mainBackground.onload = () => {
      this.world.init(mainBackground, this.pointer);
      themeSound.play();
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
      this.highScore = localStorage.getItem(HIGHSCOREKEY) || 0;
    }
  };

  handleScore = () => {
    let score = this.world.player.score;
    if (this.world.pcount) {
      score = Math.max(score, this.world.player2.score);
    }
    if (score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem(HIGHSCOREKEY, score);
    }
  };

  get7Digit = score => {
    let x = 7 - score.toString().length;
    let res = '';
    while (x > 0) {
      res += '0';
      x--;
    }
    return res + score;
  };

  showScore = () => {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, SCREEN.width * SCALE, SCREEN.height * SCALE);
    ctx.fillStyle = '#fff';
    ctx.font = '16px "Press Start 2P", cursive';
    ctx.textAlign = 'center';
    ctx.fillText('HI SCORE', ctx.canvas.width / 2, 50);
    ctx.fillText(this.get7Digit(this.highScore), ctx.canvas.width / 2, 100);
    ctx.fillText('1P SCORE', ctx.canvas.width * 0.25, 200);
    ctx.fillText(
      this.get7Digit(this.world.player.score),
      ctx.canvas.width * 0.25,
      250
    );
    ctx.fillText('2P SCORE', ctx.canvas.width * 0.75, 200);
    let player2Score = this.world.player2 ? this.world.player2.score : 0;
    ctx.fillText(this.get7Digit(player2Score), ctx.canvas.width * 0.75, 250);

    let endText = this.world.defeatedBoss ? 'well done' : 'Game over';
    ctx.fillText(endText.toUpperCase(), ctx.canvas.width * 0.5, 300);
  };

  handleGameOver = () => {
    themeSound.stop();
    clearInterval(this.interval);
    this.handleScore();
    this.showScore();
  };

  startGame = () => {
    this.interval = setInterval(() => {
      this.update();
      this.render();
      if (this.world.gameOver || this.world.end) {
        setTimeout(() => {
          this.handleGameOver();
        }, 3000);
      }
      this.clock++;
    }, 50);
  };
}
