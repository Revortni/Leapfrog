class SBSniper extends Sniper {
  constructor(world) {
    super(world);
    this.width = 32;
    this.height = 17;
    this.image = gameAssets.sbsniper;
    this.hp = 2;
  }
  shoot = (x, y) => {
    x = Math.floor(x);
    y = Math.floor(y);
    let angle = Math.atan2(y - this.y, x - this.x);
    let dx = Math.cos(angle);
    let dy = Math.sin(angle);
    if (angle < Math.PI / 2) {
      let bullet = new Bullet(this.x, this.y, dx, dy, 2);
      this.world.enemyBullets.push(bullet);
    }
  };
}
