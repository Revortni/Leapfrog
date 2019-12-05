const degToRad = Math.PI / 180;
class Helix {
  constructor(parent, width, height) {
    this.width = width;
    this.height = height;
    this.parent = parent;
    this.context = null;
    this.circleArrCos = [];
    this.circleArrSin = [];
    this.time = 30;
    this.left = 100;
    this.top = 160;
    this.d = 40;
    this.row = 8;
    this.column = 16;
    this.degInterval = 180 / this.column;
  }

  init = () => {
    let canvas = document.createElement('canvas');
    canvas.height = this.height;
    canvas.width = this.width;
    this.element = canvas;
    this.context = canvas.getContext('2d');
    this.parent.appendChild(canvas);
    this.setBackground();
    for (let i = 0; i < this.row; i++) {
      this.circleArrCos[i] = [];
      for (let j = 0; j < this.column; j++) {
        let circle = new Circle(
          this.context,
          j * this.d + this.left,
          i * this.d + this.top,
          5
        );
        circle.draw();
        this.circleArrCos[i].push(circle);
      }
    }
    for (let i = 0; i < this.row; i++) {
      this.circleArrSin[i] = [];
      for (let j = 0; j < this.column; j++) {
        let circle = new Circle(
          this.context,
          j * this.d + this.left,
          i * this.d + this.top,
          5
        );
        circle.draw();
        this.circleArrSin[i].push(circle);
      }
    }
    setInterval(() => {
      this.animate();
    }, 100);
  };

  setBackground = () => {
    let background = this.element.getContext('2d');
    background.fillStyle = '#fff';
    background.fillRect(0, 0, this.width, this.height);
  };

  animate() {
    // this.context.clearRect(0, 0, this.width, this.height);
    this.setBackground();
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.column; j++) {
        let factorCos = Math.cos(
          (j + i + this.time) * this.degInterval * degToRad
        );
        this.circleArrCos[i][j].update(
          this.top * (factorCos + 1) + this.top,
          10 * (factorCos + 1)
        );
        this.circleArrCos[i][j].draw();
        let factorSin = Math.sin(
          (j + i + this.time) * this.degInterval * degToRad
        );
        this.circleArrSin[i][j].update(
          this.top * (factorSin + 1) + this.top,
          10 * (2 - (factorSin + 1))
        );
        this.circleArrSin[i][j].draw();
      }
    }
    this.time++;
  }
}

class Circle {
  constructor(context, x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.context = context;
  }
  draw = () => {
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    this.context.fillStyle = 'skyblue';
    this.context.fill();
  };
  update = (y, r) => {
    this.y = y;
    this.r = r;
  };
}
