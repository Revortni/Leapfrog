class Enemy {
  constructor(w, h) {
    this.width = w;
    this.height = h;
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
  }

  draw = () => {
    ctx.beginPath();
    ctx.save();
    ctx.scale(this.invert, 1);
    ctx.drawImage(
      this.image.img,
      this.frame * this.image.w,
      0,
      this.image.w,
      this.image.h,
      this.x * SCALE * this.invert,
      this.y * SCALE,
      this.image.w * SCALE,
      this.image.h * SCALE
    );

    ctx.strokeRect(
      this.x * SCALE * this.invert,
      this.y * SCALE,
      this.image.w * SCALE,
      this.image.h * SCALE
    );
    ctx.restore();
    ctx.closePath();
  };

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
      if (this.invert == -1) {
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
      } else {
        if (
          bullet.x < this.x + this.width &&
          this.x < bullet.x + bullet.r &&
          bullet.y < this.y + this.height &&
          this.y < bullet.y + bullet.r &&
          !bullet.destroyed
        ) {
          this.alive = false;
          bullet.destroyed = true;
        }
      }
    });
  };

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
}
