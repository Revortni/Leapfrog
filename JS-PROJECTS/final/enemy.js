const enemyValues = {
  dx: 5,
  dy: 0,
  gravity: 1.5,
  friction: 0.9,
  width: 48,
  height: 68
};

class Enemy {
  constructor(context, maxWidth, maxHeight, position) {
    this.width = enemyValues.width;
    this.height = enemyValues.height;
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.context = context;
    this.alive = true;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this.image = '';
    this.setPosition(position);
    this.init();
  }

  init = () => {
    this.dy = enemyValues.dy;
  };

  setPosition = position => {
    if (position == 'right') {
      this.x = this.maxWidth;
      this.y = this.maxHeight - this.height;
      this.dx = -enemyValues.dx;
      this.image = './assets/soilderL.gif';
    }
    if (position == 'left') {
      this.x = 0;
      this.y = this.maxHeight - this.height;
      this.dx = enemyValues.dx;
      this.image = './assets/soilderR.gif';
    }
  };

  update = () => {
    //add velocity for movement in x y
    this.x += this.dx;
    this.y += this.dy;
  };

  draw = () => {
    let c = this.context;
    let image = new Image();
    image.src = this.image;
    c.beginPath();
    image.onload = () => {
      c.drawImage(image, this.x, this.y, this.width, this.height);
      c.closePath();
    };
  };

  checkBoundary = () => {
    if (this.x < 0 || this.x > this.maxWidth) {
      this.alive = false;
    } else {
      this.alive = true;
    }
  };
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
