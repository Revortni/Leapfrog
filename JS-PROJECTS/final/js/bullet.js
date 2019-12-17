class Bullet {
  constructor(x, y, dx, dy, jumping) {
    this.x = x;
    this.y = y;
    this.jumping = jumping || false;
    this.dx = dx;
    this.dy = dy;
    this.speed = 5;
    this.width = 2;
    this.height = 2;
    this.destroyed = false;
    this.image = gameAssets.bullet.img;
  }

  move() {
    this.x += this.dx * this.speed;
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
      this.x > this.maxWidth ||
      this.x < 0 ||
      this.y < 0 ||
      this.y > this.maxHeight
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
