class LastShooter extends Sniper {
  constructor(world) {
    super(world);
    this.width = 16;
    this.height = 31;
    this.image = gameAssets.lastsniper.img;
    this.hp = 1;
    this.reloadTime = 40;
  }
}
