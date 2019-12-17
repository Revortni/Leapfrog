class Bullet {
  constructor(x, y, dx, dy, speed) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.speed = speed || 5;
    this.width = 2;
    this.height = 2;
    this.destroyed = false;
    this.image = gameAssets.bullet.img;
  }

  move(dx, dy) {
    let shift = -dx || 0;
    this.x += this.dx * this.speed + shift;
    this.y += this.dy * this.speed;
  }

  draw() {
    let c = ctx;
    c.beginPath();
    c.drawImage(
      this.image,
      (this.x + this.width) * SCALE,
      (this.y + this.height) * SCALE,
      2 * this.width * SCALE,
      2 * this.height * SCALE
    );
    c.closePath();
  }

  checkBoundary = () => {
    //move bullets and bulletBoundaryCheck function
    if (
      this.x > SCREEN.width ||
      this.x < 0 ||
      this.y < 0 ||
      this.y > SCREEN.height
    ) {
      this.destroyed = true;
    }
  };

  checkCollision = targets => {
    targets.forEach(target => {
      if (
        target.x < this.x + this.width &&
        this.x < target.x + target.width &&
        target.y < this.y + this.height &&
        this.y < target.y + target.height
      ) {
        this.destroyed = true;
        if (target instanceof Player) {
          target.alive = false;
        } else {
          target.hp--;
          if (target.hp <= 0) {
            target.alive = false;
          }
        }
      }
    });
  };
}
