class Gun {
  constructor() {
    this.type = 0;
    this.time = 1;
    this.reloading = false;
  }

  upgrade = () => {};

  reset = () => {};

  shoot = (x, y, dx, dy, jumping) => {
    if (controller.shoot && !this.reloading) {
      this.reloading = true;
      return new Bullet(x, y, dx, dy, jumping);
    }
    return null;
  };

  reload = () => {
    //reload is true after reloadtime has passed
    if (this.reloading) {
      this.time++;
      if (this.time % playerValues.reloadTime == 0) {
        this.reloading = false;
        this.time = 1;
      }
    }
  };
}
