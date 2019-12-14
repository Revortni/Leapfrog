const enemyValues = {
  dx: 1.2,
  dy: 8,
  gravity: 1,
  friction: 0.9,
  width: 19,
  height: 33,
  boundaryOffset: 30
};

class Enemy {
  constructor(maxWidth, position) {
    this.width = enemyValues.width;
    this.height = enemyValues.height;
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.inVision = false;
    this.alive = true;
    this.maxWidth = maxWidth;

    this.frame = 0;
    this.clock = 1;
    this.invert = 1;
    this.setPosition(position);
    this.init();
  }

  init = () => {
    this.dy = enemyValues.dy;
  };

  setPosition = position => {
    if (position == 'right') {
      this.x = this.maxWidth;
      this.dx = -enemyValues.dx;
      this.image = gameAssets.enemy1L;
    }
    if (position == 'left') {
      this.x = -this.width * 2;
      this.dx = enemyValues.dx;
      this.image = gameAssets.enemy1R;
    }
  };

  update = worldShift => {
    //add velocity for movement in x y
    this.x += this.dx - worldShift;
    this.y += this.dy;
    if (this.clock % 5 == 0) {
      this.frame++;
      this.frame = this.frame % this.image.frameCount;
    }
    this.clock++;
  };

  draw = () => {
    ctx.beginPath();
    ctx.save();
    ctx.drawImage(
      this.image.img,
      this.frame * this.image.w,
      0,
      this.image.w,
      this.image.h,
      this.x * SCALE,
      this.y * SCALE,
      this.image.w * SCALE,
      this.image.h * SCALE
    );

    ctx.strokeRect(
      this.x * SCALE,
      this.y * SCALE,
      this.image.w * SCALE,
      this.image.h * SCALE
    );
    ctx.restore();
    ctx.closePath();
  };

  checkScreenBoundary = () => {
    if (
      this.x + this.width < -enemyValues.boundaryOffset ||
      this.x > this.maxWidth + enemyValues.boundaryOffset
    ) {
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
