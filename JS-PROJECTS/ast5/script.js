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
        if (
          left < cars[i].x + cars[i].width &&
          right > cars[i].x &&
          top > windowHeight - (cars[i].y + cars[i].length) &&
          bottom < windowHeight - cars[i].y
        ) {
          console.log('collision', i);
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
  function getBinaryRandom() {
    return Math.round(Math.random());
  }

  function Game(parentElement) {
    var cars = [];
    var MAX_WIDTH = 300;
    var MAX_HEIGHT = 1000;
    var LANE_WIDTH = 100;
    var laneCount = MAX_WIDTH / LANE_WIDTH;
    this.sliderPosition = -MAX_HEIGHT;
    this.parentElement = parentElement;
    this.gameWindow = null;
    this.roadSlider = null;
    this.player = null;
    this.clock = 0;
    this.roadStrip = null;
    this.interval = 0;
    this.gameSpeed = 1;
    this.carSpeed = 5;
    this.roadSpeed = 10;
    this.score = 0;

    var that = this;

    this.init = function() {
      this.gameWindow = document.createElement('div');
      this.gameWindow.classList.add('gameWindow');
      this.gameWindow.style.width = MAX_WIDTH + 'px';
      this.gameWindow.style.height = MAX_HEIGHT + 'px';
      this.createRoad();
      this.createPlayer();
      this.parentElement.appendChild(this.gameWindow);
      this.createScoreBoard();
      this.startGame();
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
    };

    this.createCar = function(lane) {
      var car = new Car(
        this.gameWindow,
        this.carSpeed * this.gameSpeed,
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
      this.parentElement.appendChild(board);
    };

    this.animateRoad = function() {
      this.sliderPosition += this.roadSpeed;
      this.roadStrip.style.display = 'none';
      this.roadSlider.style.marginTop = this.sliderPosition + 'px';
      if (this.sliderPosition >= 0) {
        this.roadStrip.style.display = 'block';
        this.sliderPosition = -MAX_HEIGHT;
      }
    };

    this.generateObstacles = function() {
      var position = Array(laneCount - 1)
        .fill(0)
        .map(function() {
          return Math.ceil(getRandomArbitrary(0, laneCount));
        });
      position.forEach(function(val) {
        that.createCar(val);
      });
    };

    this.updateScore = function() {
      this.scoreBoard.innerHTML = 'Score:' + this.score;
    };

    this.moveCars = function() {
      var indexes = [];
      cars.forEach(
        function(car, index) {
          car.move();
          if (car.y > MAX_HEIGHT) {
            this.gameWindow.removeChild(car.element);
            cars.splice(index, 1);
          }
        }.bind(this)
      );
    };

    this.handleCollision = function(index) {
      var collidedCar = cars.splice(index - 1, 1)[0];
      this.gameWindow.removeChild(collidedCar.element);
      this.player.x -= this.player.width / 2;
      this.player.element.style.width = 100 + 'px';
      this.player.element.style.height = '100px';
      this.player.element.classList.add('collision');
      this.player.gameOver = true;
    };
    this.render = function() {
      cars.forEach(function(car) {
        car.draw();
      });
      this.player.draw();
      this.animateRoad();
    };

    this.startGame = function() {
      var interval = setInterval(
        function() {
          if (!(this.clock % 1)) {
            if (!(this.clock % (this.player.length * this.gameSpeed))) {
              this.generateObstacles();
            }
            this.moveCars();
            var collision = this.player.checkCollision(cars);
            if (collision) {
              this.handleCollision(collision);
            }
            this.render();
            if (this.player.gameOver) {
              clearInterval(interval);
            }
          }
          this.clock++;
        }.bind(this),
        50
      );
    };
  }

  var parentElement = document.getElementById('app');

  new Game(parentElement).init();
})();
