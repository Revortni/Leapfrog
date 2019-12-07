class Bullet {
  constructor(context, x, y, dx, dy, jumping) {
    this.x = x;
    this.y = y;
    this.jumping = jumping;
    this.dx = dx;
    this.dy = dy;
    this.speed = 50;
    this.r = 10;
    this.context = context;
    this.init();
  }

  init() {
    //if on ground and shooting down
    if (!this.jumping && this.dy == 1 && this.dx) {
      this.y += 10;
      this.dy = 0;
    } else if (this.dy == 1) {
      //if jumping and shooting down
      this.dx = 0;
    }
  }

  move() {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
    this.draw();
  }

  draw() {
    let c = this.context;
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    c.fillStyle = '#000';
    c.fill();
  }
}
