const worldValues = {
  '1': {
    mid: 56,
    bot: 24,
    slope: 27,
    shiftRate: 1
  }
};
class World {
  constructor(level) {
    //viewport
    this.screenX = 0;
    this.screenY = IMAGESIZE.y - SCREEN.height;
    this.screenWidth = SCREEN.width;
    this.screenHeight = SCREEN.height;
    //entire map
    this.x = 40;
    this.y = IMAGESIZE.y;
    this.dy = 0;
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
    this.defeatedBoss = false;
    this.counter = 0;
    this.spawnPoint = 1;
    this.pcount = 0;
  }

  init = (background, count) => {
    this.player = new Player(this, controller, 100, true);

    if (count) {
      this.pcount = 1;
      this.player2 = new Player(this, controller2, 200, false);
      document.addEventListener('keydown', controller2.keyListener);
      document.addEventListener('keyup', controller2.keyListener);
    }

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

  generateSoilders = () => {
    if (this.spawnPoint == 1) {
      if (Math.random() > 0.5) {
        let enemyLeft = new Soldier(this, 'left');
        this.enemies.push(enemyLeft);
      }
      let enemyRight = new Soldier(this, 'right');
      this.enemies.push(enemyRight);
    } else {
      let enemy = new Soldier(this, 'fixed', this.spawnPoint);
      this.enemies.push(enemy);
    }
    this.counter++;
    if (this.counter > 4 || this.enemies.length > 8) {
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
      x.move(this.dx, this.dy);
      this.ground.checkGroundBoundary(this, x);
    });
    this.enemyBullets = this.enemyBullets.filter(bullet => !bullet.destroyed);
  };

  manageWorldView = dx => {
    let offset = this.defeatedBoss ? 0 : 256;
    if (this.x >= 0 && this.x + this.screenWidth <= IMAGESIZE.x - offset) {
      this.x += dx;
      this.dx = dx;
      if (this.pcount) {
        this.player2.x -= dx;
      }
    }
    if (this.x + this.screenWidth >= IMAGESIZE.x - offset) {
      this.reachedBoss = true;
    }
    if (this.defeatedBoss) {
      if (this.x + this.screenWidth <= IMAGESIZE.x) {
        this.x += 2;
      }
      if (this.player.x + this.x >= 3500) {
        this.end = true;
      }
    }
  };

  shiftFunction() {
    this.dy = 0;
    if (this.shift) {
      this.screenY -= worldValues[this.level].shiftRate;
      this.dy = 1;
      if (this.screenY < this.y - this.screenHeight * this.shiftCycle) {
        this.shift = false;
        this.shiftCycle += 0.56;
      }
    }
  }

  destroyAllInVision = () => {
    this.enemies.forEach(enemy => {
      enemy.setKilled();
    });
  };

  capsuleHandler = () => {
    if (this.capsule.picked) {
      if (this.capsule.type == 'destroy') {
        this.destroyAllInVision();
      }
      this.capsule = null;
    }
  };

  checkCollisions = player => {
    player.checkCollision([...this.enemies, ...this.enemyBullets]);
    if (player.bullets.length > 0) {
      player.bullets.forEach(bullet => {
        this.ground.checkGroundBoundary(this, bullet);
        // get score points
        let points = bullet.checkCollision(this.enemies);
        player.score += points;
      });
    }
  };

  respawnHandler = () => {
    if (!this.player.state.alive) {
      if (this.player.lives) {
        if (!this.player.state.revive) {
          this.player.state.revive = true;
          setTimeout(() => {
            this.player.reset();
          }, 4000);
        }
      } else {
        setTimeout(() => {
          this.gameOver = true;
        }, 4000);
      }
    } else if (this.pcount) {
      if (!this.player2.state.alive) {
        if (this.player2.lives) {
          if (!this.player2.state.revive) {
            this.player2.state.revive = true;
            setTimeout(() => {
              this.player2.reset();
            }, 4000);
          }
        }
      }
    } else {
      setTimeout(() => {
        this.gameOver = true;
      }, 4000);
    }
  };

  capsuleUpdate = () => {
    if (this.capsule) {
      this.capsule.update();
      if (this.player.bullets.length) {
        this.capsule.checkCollision(this.player.bullets);
      }
      if (this.pcount) {
        if (this.player2.bullets.length) {
          this.capsule.checkCollision(this.player2.bullets);
        }
      }
    }
    if (this.capsule && this.capsule.destroyed) {
      this.ground.checkGroundBoundary(this, this.capsule);
      this.player.checkCollision([this.capsule]);
      if (this.pcount) {
        this.player2.checkCollision([this.capsule]);
      }
      this.capsuleHandler();
    }
  };

  spawnUpdate = () => {
    let spawn = this.spawnEnemies.checkTriggerPosition(this.x + this.player.x);

    this.spawnEnemies.createEnemy(this);
    if (spawn) {
      this.spawn = true;
      this.spawnPoint = spawn;
      this.counter = 0;
      if (!this.capsule) {
        this.capsule = new Capsule(this);
      }
    }
    if (this.clock % 30 == 0 && this.spawn) {
      this.generateSoilders();
    }
  };

  bossBattleInit = () => {
    this.boss = new Boss(this);
    this.enemies.push(this.boss);
  };

  bossBattleCheck = () => {
    if (this.reachedBoss && this.enemies.length == 0 && !this.defeatedBoss) {
      this.bossBattleInit();
    }
    if (this.reachedBoss && this.boss && this.boss.defeated) {
      setTimeout(() => {
        this.boss.cleanup();
        this.destroyAllInVision();
        this.defeatedBoss = true;
      }, 2000);
    }
  };

  update = () => {
    //update player position and create bullets if button pressed

    this.player.update();
    this.ground.checkGroundBoundary(this, this.player);
    this.player.moveBullets();
    this.checkCollisions(this.player);

    if (this.pcount) {
      this.player2.update();
      this.ground.checkGroundBoundary(this, this.player2);
      this.player2.moveBullets();
      this.checkCollisions(this.player2);
    }

    this.capsuleUpdate();
    this.updateEnemy();
    //world shift
    this.shiftFunction();

    //check if player is alive
    this.respawnHandler();

    this.spawnUpdate();

    this.bossBattleCheck();

    this.clock++;
  };

  render = () => {
    ctx.clearRect(0, 0, this.screenWidth * 2, this.screenHeight * 2);
    this.setBackground();
    //powerup capsule
    if (this.capsule) {
      this.capsule.draw();
    }
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

    this.player.render();
    if (this.pcount) {
      this.player2.render();
    }
  };
}
