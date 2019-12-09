class Bullet {
  constructor(context, x, y, dx, dy, jumping) {
    this.x = x;
    this.y = y;
    this.jumping = jumping;
    this.dx = dx;
    this.dy = dy;
    this.speed = 10;
    this.r = 8;
    this.context = context;
    this.destroyed = false;
    this.init();
  }

  init() {
    if (this.dy == 1 && this.jumping) {
      //if jumping and shooting down
      this.dx = 0;
    }
  }

  move() {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
  }

  draw() {
    let c = this.context;
    let img = new Image();
    img.src = './assets/bullet.png';
    c.beginPath();
    c.drawImage(img, this.x, this.y, 2 * this.r, 2 * this.r);
    c.closePath();
  }

  checkBoundary = () => {
    //move bullets and bulletBoundaryCheck function
    if (
      this.x > this.maxWidth ||
      this.x < 0 ||
      this.y < 0 ||
      this.y > this.maxHeight
    ) {
      this.destroyed = true;
    }
  };
}
