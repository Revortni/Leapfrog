const values = {
  dx: 5,
  dy: 50,
  gravity: 1.5,
  friction: 0.9
};

class Enemy {
  constructor(context, x, y, maxWidth, maxHeight) {
    this.width = 50;
    this.height = 50;
    this.x = maxWidth;
    this.dx = 0;
    this.y = maxHeight - this.height;
    this.dy = 0;
    this.context = context;
    this.alive = null;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this.jumping = true;
    this.bullets = [];
    this.shootFlag = true;
    this.init();
  }

  init = () => {
    /*initialize event listeners for buttons */
    this.dx = values.dx;
    this.dy = values.dy;
    this.reset();
  };

  reset = () => {};

  update = () => {
    //add velocity for movement in x y
    this.x += this.dx;
    this.y += this.dy;

    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x + this.width > this.maxWidth) {
      this.x = this.maxWidth - this.width;
    }

    //shooting function
    this.shoot();

    //bulletBoundary function
    if (this.bullets.length) {
      let removeBullet = [];
      this.bullets.forEach((bullet, index) => {
        bullet.move();
        if (
          bullet.x > this.maxWidth ||
          bullet.x < 0 ||
          bullet.y < 0 ||
          bullet.y > this.maxHeight
        ) {
          removeBullet.push(index);
        }
      });
      this.bullets.filter((val, index) => removeBullet.includes(index));
    }
  };

  shoot = () => {
    let x = this.x + this.width / 2;
    let y = this.y + this.height / 2;
    let bullet = new Bullet(
      this.context,
      x,
      y,
      this.shootDirection.x,
      this.shootDirection.y,
      this.jumping
    );
    this.bullets.push(bullet);
    this.shootFlag = false;

    return;
  };

  draw = () => {
    let c = this.context;
    c.beginPath();
    c.rect(this.x, this.y, this.width, this.height);
    c.fillStyle = '#f00';
    c.fill();
  };
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
