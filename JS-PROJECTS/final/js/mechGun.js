class MechGun extends Sniper {
  constructor(world) {
    super(world);
    this.width = 32;
    this.height = 48;
    this.image = gameAssets.mechgun;
    this.hp = 10;
    this.reloadTime = 40;
    this.point = 50;
  }
  shoot = (x, y) => {
    x = Math.floor(x);
    y = Math.floor(y);
    let angle = Math.atan2(y - this.y, x - this.x);
    let dx = Math.cos(angle);
    let dy = Math.sin(angle);
    if (dx > 0) {
      return;
    }
    let bullet = new Bullet(this.x, this.y + 8, dx, dy, 2);
    this.world.enemyBullets.push(bullet);
  };

  checkScreenBoundary = () => {
    if (this.x < 0 || this.x > this.maxWidth + this.boundaryOffset) {
      this.inVision = false;
    }
  };
}
