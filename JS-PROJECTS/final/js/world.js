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
    this.x = 40;
    this.y = IMAGESIZE.y;
    this.level = level;
    this.background = null;
    this.player = null;
    this.player2 = null;
    this.enemies = [];
    this.enemyBullets = [];
    this.clock = 0;
    this.loaded = false;
    this.shiftCycle = 1.5;
    this.players = 2;
    this.gameOver = false;
    this.reachedBoss = false;
    this.counter = 0;
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
    this.spawnEnemies = new SpawnEnemies(this);
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
    if (Math.random() > 0.5) {
      let enemyLeft = new Soldier(this, 'left');
      this.enemies.push(enemyLeft);
    }
    let enemyRight = new Soldier(this, 'right');
    this.enemies.push(enemyRight);
    this.counter++;
    if (this.counter > 5) {
      this.counter = 0;
      this.spawn = false;
    }
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
    // if (
    //   this.x >= 0 &&
    //   this.x + this.screenWidth <= IMAGESIZE.x - this.screenWidth
    // ) {
    //   if (this.player.x + this.player.width / 2 > this.screenWidth / 2) {
    //     if (this.player.dx > 0) {
    //       this.dx = this.player.dx + 0.1;
    //       this.player.x -= this.dx + 0.1;
    //       // this.player2.x -= this.dx;
    //       this.x += this.dx;
    //     }
    //   } else {
    //     this.dx = 0;
    //   }
    // }
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
          }, 4000);
        }
      } else {
        this.gameOver = true;
      }
    }
  };

  spawnUpdate = () => {
    let spawn = this.spawnEnemies.checkTriggerPosition(this.x + this.player.x);
    this.spawnEnemies.createEnemy(this);
    if (spawn && Math.random() > 0.5) {
      this.spawn = true;
      this.capsule = new Capsule();
    }
    if (this.clock % 50 == 0 && this.spawn) {
      this.generateEnemy();
    }
  };

  update = () => {
    //update player position and create bullets if button pressed
    this.player.update();
    this.ground.checkGroundBoundary(this, this.player);
    this.player.moveBullets();
    this.checkCollisions();

    this.updateEnemy();

    //world shift
    this.manageWorldView();
    this.shiftFunction();

    //check if player is alive
    this.checkIfAlive();

    if (this.capsule) {
      this.capsule.update();
      if (this.player.bullets.length) {
        this.capsule.checkCollision(this.player.bullets);
      }
    }

    this.spawnUpdate();
    this.clock++;
  };

  render = () => {
    ctx.clearRect(0, 0, this.screenWidth * 2, this.screenHeight * 2);
    this.setBackground();
    if (this.enemyBullets.length > 0) {
      this.enemyBullets.forEach(bullet => {
        bullet.draw();
      });
    }
    if (this.enemies.length > 0) {
      this.enemies.forEach(enemy => {
        enemy.draw();
      });
    }
    //powerup capsule
    if (this.capsule) {
      this.capsule.draw();
    }
    this.player.render();
    this.ground.draw(this);
  };
}
