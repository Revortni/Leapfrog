class Gun {
  constructor(controller, speed) {
    this.time = 1;
    this.reloading = false;
    this.reloadTime = playerValues.reloadTime;
    this.speed = speed || 5;
    this.size = 2;
    this.bulletImage = gameAssets.bullet.img;
    this.controller = controller;
  }

  reset = () => {
    this.speed = 5;
    this.size = 2;
    this.bulletImage = gameAssets.bullet.img;
    this.reloadTime = playerValues.reloadTime;
    this.reloading = false;
    this.time = 1;
  };

  upgrade = ({ image, size, reload }) => {
    this.bulletImage = image;
    this.size = size;
    this.reloadTime = reload;
  };

  shoot = (x, y, dx, dy) => {
    if (this.controller.shoot && !this.reloading) {
      this.reloading = true;
      return new Bullet(x, y, dx, dy, this.speed, this.bulletImage, this.size);
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
