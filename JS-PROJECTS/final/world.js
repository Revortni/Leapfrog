class World {
  constructor(width, height, context) {
    this.width = width;
    this.height = height;
    this.context = context;
    this.player = null;
    this.floorHeight = height - 100;
    this.enemies = [];
    this.clock = 1;
    this.init();
  }

  init = () => {
    this.context.canvas.width = this.width;
    this.context.canvas.height = this.height;
    this.player = new Player(this.context, this.width, this.floorHeight, {
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

  generateEnemy = () => {
    let enemy = new Enemy(this.context, this.width, this.floorHeight, 'right');
    this.enemies.push(enemy);
  };

  updateEnemy = () => {
    if (this.enemies.length > 0) {
      this.enemies.forEach(enemy => {
        enemy.update();
        enemy.checkBoundary();
      });
    }
    this.enemies = this.enemies.filter(enemy => enemy.alive);
  };

  update = () => {
    //update player position and create bullets if button pressed
    this.player.update();
    this.updateEnemy();
    if (this.clock % 50 == 0) {
      this.generateEnemy();
    }
    this.clock++;
  };

  render = () => {
    this.context.clearRect(0, 0, this.width, this.height);
    // this.setBackground();
    this.player.render();
    if (this.enemies.length > 0) {
      this.enemies.forEach(enemy => {
        enemy.draw();
      });
    }
  };
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
