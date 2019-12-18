class Capsule {
  constructor() {
    this.x = 0;
    this.y = 40;
    this.dx = 2;
    this.dy = 1;
    this.width = 24;
    this.height = 14;
    this.frame = 0;
    this.clock = 1;
    this.destroyed = false;
    this.inVision = true;
    this.hp = 1;
    this.image = gameAssets.capsule;
  }

  checkScreenBoundary = () => {
    if (this.x + this.width < 0 || this.x > this.maxWidth) {
      this.inVision = false;
    }
  };

  update = () => {
    this.x += this.dx;
    this.y = 40;
    this.checkScreenBoundary();
  };

  draw = () => {
    ctx.beginPath();
    ctx.drawImage(
      this.image.img,
      this.x,
      this.y,
      this.width * SCALE,
      this.height * SCALE
    );
    ctx.closePath();
  };

  checkCollision = bullets => {
    bullets.forEach(bullet => {
      if (
        bullet.x < this.x + this.width &&
        this.x < bullet.x + bullet.width &&
        bullet.y < this.y + this.height &&
        this.y < bullet.y + bullet.height
      ) {
        this.destroyed = true;
        bullet.destroyed = true;
      }
    });
  };
}

const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
};
