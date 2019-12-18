class Capsule {
  constructor() {
    this.x = 0;
    this.y = 40;
    this.dx = 1.5;
    this.dy = 2;
    this.width = 24;
    this.height = 14;
    this.frame = 0;
    this.clock = 1;
    this.destroyed = false;
    this.inVision = true;
    this.hp = 1;
    this.image = gameAssets.capsule.img;
    this.picked = false;
  }

  checkScreenBoundary = () => {
    if (this.x < -this.width || this.x > this.maxWidth + this.width) {
      this.inVision = false;
    }
  };

  getUpgrade = () => {
    this.y = -20;
    let val = 0;
    Math.floor(getRandomArbitrary(0, 3));
    let asset = gameAssets['upgrade' + val];
    this.image = asset.img;
    this.width = asset.w;
    this.height = asset.h;
    this.upgrade = asset.upgrade;
  };

  update = shift => {
    if (!this.destroyed) {
      this.x += this.dx - shift;
      this.y = 40 + Math.sin((30 * (this.x * Math.PI)) / 180);
      this.checkScreenBoundary();
    } else {
      this.y += this.dy;
    }
  };

  draw = () => {
    ctx.beginPath();
    ctx.drawImage(
      this.image,
      this.x * SCALE,
      this.y * SCALE,
      this.width * SCALE,
      this.height * SCALE
    );
    ctx.closePath();
  };

  checkCollision = bullets => {
    if (this.destroyed) return;
    bullets.forEach(bullet => {
      if (
        bullet.x < this.x + this.width &&
        this.x < bullet.x + bullet.width &&
        bullet.y < this.y + this.height &&
        this.y < bullet.y + bullet.height
      ) {
        bullet.destroyed = true;
        this.destroyed = true;
        this.getUpgrade();
      }
    });
  };
}

const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
};
