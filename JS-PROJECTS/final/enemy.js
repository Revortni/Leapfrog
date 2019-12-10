const enemyValues = {
  dx: 5,
  dy: 0,
  gravity: 1.5,
  friction: 0.9,
  width: 19,
  height: 33
};

class Enemy {
  constructor(maxWidth, maxHeight, position) {
    this.width = enemyValues.width * SCALE;
    this.height = enemyValues.height * SCALE;
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
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
    let image = new Image();
    image.src = this.image;
    ctx.beginPath();
    image.onload = () => {
      ctx.drawImage(image, this.x, this.y, this.width, this.height);
      ctx.closePath();
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
