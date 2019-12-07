class Game {
  constructor(width, height, parentElement) {
    this.width = width;
    this.height = height;
    this.parentElement = parentElement;
    this.context = this.parentElement.getContext('2d');
    this.player = null;
    this.clock = 0;
  }

  init = () => {
    this.context.canvas.width = this.width;
    this.context.canvas.height = this.height;
    this.setBackground();
    this.player = this.createPlayer();
    this.startGame();
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

  createPlayer = () => {
    let player = new Player(this.context, this.width, this.height - 100, {
      width: this.width,
      height: this.height
    });
    return player;
  };

  update = () => {
    //update player position and create bullets if button pressed
    this.player.update(this.clock);
    //bullet generates every 2 seconds
    if (!this.player.shootFlag) {
      this.clock++;
    }
    if (this.clock % 10 == 0) {
      this.player.shootFlag = true;
    }
  };

  render = () => {
    // this.setBackground();
    this.player.draw();
  };

  startGame = () => {
    setInterval(() => {
      this.context.clearRect(0, 0, this.width, this.height);
      this.update();
      this.render();
    }, 50);
  };
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
