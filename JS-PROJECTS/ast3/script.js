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
    var that = this;

    this.init = function() {
      var box = document.createElement('div');
      box.style.height = this.height + 'px';
      box.style.width = this.width + 'px';
      box.classList.add('box');
      this.element = box;
      if (this.ant) {
        var ant = document.createElement('img');
        ant.src = './antwalk.gif';
        ant.style.maxWidth = '100%';
        ant.style.maxHeight = '100%';
        box.appendChild(ant);
        this.ant = ant;
        this.element.onclick = this.antClicked.bind(this);
      } else {
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
      this.ant.src = './deadAnt.gif';
      this.move = function() {};
      setTimeout(function() {
        that.parent.removeChild(that.element);
      }, 1000);
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

    this.applyBoundary = function() {
      var left = this.x;
      var right = this.x + this.width;
      var top = this.y;
      var bottom = this.y + this.height;
      if (left < 0 || right > boundary.w) {
        this.speedX = -this.speedX;
      }

      if (top < 0 || bottom > boundary.h) {
        this.speedY = -this.speedY;
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
    var MAX_WIDTH = 500;
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

      setInterval(this.moveBoxes.bind(this), 10);
    };

    this.moveBoxes = function() {
      for (var i = 0; i < this.boxCount; i++) {
        boxes[i].move();
        boxes[i].applyBoundary();
        boxes[i].checkCollision(boxes);
      }
    };
  }

  var parent = document.getElementById('app');
  new Game(parent, 10, false).startGame();
  var parent1 = document.getElementById('app1');
  new Game(parent1, 10, true).startGame();
})();
