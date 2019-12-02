(function() {
  function Player(
    parentElement,
    windowWidth,
    windowHeight,
    speed,
    controlKeys
  ) {
    this.x = 0;
    this.y = 10;
    this.turnSpeed = speed || 50;
    this.length = 200;
    this.width = 100;
    this.element = null;
    this.parentElement = parentElement;
    this.windowWidth = windowWidth;
    this.gameOver = false;
    this.controlKeys = controlKeys;
    this.bullets = [];
    this.bulletCount = 5;

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
      this.bulletCount = 5;
      this.bullets = [];
      this.draw();
    };

    this.handleButtonClick = function(event) {
      if (event.code == this.controlKeys.left) {
        this.moveLeft();
      }
      if (event.code == this.controlKeys.right) {
        this.moveRight();
      }
      if (event.code == this.controlKeys.shoot) {
        this.shoot();
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

    this.shoot = function() {
      if (this.bulletCount > 0) {
        var bullet = new Bullet(
          this.parentElement,
          this.x + this.width / 2,
          this.y + this.length,
          windowHeight
        ).init();
        this.bullets.push(bullet);
        this.bulletCount--;
      }
    };

    this.moveBullets = function() {
      this.bullets = this.bullets.filter(function(bullet) {
        return bullet.move();
      });
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

  function Bullet(parentElement, x, y, windowHeight) {
    this.x = x;
    this.y = y;
    this.length = 20;
    this.width = 20;
    this.parentElement = parentElement;
    this.speed = 10;
    this.element = null;

    this.init = function() {
      var bullet = document.createElement('div');
      bullet.classList.add('bullet');
      bullet.style.width = this.width + 'px';
      bullet.style.height = this.length + 'px';
      this.x -= this.width / 2;
      bullet.style.left = this.x + 'px';
      this.element = bullet;
      this.parentElement.appendChild(this.element);
      this.draw();
      return this;
    };

    this.move = function() {
      if (this.y > windowHeight) {
        this.element.remove();
        return 0;
      }
      this.y += this.speed;
      this.draw();
      return 1;
    };

    this.draw = function() {
      this.element.style.bottom = this.y + 'px';
    };
  }

  function Car(parentElement, speed, laneWidth, lane) {
    this.x = 0;
    this.y = 0;
    this.length = 200;
    this.width = 100;
    this.speed = speed;
    this.lane = lane;
    this.parentElement = parentElement;
    this.element = null;

    this.init = function() {
      var car = document.createElement('div');
      car.style.height = this.length + 'px';
      car.style.width = this.width + 'px';
      this.x = laneWidth * lane - laneWidth / 2 - this.width / 2;
      this.y = -this.length * 2;
      car.style.left = this.x + 'px';
      car.classList.add('car');
      this.element = car;
      this.parentElement.appendChild(this.element);
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

  function Game(parentElement, controls) {
    var cars = [];
    var MAX_WIDTH = 600;
    var MAX_HEIGHT = 1400;
    var LANE_WIDTH = 200;
    var BASE_SPEED = 3;
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
    this.carSpeed = this.roadSpeed - 1;
    this.obstacleGap = 0;
    this.gameOverScreen = null;
    var minSpaceBetweenPlayerAndCar = 0;
    var spaceBetweenPlayerAndCar = 0;
    this.controls = controls || 0;
    this.highScore = 0;
    this.bulletCounter = 0;
    var HIGHSCOREKEY = '@highscore';

    var that = this;

    this.init = function() {
      this.parentElement.classList.add('parent');
      this.gameWindow = document.createElement('div');
      this.gameWindow.classList.add('gameWindow');
      this.gameWindow.style.width = MAX_WIDTH + 'px';
      this.gameWindow.style.height = MAX_HEIGHT + 'px';
      this.parentElement.classList.add('clearfix');
      this.fetchHighScore();
      this.createRoad();
      this.createPlayer();
      minSpaceBetweenPlayerAndCar = this.player.length * 4;
      spaceBetweenPlayerAndCar = MAX_HEIGHT - this.player.length * 2;
      this.obstacleGap = MAX_HEIGHT - this.player.length * 2;
      this.parentElement.appendChild(this.gameWindow);
      this.createInfoBoard();
      this.updateBulletCounter();
      this.createSplashScreen();
    };

    this.resetGame = function() {
      this.score = 0;
      this.updateScore();
      this.gameWindow.removeChild(this.collisionImage);
      this.parentElement.removeChild(this.gameOverScreen);
      minSpaceBetweenPlayerAndCar = this.player.length * 4;
      spaceBetweenPlayerAndCar = MAX_HEIGHT - this.player.length * 2;
      this.obstacleGap = MAX_HEIGHT - this.player.length * 2;
      cars.forEach(
        function(car) {
          this.gameWindow.removeChild(car.element);
        }.bind(this)
      );
      cars = [];
      this.roadSpeed = BASE_SPEED;
      this.carSpeed = this.roadSpeed - 1;
      this.player.reset();
      this.updateBulletCounter();
      this.createSplashScreen();
    };

    this.fetchHighScore = function() {
      if (localStorage.getItem(HIGHSCOREKEY) == null) {
        this.highScore = 0;
      } else {
        this.highScore = localStorage.getItem(HIGHSCOREKEY);
      }
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
      this.roadSlider = roadSlider;
      roadSlider.classList.add('roadSlider');
      roadSlider.style.marginTop = this.sliderPosition + 'px';
      roadSlider.style.backgroundSize = MAX_WIDTH + 'px ' + MAX_HEIGHT + 'px';
      roadSlider.classList.add('roadSlider');

      this.gameWindow.appendChild(roadSlider);
    };

    this.createPlayer = function() {
      var controls = this.controls;
      var controlKeys = { left: 0, right: 0, shoot: 0 };
      if (controls) {
        controlKeys.left = 'KeyJ';
        controlKeys.right = 'KeyL';
        controlKeys.shoot = 'KeyI';
      } else {
        controlKeys.left = 'KeyA';
        controlKeys.right = 'KeyD';
        controlKeys.shoot = 'KeyW';
      }
      this.player = new Player(
        this.gameWindow,
        MAX_WIDTH,
        MAX_HEIGHT,
        LANE_WIDTH,
        controlKeys
      ).init();
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

    this.createInfoBoard = function() {
      var infoBoard = document.createElement('div');
      var board = document.createElement('span');
      var bulletCounter = document.createElement('span');
      infoBoard.classList.add('infoBoard');
      this.scoreBoard = board;
      this.updateScore();
      this.bulletCounter = bulletCounter;
      this.updateBulletCounter();
      infoBoard.appendChild(this.scoreBoard);
      infoBoard.appendChild(this.bulletCounter);
      this.parentElement.appendChild(infoBoard);
    };

    this.updateScore = function() {
      this.scoreBoard.innerHTML = 'Score: ' + this.score;
    };

    this.updateBulletCounter = function() {
      this.bulletCounter.innerHTML = 'Ammo left: ' + this.player.bulletCount;
    };

    this.animateRoad = function() {
      this.sliderPosition += this.roadSpeed;
    };

    this.showRoad = function() {
      this.roadSlider.style.marginTop = this.sliderPosition + 'px';
      if (this.sliderPosition + this.roadSpeed >= 0) {
        var diff = this.roadSpeed - this.sliderPosition;
        this.sliderPosition = -MAX_HEIGHT + diff;
      }
    };

    this.createGameOverScreen = function() {
      var screen = document.createElement('div');
      var text = document.createElement('div');
      var restart = document.createElement('div');
      var highScore = document.createElement('div');
      highScore.classList.add('scoreText');
      var yourScore = highScore.cloneNode();
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

    this.moveCars = function() {
      this.obstacleGap += this.carSpeed;
      var flag = 0;
      cars = cars.filter(
        function(car) {
          car.move();
          if (car.y > MAX_HEIGHT) {
            car.element.remove();
            flag = 1;
            return false;
          }
          return true;
        }.bind(this)
      );
      if (flag) {
        this.score++;
      }
      return flag;
    };

    this.speedUpGame = function() {
      if (
        spaceBetweenPlayerAndCar - this.carSpeed >
        minSpaceBetweenPlayerAndCar
      ) {
        this.roadSpeed += 1;
        this.carSpeed = this.roadSpeed - 1;
        spaceBetweenPlayerAndCar += this.carSpeed;
      }
    };

    this.createExplosion = function(x, y, height) {
      var explosion = document.createElement('div');
      explosion.classList.add('explosion');
      explosion.style.width = LANE_WIDTH + 'px';
      explosion.style.height = height + 'px';
      explosion.style.left = x + 'px';
      explosion.style.top = y + 'px';
      this.gameWindow.appendChild(explosion);
      setTimeout(
        function() {
          this.gameWindow.removeChild(explosion);
        }.bind(this),
        800
      );
    };

    this.checkBulletHitCar = function(bullets) {
      bullets = bullets.forEach(
        function(bullet, index) {
          var left = bullet.x;
          var right = bullet.x + bullet.width;
          var top = bullet.y + bullet.length;
          var bottom = bullet.y;

          for (var i = 0; i < cars.length; i++) {
            var cleft = cars[i].x;
            var cright = cars[i].x + cars[i].width;
            var ctop = MAX_HEIGHT - (cars[i].y + cars[i].length);
            var cbottom = MAX_HEIGHT - cars[i].y;
            if (
              right < cright &&
              left > cleft &&
              top > ctop &&
              bottom < cbottom
            ) {
              cars[i].element.remove();
              bullet.element.remove();
              this.score++;
              this.updateScore();
              this.createExplosion(
                cars[i].x - cars[i].width / 2,
                cars[i].y,
                cars[i].length
              );
              cars[i].x = -1;
              cars.splice(1, i);
              bullet.x = -1;
              bullets = bullets.splice(1, index);
            }
          }
        }.bind(this)
      );
    };

    this.updateGame = function() {
      this.moveCars();
      if (this.player.bullets.length) {
        this.updateBulletCounter();
        this.checkBulletHitCar(this.player.bullets);
      }
      this.updateScore();
      if (this.clock && !(this.clock % 1000)) {
        this.player.bulletCount++;
        this.updateBulletCounter();
      }
      if (this.clock && !(this.clock % 2000)) {
        this.speedUpGame();
      }
      this.player.moveBullets();
      var collision = this.player.checkCollision(cars);
      if (collision) {
        this.handleCollision(collision);
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
          if (this.obstacleGap > spaceBetweenPlayerAndCar) {
            this.obstacleGap = 0;
            this.generateObstacles();
          }
          this.updateGame();
          this.renderGame();
          if (this.player.gameOver) {
            if (this.score > this.highScore) {
              this.highScore = this.score;
              localStorage.setItem(HIGHSCOREKEY, this.score);
            }
            setTimeout(
              function() {
                this.createGameOverScreen();
              }.bind(this),
              1000
            );
            clearInterval(interval);
          }
          this.clock++;
        }.bind(this),
        0
      );
    };
  }

  var parentElement = document.getElementById('app');
  new Game(parentElement, 0).init();

  // var parentElement1 = document.getElementById('app1');
  // new Game(parentElement1, 1).init();
})();
