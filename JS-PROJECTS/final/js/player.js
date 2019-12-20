const playerValues = {
  dx: 2,
  dy: 4,
  gravity: 0.4,
  width: 23,
  height: 34,
  crouchWidth: 32,
  crouchHeight: 15,
  jumpSize: 17,
  reloadTime: 14,
  jumpDist: 8
};

class Player {
  constructor(world, controller, x, main) {
    this.width = 0;
    this.height = 0;
    this.x = x || 100;
    this.dx = 0;
    this.y = 0;
    this.dy = 0;
    this.state = null;
    this.bullets = [];
    this.sprite = null;
    this.image = null;
    this.gun = null;
    this.world = world;
    this.lives = 3;
    this.controller = controller;
    this.frame = 0;
    this.isMain = main || false;
    this.isFirst = main;
    this.image = this.isMain ? gameAssets.player1 : gameAssets.player2;
    this.clock = 1;
    this.invert = 1;
    this.score = 0;
    this.gameover = false;
    this.init();
  }

  init = () => {
    this.intro = true;
    this.gun = new Gun(this.controller, 8);
    this.reset();
  };

  reset = () => {
    this.state = {
      alive: true,
      revive: false,
      facingLeft: false
    };
    this.setDeadFlag = false;
    this.y = 20;
    this.dx = playerValues.dx;
    this.dy = playerValues.dy;
    this.width = playerValues.width;
    this.height = playerValues.height;
    this.jumping = false;
    this.crouch = false;
    this.killable = false;
    this.opacity = 0.7;
    setTimeout(() => {
      this.opacity = 1;
      this.killable = true;
    }, 3000);
    this.directionFacing = ANIMATE.standing;
    this.shootDirection = { x: 1, y: 0 };
  };

  controllerHandler = () => {
    this.dx = 0;
    if (this.controller.jump && this.jumping == false) {
      this.dy = 0;
      this.dy -= playerValues.jumpDist;
      this.jumping = true;
      this.width = playerValues.jumpSize;
      this.height = playerValues.jumpSize;
    }

    if (this.controller.up) {
      this.state.sprite = ANIMATE.up;
      this.shootDirection.x = 0;
      this.shootDirection.y = -1;
    }

    if (this.controller.down) {
      this.state.sprite = ANIMATE.down;
      this.shootDirection.x *= this.jumping ? 0 : 1;
      this.shootDirection.y = 1;
    }

    if (
      !this.controller.left &&
      !this.controller.down &&
      !this.controller.right &&
      !this.controller.up &&
      !this.jumping
    ) {
      this.frame = 0;
      this.state.sprite = ANIMATE.standing;
    }

    if (this.controller.left) {
      this.dx = -playerValues.dx;
      this.invert = -1;
      this.shootDirection.x = -1;
      this.state.facingLeft = true;
      this.state.sprite = ANIMATE.right;
    }
    if (this.controller.right) {
      this.dx = playerValues.dx;
      this.invert = 1;
      this.shootDirection.x = 1;
      this.state.facingLeft = false;
      this.state.sprite = ANIMATE.right;
    }

    if ((this.controller.up && this.controller.right) || this.controller.left) {
      this.state.sprite = ANIMATE.upRight;
    }
    if (this.jumping) {
      this.state.sprite = ANIMATE.jump;
    } else if (this.controller.up) {
      this.width = 14;
      this.height = playerValues.height;
    } else {
      this.width = playerValues.width;
      this.height = playerValues.height;
    }
    if (
      !this.jumping &&
      this.controller.down &&
      !(this.controller.right || this.controller.left)
    ) {
      this.frame = 0;
      this.y = this.crouch
        ? this.y
        : this.y + this.height - playerValues.crouchHeight;
      this.crouch = true;
      this.width = playerValues.crouchWidth;
      this.height = playerValues.crouchHeight;
      this.shootDirection.y = 0;
    } else if (this.crouch) {
      this.crouch = false;
      this.width = playerValues.width;
      this.height = playerValues.height;
      this.y = this.y + this.height - this.width;
    }
  };

  updateFrame = () => {
    if (this.clock % 3 == 0 && this.state.sprite.frames > 1) {
      this.frame++;
      if (this.frame >= this.state.sprite.frames) {
        this.frame = 0;
      }
    }
    if (this.opacity < 1) {
      this.opacity += 0.005;
    }
  };

