class Enemy {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.maxWidth = SCREEN.width;
    this.frame = 0;
    this.clock = 1;
    this.invert = 1;
    this.boundaryOffset = 0;
    this.destroyed = false;
    this.inVision = true;
    this.alive = true;
    this.invert = 1;
    this.life = 1;
  }

  checkScreenBoundary = () => {
    if (
      this.x + this.width < -this.boundaryOffset ||
      this.x > this.maxWidth + this.boundaryOffset
    ) {
      this.inVision = false;
    }
  };

  checkCollision = bullets => {
    bullets.forEach(bullet => {
      if (
        bullet.x < this.x &&
        this.x - this.width < bullet.x + bullet.r &&
        bullet.y < this.y + this.height &&
        this.y < bullet.y + bullet.r &&
        !bullet.destroyed
      ) {
        this.alive = false;
        bullet.destroyed = true;
      }
    });
  };

  setPosition(x, y) {
    this.wx = x;
    this.wy = y;
  }
}
