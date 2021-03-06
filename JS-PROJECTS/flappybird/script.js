const HIGHSCOREKEY = '@highscore';
class Game {
  constructor(width, height, parentElement, flag) {
    this.width = width;
    this.height = height;
    this.parentElement = parentElement;
    this.gameWindow = null;
    this.foregroundPosition = -width;
    this.gameOver = false;
    this.clock = 0;
    this.pipes = [];
    this.minGapBetweenPipe = 150;
    this.score = 0;
    this.highScore = 0;
    this.gameOverScreen = null;
    this.screenHeight = this.height + 100;
    this.scoreBoard = null;
    this.controlFlag = flag;
  }

  init = () => {
    this.gameWindow = this.createGameWindow();
    this.player = this.createPlayer();
    this.foreground = this.createForeground();
    this.scoreBoard = this.createScoreBoard();
    this.showScoreBoard();
    this.fetchHighScore();
    this.createStartScreen();
  };

  createScoreBoard = () => {
    let board = document.createElement('div');
    board.classList.add('score');
    this.gameWindow.appendChild(board);

    return board;
  };

  showScoreBoard = () => {
    this.scoreBoard.innerHTML = this.score;
  };

  createStartScreen = () => {
    let screen = document.createElement('div');
    let buttonWrapper = document.createElement('div');
    let startButton = document.createElement('div');
    let info = document.createElement('div');
    let infoText = this.controlFlag ? 'Click' : 'SpaceBar';
    info.innerHTML = 'Control: ' + infoText;
    screen.style.width = '100%';
    screen.style.height = this.screenHeight + 'px';
    this.splashScreen = screen;

    screen.classList.add('splashScreen');
    info.classList.add('info');
    buttonWrapper.classList.add('buttonWrapper');
    startButton.classList.add('startButton');
    startButton.onclick = () => {
      this.startScreenSlider();
    };
    buttonWrapper.appendChild(startButton);
    screen.appendChild(buttonWrapper);
    screen.appendChild(info);
    this.gameWindow.appendChild(this.splashScreen);
  };

  startScreenSlider = () => {
    let shift = 1;
    let startInterval = setInterval(() => {
      shift += shift;
      this.splashScreen.style.top = -shift + 'px';
      if (shift >= this.height) {
        this.gameWindow.removeChild(this.splashScreen);
        clearInterval(startInterval);
        this.startGame();
      }
    }, 50);
  };

  createGameOverScreen = () => {
    let screen = document.createElement('div');
    let text = document.createElement('div');
    let restart = document.createElement('div');
    let highScore = document.createElement('div');
    highScore.classList.add('scoreText');
    let yourScore = highScore.cloneNode();
    text.innerHTML = 'gameOver';
    highScore.innerHTML = 'High Score: ' + this.highScore;
    yourScore.innerHTML = 'Your Score: ' + this.score;
    screen.classList.add('gameOver');
    text.classList.add('gameOverText');
    restart.classList.add('restart');
    restart.onclick = this.resetGame.bind(this);
    screen.appendChild(text);
    screen.appendChild(restart);
    screen.appendChild(highScore);
    screen.appendChild(yourScore);
    this.gameOverScreen = screen;
    this.gameWindow.appendChild(screen);
  };

  resetGame = () => {
    this.score = 0;
    this.clock = 0;
    this.gameOver = false;
    this.showScoreBoard();
    this.gameWindow.removeChild(this.gameOverScreen);
    this.pipes.forEach(pipe => {
      pipe.element.remove();
    });
    this.pipes = [];
    this.player.reset();
    this.createStartScreen();
  };

  fetchHighScore = () => {
    if (localStorage.getItem(HIGHSCOREKEY + this.controlFlag) == null) {
      this.highScore = 0;
    } else {
      this.highScore = localStorage.getItem(HIGHSCOREKEY + this.controlFlag);
    }
  };

