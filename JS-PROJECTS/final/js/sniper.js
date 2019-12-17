class Sniper extends Enemy {
  constructor(world) {
    super();
    this.width = 16;
    this.height = 31;
    this.bulletSet = [];
    this.image = gameAssets.sniper.img;
    this.clock = 0;
    this.world = world;
    this.reloadTime = 50;
  }

  update = ({ playerX, playerY }) => {
    this.x = this.wx - this.world.x;
    this.y =
      this.wy - (-this.world.y + this.world.screenY + this.world.screenHeight);
    if (
      this.clock % this.reloadTime == 0 &&
      this.x > 0 &&
      this.x < SCREEN.width
    ) {
      this.shoot(playerX, playerY);
    }
    this.clock++;
  };

  shoot = (x, y) => {
    x = Math.floor(x);
    y = Math.floor(y);
    let angle = Math.atan2(y - this.y, x - this.x);
    let dx = Math.cos(angle);
    let dy = Math.sin(angle);
    let bullet = new Bullet(this.x, this.y, dx, dy, 3);
    this.world.enemyBullets.push(bullet);
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
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
  };

  checkScreenBoundary = () => {};
}
