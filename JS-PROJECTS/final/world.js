const worldValues = {
  '1': {
    mid: 56,
    bot: 24,
    slope: 27
  }
};
class World {
  constructor(level) {
    this.x = 0;
    this.level = level;
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
    this.ground = new GroundBoundary();
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
    let enemyLeft = new Enemy(this.width, this.boundary, 'left');
    let enemyRight = new Enemy(this.width, this.boundary, 'right');
    this.enemies.push(enemyLeft);
    this.enemies.push(enemyRight);
  };

  updateEnemy = () => {
    if (this.enemies.length > 0) {
      this.enemies.forEach(enemy => {
        enemy.update();
        enemy.checkBoundary();
        this.ground.boundaryFunction()[1](this, enemy);
        this.boundary;
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
    this.ground.boundaryFunction()[1](this, this.player);
    // let playerPosition = this.x + this.player.x + this.player.width;
    // if (playerPosition >= 834 && playerPosition <= 834 + 250) {
    //   this.groundBoundary3();
    // } else {
    //   this.groundBoundary1();
    // }
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
