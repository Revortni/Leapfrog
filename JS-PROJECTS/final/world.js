class World {
  constructor(width, height, context) {
    this.width = width;
    this.height = height;
    this.context = context;
    this.player = null;
    this.init();
  }

  init = () => {
    this.context.canvas.width = this.width;
    this.context.canvas.height = this.height;
    this.player = new Player(this.context, this.width, this.height - 100, {
      width: this.width,
      height: this.height
    });
  };

  setBackground() {
    var bg = new Image();
    bg.src = './assets/area1_bg.png';
    bg.onload = () => {
      this.context.drawImage(
        bg,
        0,
        468,
        300,
        234,
        0,
        0,
        this.width,
        this.height
      );
    };
  }

  update = () => {
    //update player position and create bullets if button pressed
    this.player.update();
  };

  render = () => {
    this.context.clearRect(0, 0, this.width, this.height);
    // this.setBackground();
    this.player.render();
  };
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
