class Bullet {
  constructor(x, y, dx, dy, speed, image, size) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.speed = speed || 5;
    this.width = size || 2;
    this.height = size || 2;
    this.destroyed = false;
    this.image = image || gameAssets.bullet.img;
    this.hit = false;
  }

  move(dx, dy) {
    let shiftx = -dx || 0;
    let shifty = dy || 0;
    this.x += this.dx * this.speed + shiftx;
    this.y += this.dy * this.speed + shifty;
  }

  draw() {
    ctx.beginPath();
    ctx.drawImage(
      this.image,
      (this.x + this.width) * SCALE,
      (this.y + this.height) * SCALE,
      2 * this.width * SCALE,
      2 * this.height * SCALE
    );
    ctx.closePath();
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
    let points = 0;
    targets.forEach(target => {
      if (
        target.x < this.x + this.width &&
        this.x < target.x + target.width &&
        target.y < this.y + this.height &&
        this.y < target.y + target.height
      ) {
        this.hit = true;
        this.destroyed = true;
        if (target instanceof Player) {
          target.alive = false;
        } else {
          target.hp--;
          if (target.hp <= 0) {
            points += target.point;
            target.setKilled();
          }
        }
      }
    });
    return points;
  };
}
