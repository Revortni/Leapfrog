const enemyValues = {
  dx: 2,
  dy: 0,
  gravity: 1.5,
  friction: 0.9,
  width: 19,
  height: 33
};

class Enemy {
  constructor(maxWidth, maxHeight, position) {
    this.width = enemyValues.width;
    this.height = enemyValues.height;
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.inVision = false;
    this.alive = true;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
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
      ctx.drawImage(
        image,
        this.x * SCALE,
        this.y * SCALE,
        this.width * SCALE,
        this.height * SCALE
      );
      ctx.closePath();
    };
  };

  checkBoundary = () => {
    if (this.x + this.width < 0 || this.x > this.maxWidth) {
      this.inVision = false;
    } else {
      this.inVision = true;
    }
  };

  checkCollision = bullets => {
    bullets.forEach(bullet => {
      if (
        bullet.x < this.x + this.width &&
        this.x < bullet.x + bullet.r &&
        bullet.y < this.y + this.height &&
        this.y < bullet.y + bullet.r
      ) {
        this.alive = false;
        bullet.destroyed = true;
      }
    });
  };
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
