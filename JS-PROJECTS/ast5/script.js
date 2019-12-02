(function() {
  function Player(parentElement, windowWidth, windowHeight, speed) {
    this.x = 0;
    this.y = 10;
    this.turnSpeed = speed || 50;
    this.length = 100;
    this.width = 50;
    this.element = null;
    this.parentElement = parentElement;
    this.windowWidth = windowWidth;
    this.gameOver = false;

    var that = this;

    this.init = function() {
      var car = document.createElement('div');
      car.style.height = this.length + 'px';
      car.style.width = this.width + 'px';
      car.style.bottom = this.y + 'px';
      car.classList.add('player');
      this.x = this.windowWidth / 2 - this.width / 2;
      document.addEventListener('keypress', this.handleButtonClick.bind(this));
      this.element = car;
      this.parentElement.appendChild(car);
      this.draw();
      return this;
    };

    this.reset = function() {
      this.gameOver = false;
      this.x = this.windowWidth / 2 - this.width / 2;
      this.element.style.display = 'block';
      this.draw();
    };

    this.handleButtonClick = function(event) {
      if (event.code == 'KeyA') {
        this.moveLeft();
      }
      if (event.code == 'KeyD') {
        this.moveRight();
      }
    };

    this.draw = function() {
      this.element.style.left = this.x + 'px';
    };

    this.moveLeft = function() {
      if (this.x > this.turnSpeed) {
        this.x -= this.turnSpeed;
      }
    };

    this.moveRight = function() {
      if (this.x < this.windowWidth - this.width - this.turnSpeed) {
        this.x += this.turnSpeed;
      }
    };

    this.checkCollision = function(cars) {
      var left = this.x;
      var right = this.x + this.width;
      var top = this.y + this.length;
      var bottom = this.y;
      for (var i = 0; i < cars.length; i++) {
        if (bottom > windowHeight - cars[i].y) {
          continue;
        }
        if (
          left < cars[i].x + cars[i].width &&
          right > cars[i].x &&
          top > windowHeight - (cars[i].y + cars[i].length) &&
          bottom < windowHeight - cars[i].y
        ) {
          return i + 1;
        }
      }
      return null;
    };
  }

  function Car(parentElement, speed, laneWidth, lane) {
    this.x = 0;
    this.y = 0;
    this.length = 100;
    this.width = 50;
    this.speed = speed;
    this.lane = lane;
    this.parentElement = parentElement;
    this.element = null;

    this.init = function() {
      var car = document.createElement('div');
      car.style.height = this.length + 'px';
      car.style.width = this.width + 'px';
      this.x = laneWidth * lane - laneWidth / 2;
      this.y = -this.length * 2;
      car.style.left = this.x - this.width / 2 + 'px';
      car.classList.add('car');
      this.element = car;
      this.parentElement.appendChild(car);
      this.draw();
      return this;
    };

    this.draw = function() {
      this.element.style.top = this.y + 'px';
    };

    this.move = function() {
      this.y += this.speed;
    };
  }

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  function Game(parentElement) {
    var cars = [];
    var MAX_WIDTH = 300;
    var MAX_HEIGHT = 1000;
    var LANE_WIDTH = 100;
    var BASE_SPEED = 4;
    var laneCount = MAX_WIDTH / LANE_WIDTH;
    this.sliderPosition = -MAX_HEIGHT;
    this.parentElement = parentElement;
    this.gameWindow = null;
    this.roadSlider = null;
    this.player = null;
    this.clock = 0;
    this.roadStrip = null;
    this.interval = 0;
    this.score = 0;
    this.splashScreen = null;
    this.roadSpeed = BASE_SPEED;
    this.carSpeed = this.roadSpeed;
    this.obstacleGap = 0;
    this.gameOverScreen = null;
    minSpaceBetweenPlayerAndCar = 0;

    var that = this;

    this.init = function() {
      this.parentElement.classList.add('parent');
      this.gameWindow = document.createElement('div');
      this.gameWindow.classList.add('gameWindow');
      this.gameWindow.style.width = MAX_WIDTH + 'px';
      this.gameWindow.style.height = MAX_HEIGHT + 'px';
      this.parentElement.classList.add('clearfix');
      minSpaceBetweenPlayerAndCar = MAX_HEIGHT - 200;
      this.createRoad();
      this.createPlayer();
      this.parentElement.appendChild(this.gameWindow);
      this.createScoreBoard();
      this.createSplashScreen();
    };

    this.resetGame = function() {
      this.score = 0;
      this.updateScore();
      this.gameWindow.removeChild(this.collisionImage);
      this.parentElement.removeChild(this.gameOverScreen);
      minSpaceBetweenPlayerAndCar = MAX_HEIGHT - 200;
      cars.forEach(
        function(car) {
          this.gameWindow.removeChild(car.element);
        }.bind(this)
      );
      cars = [];
      this.roadSpeed = BASE_SPEED;
      this.carSpeed = this.roadSpeed;
      this.player.reset();
      this.createSplashScreen();
    };

    this.createSplashScreen = function() {
      var screen = document.createElement('div');
      var buttonWrapper = document.createElement('div');
      var startButton = document.createElement('div');
      screen.style.width = '100%';
      screen.style.height = MAX_HEIGHT + 'px';
      this.splashScreen = screen;
      startButton.innerHTML = 'start';
      screen.classList.add('splashScreen');
      buttonWrapper.classList.add('buttonWrapper');
      startButton.classList.add('startButton');
      startButton.onclick = function() {
        this.startScreenSlider();
      }.bind(this);
      buttonWrapper.appendChild(startButton);
      screen.appendChild(buttonWrapper);
      this.parentElement.appendChild(this.splashScreen);
    };

    this.createRoad = function() {
      var roadSlider = document.createElement('div');

      this.roadStrip = roadSlider.cloneNode();
      this.roadStrip.classList.add('roadStrip');
      this.roadStrip.style.width = MAX_WIDTH + 'px';
      this.roadSlider = roadSlider;

      roadSlider.classList.add('roadSlider');
      roadSlider.style.marginTop = this.sliderPosition + 'px';
      roadSlider.style.backgroundSize = MAX_WIDTH + 'px';
      roadSlider.classList.add('roadSlider');

      this.gameWindow.appendChild(roadSlider);
      this.gameWindow.appendChild(this.roadStrip);
    };

    this.createPlayer = function() {
      this.player = new Player(
        this.gameWindow,
        MAX_WIDTH,
        MAX_HEIGHT,
        LANE_WIDTH
      ).init();
      spaceBetweenPlayerAndTop = MAX_HEIGHT - this.player.y * 2;
    };

    this.createCar = function(lane) {
      var car = new Car(
        this.gameWindow,
        this.carSpeed,
        LANE_WIDTH,
        lane
      ).init();
      car.draw();
      cars.push(car);
    };

    this.createScoreBoard = function() {
      var board = document.createElement('span');
      board.classList.add('scoreBoard');
      this.scoreBoard = board;
      this.updateScore();
      this.parentElement.appendChild(board);
    };

    this.animateRoad = function() {
      this.sliderPosition += this.roadSpeed;
    };
    this.showRoad = function() {
      this.roadStrip.style.display = 'none';
      this.roadSlider.style.marginTop = this.sliderPosition + 'px';
      if (this.sliderPosition >= 0) {
        this.roadStrip.style.display = 'block';
        this.sliderPosition = -MAX_HEIGHT;
      }
    };

    this.createGameOverScreen = function() {
      var screen = document.createElement('div');
      var text = document.createElement('div');
      var clickToContinueText = document.createElement('div');
      text.innerHTML = 'gameOver';
      clickToContinueText.innerHTML = 'click screen to play again';
      screen.classList.add('gameOver');
      text.classList.add('gameOverText');
      clickToContinueText.classList.add('continueInfo');

      screen.onclick = this.resetGame.bind(this);
      screen.appendChild(text);
      screen.appendChild(clickToContinueText);

      this.gameOverScreen = screen;
      this.parentElement.appendChild(screen);
    };

    this.generateObstacles = function() {
      var position = Array(laneCount - 1)
        .fill(0)
        .map(function() {
          return Math.ceil(getRandomArbitrary(0, laneCount));
        });
      position = position.filter(function(x, i) {
        return position.indexOf(x) == i;
      });
      position.forEach(function(val) {
        that.createCar(val);
      });
    };

    this.updateScore = function() {
      this.scoreBoard.innerHTML = 'Score: ' + this.score;
    };

    this.moveCars = function() {
      var flag = 0;
      var indexes = [];
      this.obstacleGap += this.carSpeed;
      cars.forEach(
        function(car, index) {
          car.move();
          if (car.y > MAX_HEIGHT) {
            flag = 1;
            this.gameWindow.removeChild(car.element);
            indexes.push(index);
          }
        }.bind(this)
      );
      cars = cars.filter(function(val, i) {
        return !indexes.includes(i);
      });
      return flag;
    };
    this.speedUpGame = function() {
      this.roadSpeed += 2;
      this.carSpeed = this.roadSpeed;
    };

    this.updateGame = function() {
      var carPassedPlayer = this.moveCars();
      var collision = this.player.checkCollision(cars);
      if (collision) {
        this.handleCollision(collision);
      }
      if (carPassedPlayer) {
        this.score++;
        this.updateScore();
        if (!(this.score % 25)) {
          this.speedUpGame();
        }
      }
      this.animateRoad();
    };

    this.handleCollision = function(index) {
      var collidedCar = cars.splice(index - 1, 1)[0];
      var collisionImage = document.createElement('div');
      collisionImage.classList.add('collision');
      collisionImage.style.width = LANE_WIDTH + 'px';
      collisionImage.style.height = LANE_WIDTH + 'px';
      collisionImage.style.bottom = this.player.y + 'px';
      collisionImage.style.left = this.player.x - this.player.width / 2 + 'px';
      this.player.element.style.display = 'none';
      this.collisionImage = collisionImage;
      this.gameWindow.appendChild(this.collisionImage);
      this.gameWindow.removeChild(collidedCar.element);
      this.player.gameOver = true;
    };

    this.renderGame = function() {
      cars.forEach(function(car) {
        car.draw();
      });
      this.showRoad();
      this.player.draw();
    };

    this.startScreenSlider = function() {
      var shift = 1;
      var startInterval = setInterval(
        function() {
          shift += shift;
          this.splashScreen.style.top = -shift + 'px';
          if (shift >= MAX_HEIGHT) {
            this.parentElement.removeChild(this.splashScreen);
            clearInterval(startInterval);
            this.startGame();
          }
        }.bind(this),
        50
      );
    };

    this.startGame = function() {
      var interval = setInterval(
        function() {
          if (this.obstacleGap > minSpaceBetweenPlayerAndCar) {
            this.obstacleGap = 0;
            if (minSpaceBetweenPlayerAndCar > this.player.length * 2.5) {
              minSpaceBetweenPlayerAndCar += 10;
            }
            this.generateObstacles();
          }
          this.updateGame();
          this.renderGame();
          if (this.player.gameOver) {
            this.createGameOverScreen();
            clearInterval(interval);
          }
          this.clock++;
        }.bind(this),
        20
      );
    };
  }

  var parentElement = document.getElementById('app');

  new Game(parentElement).init();
})();
