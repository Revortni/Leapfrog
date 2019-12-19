class Boss extends Enemy {
  constructor(world) {
    super();
    this.width = 19;
    this.height = 33;
    this.life = 15;
    this.image = gameAssets.boss;
    this.x = -this.image.w;
    this.y = 0;
    this.world = world;
    this.entry = false;
    this.frame = 0;
    this.clock = 0;
    this.spawnCounter = 0;
    this.guns = [];
    this.core = null;
    this.defeated = false;
    this.killed = true; //to prevent collision
    this.dy = 1;
    this.dx = 1;
    this.init();
  }
  //initialize guns
  init = () => {
    let posX = [97, 119, 145, 168];
    let posY = 46;
    posX.forEach(x => {
      let gun = new BossGun(x, posY, this.world, this);
      this.guns.push(gun);
      this.world.enemies.push(gun);
    });
  };

  checkScreenBoundary = () => {};

  checkIntro = () => {
    if (!this.entry) {
      this.x += 20;
      if (this.x > 0) {
        this.entry = true;
      }
    }
  };

  generateSoilders = () => {
    let position = this.x > 50 ? -1 : 1;
    let enemy = new Soldier(this.world, 'boss', {
      x: this.x + 70,
      y: this.y + 74,
      dir: position
    });
    this.world.enemies.push(enemy);

    this.spawnCounter++;
    if (this.spawnCounter > 6) {
      this.spawnCounter = 0;
      this.hatchOpen = false;
    }
  };

  updateFrame = () => {
    //frame updates
    if (this.clock % 2 == 0) {
      this.frame++;
      if (this.frame >= this.image.frames) {
        this.frame = 0;
      }
    }
  };

  cleanup = () => {
    this.alive = false;
    if (this.core) {
      this.core.alive = false;
    }
    this.guns.forEach(x => {
      x.alive = false;
    });
  };

  checkState = () => {
    let gunsLeft = this.guns.filter(x => !x.killed);
    if (gunsLeft.length <= 0 && !this.core) {
      this.core = new Core(138, 44, this);
      this.world.enemies.push(this.core);
    }

    if (this.core && this.core.killed) {
      this.defeated = true;
    }
  };

  move() {
    if (this.y < 5) {
      this.dy = 0.5;
    }
    if (this.y > 80) {
      this.dy = -0.5;
      this.hatchOpen = true;
    }
    if (this.x < 20) {
      this.dx = 0.2;
    }
    if (this.x > 80) {
      this.dx = -0.2;
    }
    this.y += this.dy;
    this.x += this.dx;
  }

  update = () => {
    this.checkIntro();
    if (!this.entry) return;
    this.updateFrame();
    if (this.clock % 20 == 0 && this.hatchOpen) {
      this.generateSoilders();
    }
    this.checkState();
    this.move();
    this.clock++;
  };

  drawHatch = () => {
    let image = gameAssets.hatch;
    ctx.beginPath();
    ctx.drawImage(
      image.img,
      (this.x + 60) * SCALE,
      (this.y + 55) * SCALE,
      image.w * SCALE,
      image.h * SCALE
    );

    ctx.closePath();
  };

  draw = () => {
    ctx.beginPath();
    ctx.drawImage(
      this.image.img,
      0,
      this.frame * this.image.h,
      this.image.w,
      this.image.h,
      this.x * SCALE,
      this.y * SCALE,
      this.image.w * SCALE,
      this.image.h * SCALE
    );
    ctx.closePath();
    if (this.hatchOpen) {
      this.drawHatch();
    }
    this.guns.forEach(x => {
      x.draw();
    });
  };
}

class BossGun extends Enemy {
  constructor(x, y, world, parent) {
    super();
    this.x = 0;
    this.y = 0;
    this.px = x;
    this.py = y;
    this.width = 14;
    this.height = 16;
    this.hp = 4;
    this.parent = parent;
    this.image = gameAssets.bossGun;
    this.frame = 0;
    this.reloadTime = 100;
    this.point = 50;
    this.world = world;
  }

  update = ({ playerX, playerY }) => {
    this.x = this.parent.x + this.px;
    this.y = this.parent.y + this.py;
    if (this.killed) return;
    if (this.clock % this.reloadTime == 0 && this.x > 0 && this.active) {
      this.shoot(playerX, playerY);
    }
    this.clock++;
  };

  shoot = (x, y) => {
    x = Math.floor(x);
    y = Math.floor(y);
    let angle = Math.atan2(y - this.y, x - this.x);
    let dx = Math.cos(angle);
    let dy = Math.sin(angle);
    if (angle > (2 * Math.PI) / 3) {
      this.frame = 0;
    } else if (angle < (2 * Math.PI) / 3 && angle > Math.PI / 3) {
      this.frame = 1;
    } else {
      this.frame = 2;
    }
    let bullet = new Bullet(this.x, this.y, dx, dy, 2, gameAssets.bulletE.img);
    this.world.enemyBullets.push(bullet);
  };

  setKilled = () => {
    this.frame = 3;
    this.killed = true;
  };

  draw = () => {
    ctx.beginPath();
    ctx.drawImage(
      this.image.img,
      this.frame * this.image.w,
      0,
      this.image.w,
      this.image.h,
      this.x * SCALE,
      this.y * SCALE,
      this.width * SCALE,
      this.height * SCALE
    );
    ctx.closePath();
  };

  //override
  checkScreenBoundary = () => {};
}

class Core extends Enemy {
  constructor(x, y, parent) {
    super();
    this.x = 0;
    this.y = 0;
    this.px = x;
    this.py = y;
    this.width = 22;
    this.height = 22;
    this.hp = 6;
    this.parent = parent;
    this.image = gameAssets.almostDead;
    this.frame = 0;
    this.point = 1000;
  }

  update = () => {
    this.x = this.parent.x + this.px;
    this.y = this.parent.y + this.py;
    if (this.killed) return;
    if (this.clock % 6 == 0) {
      this.frame++;
      if (this.frame >= this.image.frames) {
        this.frame = 0;
      }
    }
    this.clock++;
  };

  setKilled = () => {
    this.frame = 3;
    this.killed = true;
  };

  draw = () => {
    ctx.beginPath();
    ctx.drawImage(
      this.image.img,
      this.frame * this.image.w,
      0,
      this.image.w,
      this.image.h,
      this.x * SCALE,
      this.y * SCALE,
      this.width * SCALE,
      this.height * SCALE
    );
    ctx.closePath();
  };

  //override
  checkScreenBoundary = () => {};
}
