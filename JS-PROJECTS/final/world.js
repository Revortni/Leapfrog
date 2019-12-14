const worldValues = {
  '1': {
    mid: 56,
    bot: 24,
    slope: 27
  }
};
class World {
  constructor(level) {
    //viewport
    this.screenX = 0;
    this.screenY = 0;
    this.screenWidth = SCREEN.width;
    this.screenHeight = SCREEN.height;
    //entire map
    this.x = 500;
    this.y = IMAGESIZE.y - SCREEN.height;
    this.viewportY = IMAGESIZE.y - SCREEN.height;
    this.level = level;
    this.background = null;
    this.player = null;
    this.enemies = [];
    this.clock = 0;
    this.loaded = false;
  }

  init = background => {
    this.player = new Player(this.x, this.y, this.screenWidth, this);
    this.background = background;
    this.ground = new GroundBoundary();
  };

  setBackground = () => {
    ctx.save();
    ctx.beginPath();
    ctx.translate(-this.x * SCALE, -this.viewportY * SCALE); //translates to bottom
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
    let enemyLeft = new Enemy(this.screenWidth, 'left');
    let enemyRight = new Enemy(this.screenWidth, 'right');
    this.enemies.push(enemyLeft);
    this.enemies.push(enemyRight);
  };

  updateEnemy = () => {
    if (this.enemies.length > 0) {
      this.enemies.forEach(enemy => {
        enemy.update(this.dx);
        this.ground.checkGroundBoundary(this, enemy);
        enemy.checkScreenBoundary();
        if (this.player.bullets.length > 0) {
          enemy.checkCollision(this.player.bullets);
        }
      });
    }
    this.enemies = this.enemies.filter(enemy => enemy.alive);
    this.enemies = this.enemies.filter(enemy => enemy.inVision);
  };

  manageWorldView = () => {
    if (this.x >= 0 && this.x + this.screenWidth <= IMAGESIZE.x) {
      if (this.player.x + this.player.width / 2 > this.screenWidth / 2) {
        if (this.player.dx > 0) {
          this.dx = this.player.dx;
          this.player.x -= this.player.dx;
          this.x += this.dx;
        }
      } else {
        this.dx = 0;
      }
    }
  };

  update = () => {
    //update player position and create bullets if button pressed
    this.player.update();
    this.ground.checkGroundBoundary(this, this.player);
    this.manageWorldView();
    this.updateEnemy();
    if (this.clock % 100 == 0) {
      this.generateEnemy();
    }

    this.clock++;
  };

  render = () => {
    ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
    this.setBackground();
    this.player.render();
    this.ground.draw(this);
    if (this.enemies.length > 0) {
      this.enemies.forEach(enemy => {
        enemy.draw();
      });
    }
  };
}
