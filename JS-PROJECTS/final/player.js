/*a controller object to manage key press states */
const controller = {
  left: false,
  right: false,
  up: false,
  down: false,
  jump: false,
  shoot: false,
  select: false,
  start: false,
  keyListener: event => {
    let keyState = event.type == 'keydown' ? true : false;
    switch (event.keyCode) {
      case 65: //A
        controller.left = keyState;
        break;
      case 83: //S
        controller.down = keyState;
        break;
      case 68: //D
        controller.right = keyState;
        break;
      case 87: //W
        controller.up = keyState;
        break;
      case 88: //X
        controller.jump = keyState;
        break;
      case 90: //Z
        controller.shoot = keyState;
      case 1: //Select
        controller.select = keyState;
        break;
      case 1: //Start
        controller.start = keyState;
    }
  }
};

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

class Player {
  constructor(maxWidth, maxHeight) {
    this.width = playerValues.width;
    this.height = playerValues.height;
    this.x = 0;
    this.dx = 0;
    this.y = 0;
    this.dy = playerValues.dy;
    this.state = null;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this.bullets = [];
    this.sprite = null;
    this.image = null;
    this.gun = null;
    this.init();
  }

  init = () => {
    /*initialize event listeners for buttons */
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

    //friction
    this.dx *= playerValues.frictionX;
  };

  checkScreenBoundary = () => {
    //check left boundary
    if (this.x < 0) {
      this.x = 0;
    }

    //check right boundary
    if (this.x + this.width > SCREEN.width) {
      this.x = SCREEN.width - this.width;
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
    this.bullets.forEach((bullet, index) => {
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
    // ctx.rect(this.playerX, this.y, this.width, this.height);
    // ctx.fillStyle = color[this.state.sprite];
    // ctx.fill();
    ctx.closePath();
  };

  render = () => {
    this.drawBullets();
    this.draw();
  };
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
