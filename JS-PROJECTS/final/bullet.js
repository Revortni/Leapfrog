class Bullet {
  constructor(x, y, dx, dy, jumping) {
    this.x = x;
    this.y = y;
    this.jumping = jumping;
    this.dx = dx;
    this.dy = dy;
    this.speed = 5;
    this.r = 2;
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
    let c = ctx;
    let img = new Image();
    img.src = './assets/bullet1.png';
    c.beginPath();
    c.drawImage(
      img,
      this.x * SCALE,
      this.y * SCALE,
      2 * this.r * SCALE,
      2 * this.r * SCALE
    );
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
