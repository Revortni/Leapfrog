/*a controller object to manage key press states */
const controller = {
  left: false,
  right: false,
  up: false,
  down: false,
  jump: false,
  shoot: false,
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
      case 88:
        controller.jump = keyState;
        break;
      case 90:
        controller.shoot = keyState;
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
  '0': '#000',
  '1': '#fff',
  '2': '#f00',
  '3': '#fff',
  '4': '#00f',
  '5': '#fff',
  '6': '#0f0',
  '7': '#fff',
  '8': '#FFD700',
  '9': '#006400'
};

const playerValues = {
  dx: 4,
  dy: 50,
  gravity: 2,
  friction: 0.9,
  width: 48,
  height: 68,
  crouchWidth: 68,
  crouchHeight: 38,
  jumpSize: 40,
  reloadTime: 10
};

class Player {
  constructor(context, maxWidth, maxHeight, game) {
    this.width = playerValues.width;
    this.height = playerValues.height;
    this.x = 100; //x coordinate of player
    this.dx = 0; //velocity of player in x axis
    this.y = 100; //y coordinate of player
    this.dy = 0; //velocity of player in y axis
    this.context = context;
    this.state = null;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this.jumping = true;
    this.bullets = [];
    this.shootFlag = true;
    this.sprite = null;
    this.bulletClock = 1;
    this.shootCreationHeight = this.init();
  }

  init = () => {
    /*initialize event listeners for buttons */
    this.intro = true;
    document.addEventListener('keydown', controller.keyListener);
    document.addEventListener('keyup', controller.keyListener);
    this.reset();
  };

  reset = () => {
    this.state = {
      alive: true,
      sprite: '#000',
      facingLeft: false
    };
    this.crouch = false;
    this.directionFacing = 0;
    this.shootDirection = { x: 1, y: 0 };
  };

  controllerHandler = () => {
    if (controller.jump && this.jumping == false) {
      this.dy -= playerValues.dy;
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
        : this.maxHeight - playerValues.crouchHeight;
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
    this.dy *= playerValues.friction;
    this.dx *= 0.7;
  };

  checkBoundary = () => {
    //check bottom boundary
    if (this.y + this.height > this.maxHeight) {
      this.width = playerValues.width;
      this.height = playerValues.height;
      this.jumping = false;
      this.y = this.maxHeight - this.height;
      this.dy = 0;
      this.state.sprite = this.directionFacing;
    }

    //check left boundary
    if (this.x < 0) {
      this.x = 0;
    }

    //check right boundary
    if (this.x + this.width > this.maxWidth) {
      this.x = this.maxWidth - this.width;
    }
  };

  shoot = () => {
    let x = this.state.facingLeft ? this.x : this.x + this.width;
    let y =
      this.jumping || this.crouch
        ? this.y + this.height / 2
        : this.y + this.height / 4;
    let bullet = new Bullet(
      this.context,
      x,
      y,
      this.shootDirection.x,
      this.shootDirection.y,
      this.jumping
    );
    this.bullets.push(bullet);
  };

  shootHandler = () => {
    //shooting function
    if (controller.shoot && this.shootFlag) {
      this.shoot();
      this.shootFlag = false;
    }
    if (!this.shootFlag) {
      this.bulletClock++;
      if (this.bulletClock % playerValues.reloadTime == 0) {
        this.shootFlag = true;
        this.bulletClock = 1;
      }
    }
  };

  moveBullets = () => {
    this.bullets.forEach(bullet => {
      bullet.move();
      bullet.checkBoundary();
    });

    this.bullets = this.bullets.filter(bullet => !bullet.destroyed);
  };

  update = () => {
    //player updates
    this.shootDirection.x = this.state.facingLeft ? -1 : 1;
    this.shootDirection.y = 0;
    this.controllerHandler();
    this.move();
    this.checkBoundary();
    //bullet updates
    this.shootHandler();
    this.moveBullets();
  };

  drawBullets = () => {
    this.bullets.forEach((bullet, index) => {
      bullet.draw();
    });
  };

  draw = () => {
    let c = this.context;
    c.beginPath();
    let bg = new Image();
    bg.src = './assets/' + display[this.state.sprite];
    bg.onload = () => {
      c.drawImage(bg, this.x, this.y, this.width, this.height);
    };
    // c.rect(this.x, this.y, this.width, this.height);
    // c.fillStyle = display[this.state.sprite];
    // c.fill();
    c.closePath();
  };

  render = () => {
    this.drawBullets();
    this.draw();
  };
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
