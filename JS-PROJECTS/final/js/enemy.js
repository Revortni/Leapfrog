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
    this.hp = 1;
  }

  checkScreenBoundary = () => {
    if (
      this.x + this.width < -this.boundaryOffset ||
      this.x > this.maxWidth + this.boundaryOffset
    ) {
      this.inVision = false;
    }
  };

  setPosition(x, y) {
    this.wx = x;
    this.wy = y;
  }
}
