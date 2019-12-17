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
    this.viewportY = IMAGESIZE.y - SCREEN.height;
    this.screenY = IMAGESIZE.y - SCREEN.height;
    this.screenWidth = SCREEN.width;
    this.screenHeight = SCREEN.height;
    //entire map
    this.x = 0;
    this.y = IMAGESIZE.y;
    this.level = level;
    this.background = null;
    this.player = null;
    this.player2 = null;
    this.enemies = [];
    this.enemyBullets = [];
    this.clock = 0;
    this.loaded = false;
    this.shiftCycle = 3.1;
    this.players = 2;
    this.gameOver = false;
    this.reachedBoss = false;
  }

  init = background => {
    this.player = new Player(this, controller, 100, true);
    // if (this.players == 2) {
    // this.player2 = new Player(this, controller2, 200);
    // document.addEventListener('keydown', controller2.keyListener);
    // document.addEventListener('keyup', controller2.keyListener);
    // }

    this.background = background;
    this.ground = new GroundBoundary();
  };

  setBackground = () => {
    ctx.save();
    ctx.beginPath();
    ctx.translate(-this.x * SCALE, -this.screenY * SCALE); //translates to bottom
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
    let enemyLeft = new Soldier('left');
    this.enemies.push(enemyLeft);
    // let enemyRight = new Soldier('right');
    // this.enemies.push(enemyRight);
  };

  updateEnemy = () => {
    if (this.enemies.length > 0) {
      this.enemies.forEach(enemy => {
        enemy.update({
          worldShift: this.dx,
          playerX: this.player.x + this.player.width / 2,
          playerY: this.player.y + this.player.height / 2
        });
        this.ground.checkGroundBoundary(this, enemy);
        enemy.checkScreenBoundary();
      });
    }
    this.enemies = this.enemies.filter(enemy => enemy.alive);
    this.enemies = this.enemies.filter(enemy => enemy.inVision);

    this.enemyBullets.forEach(x => {
      x.move(this.dx);
      this.ground.checkGroundBoundary(this, x);
    });
    this.enemyBullets = this.enemyBullets.filter(bullet => !bullet.destroyed);
  };

  manageWorldView = () => {
    if (
      this.x >= 0 &&
      this.x + this.screenWidth <= IMAGESIZE.x - this.screenWidth
    ) {
      if (this.player.x + this.player.width / 2 > this.screenWidth / 2) {
        if (this.player.dx > 0) {
          this.dx = this.player.dx;
          this.player.x -= this.dx;
          // this.player2.x -= this.dx;
          this.x += this.dx;
        }
      } else {
        this.dx = 0;
      }
    }
  };

  shiftFunction() {
    if (this.shift) {
      this.screenY -= 10;
      if (this.screenY < this.y - this.screenHeight * this.shiftCycle) {
        this.shift = false;
        this.shiftCycle += 0.56;
      }
    }
  }

  checkCollisions = () => {
    this.player.checkCollision([...this.enemies, ...this.enemyBullets]);
    if (this.player.bullets.length > 0) {
      this.player.bullets.forEach(bullet => {
        this.ground.checkGroundBoundary(this, bullet);
        bullet.checkCollision(this.enemies);
      });
    }
  };

  checkIfAlive = () => {
    if (!this.player.state.alive) {
      if (this.player.lives) {
        if (!this.player.state.revive) {
          this.player.state.revive = true;
          setTimeout(() => {
            this.player.reset();
          }, 3000);
        }
      } else {
        this.gameOver = true;
      }
    }
  };

  update = () => {
    //update player position and create bullets if button pressed

    this.player.update();
    this.ground.checkGroundBoundary(this, this.player);
    this.player.moveBullets();
    this.checkCollisions();
    this.updateEnemy();
    if (this.clock % 200 == 0) {
      this.generateEnemy();
      // let enemy2 = new Sniper(this);
      // enemy2.setPosition(432, this.screenHeight - 165);
      // this.enemies.push(enemy2);
      // let enemy = new SBSniper(this);
      // enemy.setPosition(1286, this.screenHeight - 200);
      // this.enemies.push(enemy);
      // let enemy1 = new MechGun(this);
      // enemy1.setPosition(2432, this.screenHeight - 462);
      // this.enemies.push(enemy1);
    }
    this.manageWorldView();
    this.shiftFunction();
    this.clock++;
    this.checkIfAlive();
  };

  render = () => {
    ctx.clearRect(0, 0, this.screenWidth * 2, this.screenHeight * 2);
    this.setBackground();
    this.player.render();
    // this.ground.draw(this);
    if (this.enemies.length > 0) {
      this.enemies.forEach(enemy => {
        enemy.draw();
      });
    }
    if (this.enemyBullets.length > 0) {
      this.enemyBullets.forEach(bullet => {
        bullet.draw();
      });
    }
  };
}
