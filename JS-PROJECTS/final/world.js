class World {
  constructor(level) {
    this.x = 0;
    this.y = IMAGESIZE.y - SCREEN.height;
    this.width = SCREEN.width;
    this.height = SCREEN.height;
    this.background = null;
    this.player = null;
    this.boundary = this.height - worldValues[level].mid;
    this.enemies = [];
    this.clock = 0;
    this.loaded = false;
  }

  init = background => {
    this.player = new Player(this.width, this.boundary, {
      width: this.width,
      height: this.height
    });
    this.background = background;
  };

  setBackground = () => {
    ctx.save();
    ctx.beginPath();
    ctx.translate(-this.x * SCALE, -this.y * SCALE);
    ctx.drawImage(
      this.background,
      0,
      0,
      IMAGESIZE.x * SCALE,
      IMAGESIZE.y * SCALE
    );
    ctx.restore();
  };

  generateEnemy = () => {
    let enemy = new Enemy(this.width, this.boundary, 'right');
    this.enemies.push(enemy);
  };

  updateEnemy = () => {
    if (this.enemies.length > 0) {
      this.enemies.forEach(enemy => {
        enemy.update();
        enemy.checkBoundary();
        if (this.player.bullets.length > 0) {
          enemy.checkCollision(this.player.bullets);
        }
      });
    }
    this.enemies = this.enemies.filter(enemy => enemy.alive);
    this.enemies = this.enemies.filter(enemy => enemy.inVision);
  };

  manageWorldView = () => {
    if (this.x >= 0 && this.x + SCREEN.width <= IMAGESIZE.x) {
      if (this.player.x + this.player.width / 2 > SCREEN.width / 2) {
        this.x += this.player.dx / playerValues.frictionX;
        this.player.x -= this.player.dx / playerValues.frictionX;
      }
    }
  };

  update = () => {
    //update player position and create bullets if button pressed
    this.player.update();
    this.manageWorldView();
    this.updateEnemy();
    if (this.clock % 50 == 0) {
      this.generateEnemy();
    }
    this.clock++;
  };

  render = () => {
    ctx.clearRect(0, 0, this.width, this.height);
    this.setBackground();
    this.player.render();
    if (this.enemies.length > 0) {
      this.enemies.forEach(enemy => {
        enemy.draw();
      });
    }
  };
}