  move = () => {
    //add velocity for movement in x y
    if (this.jumping) {
      this.dy += playerValues.gravity;
    }
    if (
      this.x + this.width > this.dx &&
      this.x + this.width + this.dx < SCREEN.width
    ) {
      if (
        this.x + this.width > SCREEN.width / 2 &&
        this.dx > 0 &&
        !this.world.reachedBoss &&
        this.isMain
      ) {
        this.world.manageWorldView(this.dx);
      } else {
        this.x += this.dx;
        if (this.isMain) {
          this.world.manageWorldView(0);
        }
      }
    }

    this.y += this.dy;

    this.updateFrame();
    this.clock++;
  };

  checkScreenBoundary = () => {
    //check left boundary
    if (this.x < 0) {
      this.x = 0;
    }

    //check right boundary
    if (this.x + this.width > this.world.screenWidth) {
      this.x = this.world.screenWidth - this.width;
    }
  };

  gunHandler = () => {
    let x = this.invert == 1 ? this.x + this.width / 2 : this.x;
    let y = this.y + (this.crouch ? 4 : 7);
    let bullet = this.gun.shoot(
      x,
      y,
      this.shootDirection.x,
      this.shootDirection.y
    );
    if (bullet) {
      shootSound.play();
      this.bullets.push(bullet);
    }
    this.gun.reload();
  };

  moveBullets = () => {
    this.bullets.forEach(bullet => {
      bullet.move();
      bullet.checkBoundary();
    });
    this.bullets = this.bullets.filter(bullet => !bullet.destroyed);
  };

  update = (dx = 0) => {
    if (this.state.alive) {
      //bullet updates
      this.gunHandler();
      //player updates
      this.shootDirection.x = this.state.facingLeft ? -1 : 1;
      this.shootDirection.y = 0;
      this.controllerHandler();
    }
    this.move();
    if (!this.isMain) {
      this.x -= dx;
    }
    this.checkScreenBoundary();
  };

  drawBullets = () => {
    this.bullets.forEach(bullet => {
      bullet.draw();
    });
  };

  draw = () => {
    if (!this.gameover) {
      ctx.beginPath();
      let posX = this.invert == 1 ? 0 : this.width * -1;
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.scale(this.invert, 1);
      ctx.drawImage(
        this.image.img,
        this.frame * this.image.w,
        this.state.sprite.pos * this.image.h,
        this.state.sprite.w || this.image.w,
        this.image.h,
        (this.invert * this.x + posX) * SCALE,
        (this.y - this.state.sprite.offset) * SCALE,
        (this.state.sprite.w || this.image.w) * SCALE,
        (this.state.sprite.h || this.image.h) * SCALE
      );
      ctx.restore();
      ctx.closePath();
    }
  };

  showLifeCount = () => {
    let x = 16;
    let y = 4;
    let life = this.isFirst ? gameAssets.life1 : gameAssets.life2;

    for (let i = 0; i < this.lives; i++) {
      let posX = this.isFirst
        ? 10 + x * (i + 1) + life.w * i * SCALE
        : SCREEN.width * SCALE - (10 + x * (i + 1) + life.w * i * SCALE);
      ctx.drawImage(life.img, posX, y * SCALE, life.w * SCALE, life.h * SCALE);
    }
  };

  render = () => {
    this.drawBullets();
    this.draw();
    this.showLifeCount();
  };

  checkCollision = objects => {
    if (!this.state.alive) return;
    objects.forEach(obj => {
      if (
        obj.x < this.x + this.width &&
        this.x < obj.x + obj.width &&
        obj.y < this.y + this.height &&
        this.y < obj.y + obj.height
      ) {
        if (obj instanceof Capsule) {
          if (obj.destroyed) {
            if (obj.type == 'upgrade') {
              this.gun.upgrade(obj.upgrade);
            }
            obj.picked = true;
          }
        }
        this.handleCollision(obj);
      }
    });
  };

  calculateSpriteDim = () => {
    if (!this.state.alive) {
      this.state.sprite = ANIMATE.dead;
    }
  };

  setDead = () => {
    this.dy = -5;
    this.dx = 0;
    this.frame = 0;
    this.jumping = true;
    this.state.alive = false;
    this.lives--;
    this.state.sprite = 7;
    this.setDeadFlag = true;
    this.height = 12;
    this.width = 32;
    this.calculateSpriteDim();
    playerDeadSound.play();
  };

  handleCollision = obj => {
    if (obj instanceof Enemy || obj instanceof Bullet) {
      if (obj instanceof Bullet) {
        obj.destroyed = true;
      }
      if (obj instanceof Enemy && obj.killed) {
        return;
      }
      if (!this.setDeadFlag && this.killable) {
        this.setDead();
      }
    }
  };
}
