class Gun {
  constructor(speed) {
    this.type = 0;
    this.time = 1;
    this.reloading = false;
    this.reloadTime = playerValues.reloadTime;
    this.speed = speed || 2;
  }

  upgrade = () => {};

  reset = () => {};

  shoot = (x, y, dx, dy, enemy = false) => {
    if ((controller.shoot || enemy) && !this.reloading) {
      this.reloading = true;
      return new Bullet(x, y, dx, dy, this.speed);
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
