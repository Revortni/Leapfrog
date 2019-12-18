class Gun {
  constructor(controller, speed) {
    this.type = 0;
    this.time = 1;
    this.reloading = false;
    this.reloadTime = playerValues.reloadTime;
    this.speed = speed || 2;
    this.controller = controller;
  }

  upgrade = () => {};

  reset = () => {};

  shoot = (x, y, dx, dy) => {
    if (this.controller.shoot && !this.reloading) {
      this.reloading = true;
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
