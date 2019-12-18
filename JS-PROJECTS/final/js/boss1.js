class Helicopter extends Enemy {
  constructor(world) {
    this.width = 19;
    this.height = 33;
    this.life = 15;
    this.y = 30;
    this.x = 3085;
    this.image = gameAssets.boss;
    this.world = world;
  }

  update = () => {};

  draw = () => {
    ctx.beginPath();
    ctx.drawImage(this.image.img, this.x * SCALE, this.y * SCALE);
    ctx.strokeRect(
      this.x * SCALE,
      this.y * SCALE,
      this.image.w * SCALE,
      this.image.h * SCALE
    );
    ctx.closePath();
  };
}
