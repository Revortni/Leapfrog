const display = {
  '0': 'pStandingR.png',
  '1': 'pStandingL.png',
  '2': '#f00',
  '3': '#fff',
  '4': 'pStandingL.png',
  '5': '#fff',
  '6': 'pLayingDownR.png',
  '7': '#fff',
  '8': 'pStandingR.png',
  '9': 'pStandingL.png',
  '10': 'pLayingDownL.png'
};
const color = {
  '0': '#fff',
  '1': '#fff',
  '2': '#f00',
  '3': '#fff',
  '4': '#00f',
  '5': '#fff',
  '6': '#0f0',
  '7': '#fff',
  '8': '#FFD700',
  '9': '#006400',
  '10': '#f203f4'
};
const playerValues = {
  dx: 10,
  dy: 8,
  gravity: 1.2,
  friction: 0.9,
  width: 23,
  height: 34,
  crouchWidth: 32,
  crouchHeight: 15,
  jumpSize: 18,
  reloadTime: 5,
  jumpDist: 16
};

class Player {
  constructor(maxWidth, world) {
    this.width = playerValues.width;
    this.height = playerValues.height;
    this.x = 100;
    this.dx = 0;
    this.y = 0;
    this.lastY = 0;
    this.dy = playerValues.dy;
    this.state = null;
    this.maxWidth = maxWidth;
    this.bullets = [];
    this.sprite = null;
    this.image = null;
    this.gun = null;
    this.world = world;
    this.init();
  }

  init = () => {
    this.intro = true;
    this.gun = new Gun();
    this.reset();
  };

  reset = () => {
    this.state = {
      alive: true,
      sprite: 0,
      facingLeft: false
    };
    this.jumping = false;
    this.crouch = false;
    this.directionFacing = 0;
    this.shootDirection = { x: 1, y: 0 };
  };

  controllerHandler = () => {
    this.dx = 0;
    if (controller.jump && this.jumping == false) {
      this.dy = 0;
      this.dy -= playerValues.jumpDist;
      this.jumping = true;
      this.width = playerValues.width;
      this.height = playerValues.height;
    }

    if (this.jumping) {
      this.dy += playerValues.gravity;
      this.state.sprite = this.state.facingLeft ? 9 : 8;
    } else {
      this.state.sprite = this.directionFacing;
      if (controller.up) {
        this.state.sprite = 2;
      }
      if (controller.down) {
        this.state.sprite = this.state.facingLeft ? 10 : 6;
      }
      if (controller.right && controller.up) {
        this.state.sprite = 1;
      }
      if (controller.left && controller.up) {
        this.state.sprite = 3;
      }
      if (controller.right && controller.down) {
        this.state.sprite = 7;
      }
      if (controller.left && controller.down) {
        this.state.sprite = 5;
      }
    }
    if (controller.up) {
      this.shootDirection.x = 0;
      this.shootDirection.y = -1;
    }
    if (controller.down) {
      this.shootDirection.y = 1;
    }
    if (controller.left) {
      this.dx = -playerValues.dx;
      this.directionFacing = 4;
      this.shootDirection.x = -1;
      this.state.facingLeft = true;
    }
    if (controller.right) {
      this.dx = playerValues.dx;
      this.directionFacing = 0;
      this.shootDirection.x = 1;
      this.state.facingLeft = false;
    }

    if (
      !this.jumping &&
      controller.down &&
      !(controller.right || controller.left)
    ) {
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

  move = () => {
    //add velocity for movement in x y
    this.x += this.dx;
    this.y += this.dy;
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
    let x = this.state.facingLeft
      ? this.x - this.width / 2
      : this.x + this.width / 2;
    let y = this.y + (this.crouch ? this.height / 2 : this.height / 4);
    let bullet = this.gun.shoot(
      x,
      y,
      this.shootDirection.x,
      this.shootDirection.y,
      this.jumping
    );
    if (bullet) {
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

  update = () => {
    if (this.dy > 10) {
      this.dy = playerValues.dy;
    }
    //bullet updates
    this.gunHandler();
    if (this.bullets.length) {
      this.moveBullets();
    }
    //player updates
    this.shootDirection.x = this.state.facingLeft ? -1 : 1;
    this.shootDirection.y = 0;
    this.controllerHandler();
    this.move();
    this.checkScreenBoundary();
  };

  drawBullets = () => {
    this.bullets.forEach(bullet => {
      bullet.draw();
    });
  };

  draw = () => {
    ctx.beginPath();
    let image = new Image();
    image.src = './assets/' + display[this.state.sprite];
    ctx.drawImage(
      image,
      this.x * SCALE,
      this.y * SCALE,
      this.width * SCALE,
      this.height * SCALE
    );
    ctx.strokeRect(
      this.x * SCALE,
      this.y * SCALE,
      this.width * SCALE,
      this.height * SCALE
    );
    //   ctx.rect(
    //     this.x * SCALE,
    //     this.y * SCALE,
    //     this.width * SCALE,
    //     this.height * SCALE
    //   );
    //   ctx.fillStyle = color[this.state.sprite];
    //   ctx.fill();
    ctx.closePath();
  };

  render = () => {
    this.drawBullets();
    this.draw();
  };
}
