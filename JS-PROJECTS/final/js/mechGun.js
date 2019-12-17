class MechGun extends Sniper {
  constructor(world) {
    super(world);
    this.width = 32;
    this.height = 48;
    this.image = gameAssets.mechgun.img;
    this.hp = 5;
    this.reloadTime = 40;
  }
}