  createGameWindow = () => {
    let gameWindow = document.createElement('div');
    gameWindow.style.height = this.screenHeight + 'px';
    gameWindow.style.width = this.width + 'px';
    gameWindow.classList.add('gameWindow');
    this.parentElement.appendChild(gameWindow);

    return gameWindow;
  };

  createPlayer = () => {
    let player = new Player(
      this.gameWindow,
      this.height,
      this.width,
      this.controlFlag
    ).init();
    player.draw();

    return player;
  };

  createForeground = () => {
    let foreground = document.createElement('div');
    foreground.classList.add('foreground');
    foreground.style.right = -this.width + 'px';
    foreground.style.height = '100px';
    foreground.style.width = '200%';
    foreground.style.bottom = 0;
    foreground.style.backgroundSize = 'auto 100px';
    this.gameWindow.appendChild(foreground);

    return foreground;
  };

  createPipe = () => {
    /*create a pipe on the  top half of screen */
    let topHeight = Math.floor(getRandomArbitrary(1, 5)) * 100;
    let topPipe = new Pipe(this.gameWindow, this.width, 0, topHeight).init();
    topPipe.element.style.background =
      'url("./assets/pipe-north.png") no-repeat';
    topPipe.element.style.transform = 'rotate(180deg)';
    topPipe.element.style.backgroundSize = 'cover';
    this.pipes.push(topPipe);

    /*create a pipe on the  bottom half of screen */
    let bottom = topHeight + this.minGapBetweenPipe;
    let bottomHeight = this.height - topHeight - this.minGapBetweenPipe;
    let bottomPipe = new Pipe(
      this.gameWindow,
      this.width,
      bottom,
      bottomHeight
    ).init();
    bottomPipe.element.style.background =
      'url("./assets/pipe-north.png") no-repeat';
    bottomPipe.element.style.backgroundSize = 'cover';
    this.pipes.push(bottomPipe);
  };

  /*Move the pipes to the left and check if pipe passed player */
  movePipes = () => {
    this.pipes.forEach((pipe, i) => {
      pipe.move(2);
      if (pipe.x + pipe.width < 0) {
        pipe.element.remove();
      }
      let playerCenter = this.player.x + this.player.width;

      /* check if player crossed the pipe,and increase score after passing a pipe pair(top & bottom) */
      if (pipe.x + pipe.width < playerCenter && !pipe.cleared && i % 2) {
        this.score++;
        pipe.cleared = true;
      }
    });
    this.pipes = this.pipes.filter(pipe => !(pipe.x + pipe.width < 0));
  };

  moveForeground = () => {
    this.foregroundPosition += 2;
    if (this.foregroundPosition >= 0) {
      this.foregroundPosition = -this.width;
    }
    this.foreground.style.right = this.foregroundPosition + 'px';
  };

  update = () => {
    this.player.move();
    this.movePipes();
    let collision = this.player.checkCollision(this.pipes);
    if (this.player.y + this.player.height > this.height || collision) {
      this.gameOver = true;
      this.player.alive = false;
    }
  };

  render = () => {
    this.player.draw();
    this.showScoreBoard();
    this.moveForeground();
  };

  dropBird = () => {
    let die = setInterval(() => {
      this.player.move();
      this.player.draw();
      if (this.player.y + this.player.width / 2 > this.player.maxHeight) {
        clearInterval(die);
        this.createGameOverScreen();
      }
    }, 10);
  };

  startGame = () => {
    this.interval = setInterval(() => {
      if (!(this.clock % 180)) {
        this.clock = 1;
        this.createPipe();
      }
      this.update();
      this.render();
      if (this.gameOver) {
        if (this.score > this.highScore) {
          this.highScore = this.score;
          localStorage.setItem(HIGHSCOREKEY + this.controlFlag, this.score);
        }
        clearInterval(this.interval);
        this.dropBird();
      }
      this.clock++;
    }, 20);
  };
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

(function() {
  const parent = document.getElementById('app');
  new Game(600, 600, parent, 0).init();
  const parent1 = document.getElementById('app1');
  new Game(600, 600, parent1, 1).init();
})();
