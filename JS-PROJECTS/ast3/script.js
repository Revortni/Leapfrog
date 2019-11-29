(function() {
  function Box(ant, parent, id, size, color, boundary) {
    this.x = 10;
    this.y = 10;
    this.id = id;
    this.speedX = getRandomArbitrary(-1, 1);
    this.speedY = getRandomArbitrary(-1, 1);
    this.width = size;
    this.height = size;
    this.element = null;
    this.parent = parent;
    this.ant = ant;
    this.alive = true;
    this.xprev = 0;
    this.yprev = 0;

    var that = this;

    this.init = function() {
      var box = document.createElement('div');
      box.style.height = this.height + 'px';
      box.style.width = this.width + 'px';

      this.element = box;
      if (this.ant) {
        box.classList.add('ant');
        box.style.backgroundSize = size + 'px ' + size + 'px';
        this.element.onclick = this.antClicked.bind(this);
      } else {
        box.classList.add('box');
        box.style.backgroundColor = color;
        this.element.onclick = this.boxClicked.bind(this);
      }
      this.parent.appendChild(box);
      this.draw();

      return this;
    };

    this.setPostion = function(x, y) {
      this.x = x;
      this.y = y;
    };

    this.boxClicked = function() {
      console.log('Box ' + this.id + ' was clicked');
    };

    this.antClicked = function() {
      this.element.background = 'url("./deadAnt.gif")';
      this.alive = false;
      setTimeout(function() {
        that.parent.removeChild(that.element);
      }, 1000);
    };

    this.draw = function() {
      this.element.style.left = this.x + 'px';
      this.element.style.top = this.y + 'px';
    };

    this.setFace = function(x, y) {
      var dx = this.x - x;
      var dy = this.y - y;
      var a = dx < 0 ? -90 : 90;
      this.element.style.transform =
        'rotate(' + (Math.atan(dy / dx) * 57.2958 + a) + 'deg)';
    };

    this.move = function() {
      var x = this.x;
      var y = this.y;
      this.x += this.speedX;
      this.y += this.speedY;
      this.setFace(x, y);
      this.draw();
    };

    this.applyBoundary = function() {
      var left = this.x + this.speedX;
      var right = this.x + this.width + this.speedX;
      var top = this.y + this.speedY;
      var bottom = this.y + this.height + this.speedY;
      if (left < 0 || right > boundary.w) {
        this.speedX = -this.speedX * 0.8;
      }

      if (top < 0 || bottom > boundary.h) {
        this.speedY = -this.speedY * 0.8;
      }
    };

    this.isPositionUnique = function(boxes) {
      var left = this.x;
      var right = this.x + this.width;
      var top = this.y;
      var bottom = this.y + this.height;
      for (var i = 0; i < boxes.length; i++) {
        if (boxes[i] !== this) {
          if (
            left < boxes[i].x + boxes[i].width &&
            right > boxes[i].x &&
            top < boxes[i].y + boxes[i].height &&
            bottom > boxes[i].y
          ) {
            return false;
          }
        }
      }
      return true;
    };

    this.checkCollision = function(boxes) {
      var left = this.x;
      var right = this.x + this.width;
      var top = this.y;
      var bottom = this.y + this.height;
      for (var i = 0; i < boxes.length; i++) {
        if (boxes[i] !== this) {
          if (
            left < boxes[i].x + boxes[i].width &&
            right > boxes[i].x &&
            top < boxes[i].y + boxes[i].height &&
            bottom > boxes[i].y
          ) {
            var xdiff = this.speedX - boxes[i].speedX;
            var ydiff = this.speedY - boxes[i].speedY;
            this.speedX += -xdiff;
            this.speedY += -ydiff;
            boxes[i].speedX += xdiff;
            boxes[i].speedY += ydiff;
          }
        }
      }
    };
  }

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
  function getRandomColor() {
    var colors = [
      '#00FA9A',
      '#98FB98',
      '#20B2AA',
      '#E0FFFF',
      '#5F9EA0',
      '#4682B4',
      '#87CEFA',
      '#7B68EE',
      '#6A5ACD'
    ];
    var index = Math.floor(getRandomArbitrary(0, colors.length - 1));
    return colors[index];
  }

  function Game(parent, boxCount, ant) {
    var boxes = [];
    var MAX_WIDTH = 2000;
    var MAX_HEIGHT = 500;
    this.parent = parent;
    this.boxCount = boxCount || 20;
    parent.style.width = MAX_WIDTH + 'px';
    parent.style.height = MAX_HEIGHT + 'px';

    this.startGame = function() {
      for (var i = 0; i < this.boxCount; i++) {
        var randomSize = Math.floor(getRandomArbitrary(20, 50));
        var randomColor = getRandomColor();
        var box = new Box(ant, parent, i, randomSize, randomColor, {
          w: MAX_WIDTH,
          h: MAX_HEIGHT
        }).init();
        while (1) {
          box.setPostion(
            getRandomArbitrary(0, MAX_WIDTH - randomSize),
            getRandomArbitrary(0, MAX_HEIGHT - randomSize)
          );
          if (!boxes.length) {
            break;
          }
          if (box.isPositionUnique(boxes)) {
            break;
          }
        }
        box.draw();
        boxes.push(box);
      }

      setInterval(this.moveBoxes.bind(this), 5);
    };

    this.moveBoxes = function() {
      for (var i = 0; i < this.boxCount; i++) {
        if (ant) {
          if (!boxes[i].alive) {
            boxes.splice(i, 1);
          }
        }
        boxes[i].move();
        boxes[i].checkCollision(boxes);
        boxes[i].applyBoundary();
      }
    };
  }

  // var parent = document.getElementById('app');
  // new Game(parent, 50, false).startGame();
  var parent1 = document.getElementById('app1');
  new Game(parent1, 100, true).startGame();
})();
