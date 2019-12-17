class Sniper extends Enemy {
  constructor(world) {
    super();
    this.width = 16;
    this.height = 31;
    this.bulletSet = [];
    this.image = gameAssets.sniper.img;
    this.clock = 0;
    this.world = world;
  }

  update({ playerX, playerY }) {
    this.x = this.wx - this.world.x;
    this.y = this.wy;
    if (this.clock % 50 == 0) {
      this.shoot(playerX, playerY);
    }
    this.clock++;
  }

  shoot(x, y) {
    x = Math.floor(x);
    y = Math.floor(y);
    let angle = Math.atan2(y - this.y, x - this.x);
    let dx = Math.cos(angle);
    let dy = Math.sin(angle);
    let bullet = new EnemyBullet(this.world, this.x, this.y, dx, dy);
    this.world.enemyBullets.push(bullet);
  }

  draw = () => {
    ctx.beginPath();
    ctx.drawImage(
      this.image,
      this.x * SCALE,
      this.y * SCALE,
      this.width * SCALE,
      this.height * SCALE
    );
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
  };

  checkBoundary = () => {};
}
class EnemyBullet {
  constructor(world, x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.speed = 2;
    this.r = 2;
    this.destroyed = false;
    this.image = gameAssets.bullet.img;
    this.world = world;
  }

  move() {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
    this.checkBoundary();
  }

  draw() {
    let c = ctx;
    c.beginPath();
    c.drawImage(
      this.image,
      (this.x + this.r) * SCALE,
      (this.y + this.r) * SCALE,
      2 * this.r * SCALE,
      2 * this.r * SCALE
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
}