class World {
  constructor(width, height) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.player = null;
    this.floorHeight = height - 100;
    this.enemies = [];
    this.clock = 0;
    this.init();
  }

  init = () => {
    ctx.canvas.width = this.width;
    ctx.canvas.height = this.height;
    this.y = 496 * 4;
    this.player = new Player(ctx, this.width, this.floorHeight, {
      width: this.width,
      height: this.height
    });
  };

  setBackground = () => {
    var bg = new Image();
    bg.src = './assets/area1_bg.png';
    bg.onload = () => {
      ctx;
      ctx.translate(this.x, -this.y);
      ctx.drawImage(bg, 0, 0, IMAGESIZE.x, IMAGESIZE.y);
    };
  };

  generateEnemy = () => {
    let enemy = new Enemy(ctx, this.width, this.floorHeight, 'right');
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
    // this.player.update();
    // this.updateEnemy();
    // if (this.clock % 50 == 0) {
    //   this.generateEnemy();
    // }
    this.clock++;
  };

  render = () => {
    ctx.clearRect(0, 0, this.width, this.height);
    this.setBackground();
    // this.player.render();
    // if (this.enemies.length > 0) {
    //   this.enemies.forEach(enemy => {
    //     enemy.draw();
    //   });
    // }
  };
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
