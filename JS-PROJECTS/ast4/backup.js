(function() {
  function Box(parentElement, size, boundary) {
    this.x = 10;
    this.y = 10;
    var a = 1;
    this.speedX = a;
    this.speedY = a;
    this.width = size;
    this.height = size;
    this.element = null;
    this.parentElement = parentElement;
    var that = this;

    this.init = function() {
      var box = document.createElement('div');
      box.style.height = this.height + 'px';
      box.style.width = this.width + 'px';
      box.classList.add('box');
      this.parentElement.appendChild(box);
      this.element = box;
      this.element.onclick = this.boxClicked.bind(this);
      this.draw();

      return this;
    };

    this.setPostion = function(x, y) {
      this.x = x;
      this.y = y;
    };

    this.boxClicked = function() {
      console.log('boxClicked', this.width);
    };

    this.draw = function() {
      this.element.style.left = this.x + 'px';
      this.element.style.top = this.y + 'px';
    };

    this.move = function() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.draw();
    };

    this.checkBoundary = function() {
      var left = this.x;
      var right = this.x + this.width;
      var top = this.y;
      var bottom = this.y + this.height;
      if (left <= 0 || right >= boundary.w) {
        this.speedX = -this.speedX;
      }

      if (top <= 0 || bottom >= boundary.h) {
        this.speedY = -this.speedY;
      }
    };

    this.checkCollision = function(boxes) {
      var left = this.x;
      var right = this.x + this.width;
      var top = this.y;
      var bottom = this.y + this.height;
      var i = 0;
      for (i = 0; i < boxes.length; i++) {
        if (boxes[i] !== this) {
          if (
            left < boxes[i].x + boxes[i].width &&
            right > boxes[i].x &&
            top < boxes[i].y + boxes[i].height &&
            bottom > boxes[i].y
          ) {
            break;
          }
        }
      }
      return boxes[i];
    };

    this.handleCollision = function(box) {
      box.speedX = -box.speedX;
      this.speedX = -this.speedX;
      box.speedY = -box.speedY;
      this.speedY = -this.speedY;
    };
  }

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  function Game(parentElement, boxCount) {
    var boxes = [];
    var MAX_WIDTH = 4000;
    var MAX_HEIGHT = 2000;
    var box_size = 20;
    this.parentElement = parentElement;
    this.boxCount = boxCount || 600;
    parentElement.style.width = MAX_WIDTH + 'px';
    parentElement.style.height = MAX_HEIGHT + 'px';

    this.startGame = function() {
      var timer = setInterval(function() {
        var box = new Box(parentElement, box_size, {
          w: MAX_WIDTH,
          h: MAX_HEIGHT
        }).init();

        while (1) {
          box.setPostion(
            getRandomArbitrary(0, MAX_WIDTH - box_size * 2),
            getRandomArbitrary(0, MAX_HEIGHT - box_size * 2)
          );
          if (!boxes.length) {
            break;
          }
          if (!box.checkCollision(boxes)) {
            break;
          }
        }
        box.draw();
        boxes.push(box);
        if (box.length > boxCount) {
          clearInterval(timer);
        }
      }, 1);

      setInterval(this.moveBoxes.bind(this), 50);
    };

    this.moveBoxes = function() {
      for (var i = 0; i < this.boxCount; i++) {
        var collidedBox = null;
        boxes[i].move();
        boxes[i].checkBoundary();
        collidedBox = boxes[i].checkCollision(boxes);
        if (collidedBox) {
          boxes[i].handleCollision(collidedBox);
        }
      }
    };
  }

  var parentElement = document.getElementById('app');

  new Game(parentElement).startGame();
})();
