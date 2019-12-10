class Gun {
  constructor(x, y, dx, dy, jumping) {
    this.x = x;
    this.y = y;
    this.jumping = jumping;
    this.dx = dx;
    this.dy = dy;
    this.speed = 25;
    this.r = 2 * SCALE;
    this.destroyed = false;
    this.init();
  }

  init() {
    if (this.dy == 1 && this.jumping) {
      //if jumping and shooting down
      this.dx = 0;
    }
  }

  shoot() {}
}
