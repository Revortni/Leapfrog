const values = {
  dx: 5,
  dy: 0,
  gravity: 1.5,
  friction: 0.9
};

class Enemy {
  constructor(context, x, y, maxWidth, maxHeight) {
    this.width = 50;
    this.height = 50;
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.context = context;
    this.alive = null;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this.init();
  }

  init = () => {
    /*initialize event listeners for buttons */
    this.x = this.maxWidth;
    this.dx = -values.dx;
    this.dy = values.dy;
    this.reset();
  };

  reset = () => {};

  update = () => {
    //add velocity for movement in x y
    this.x += this.dx;
    this.y += this.dy;
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
