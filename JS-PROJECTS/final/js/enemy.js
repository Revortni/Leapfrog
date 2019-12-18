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
    this.hp = 2;
    this.killed = false;
    this.destroyedImage = gameAssets.enemyExplode;
    this.point = 10;
    
  }

  checkScreenBoundary = () => {
    if (
      this.x + this.width < -this.boundaryOffset ||
      this.x > this.maxWidth + this.boundaryOffset
    ) {
      this.inVision = false;
    }
  };

  setPosition = (x, y) => {
    this.wx = x;
    this.wy = y;
  };

  destroy = () => {
    this.x -= this.world.dx;
    if (this.clock % 2 == 0) {
      this.frame++;
    }
    if (this.frame > 3) {
      this.alive = false;
    }
    this.clock++;
  };

  setKilled = () => {
    this.image = this.destroyedImage;
    this.killed = true;
    this.clock = 1;
    this.frame = 0;
    let x = this.x + this.width / 2 - this.image.r;
    let y = this.y + this.height / 2 - this.image.r;
    this.x = x;
    this.y = y;
  };

  checkIfKilled = () => {
    if (this.killed) {
      this.destroy();

      return true;
    }
    return false;
  };
}
