class Gun {
  constructor(speed) {
    this.type = 0;
    this.time = 1;
    this.reloading = false;
    this.reloadTime = playerValues.reloadTime;
    this.speed = speed || 2;
    this.count = 0;
    this.bulletCount = 1;
  }

  upgrade = () => {};

  reset = () => {};

  shoot = (x, y, dx, dy) => {
    if (controller.shoot && !this.reloading) {
      this.count++;
      if (this.count > this.bulletCount) {
        this.reloading = true;
        this.count = 0;
      }
      return new Bullet(x, y, dx, dy, this.speed, this.bulletImage);
    }
    return null;
  };

  reload = () => {
    //reload is true after reloadtime has passed
    if (this.reloading) {
      this.time++;
      if (this.time % this.reloadTime == 0) {
        this.reloading = false;
        this.time = 1;
      }
    }
  };
}
