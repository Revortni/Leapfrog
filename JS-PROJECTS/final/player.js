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

const values = {
  dx: 4,
  dy: 50,
  gravity: 2,
  friction: 0.9
};

class Player {
  constructor(context, maxWidth, maxHeight, game) {
    this.width = 48;
    this.height = 68;
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
    this.imagePos = 1;
    this.init();
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

  update = () => {
    this.shootDirection.x = this.state.facingLeft ? -1 : 1;
    this.shootDirection.y = 0;
    if (controller.jump && this.jumping == false) {
      this.dy -= values.dy;
      this.jumping = true;
      this.width = 48;
      this.height = 48;
    }

    if (this.jumping) {
      this.dy += values.gravity;
      this.state.sprite = this.state.facingLeft ? 9 : 8;
    } else {
      this.state.sprite = this.directionFacing;
      if (controller.up) {
        this.state.sprite = 2;
      }
      if (controller.down) {
        this.state.sprite = 6;
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
      this.dx = -values.dx;
      this.directionFacing = 4;
      this.shootDirection.x = -1;
      this.state.facingLeft = true;
    }
    if (controller.right) {
      this.dx = values.dx;
      this.directionFacing = 0;
      this.shootDirection.x = 1;
      this.state.facingLeft = false;
    }

    if (
      !this.jumping &&
      controller.down &&
      !(controller.right || controller.left)
    ) {
      let shift = this.height - this.width;
      this.y = this.crouch ? this.y : this.y + shift;
      this.crouch = true;
      this.width = 68;
      this.height = 48;
      this.shootDirection.y = 0;
    } else if (this.crouch) {
      this.crouch = false;
      this.width = 48;
      this.height = 68;
      this.y = this.y + this.height - this.width;
    }

    //add velocity for movement in x y
    this.x += this.dx;
    this.y += this.dy;

    //friction
    this.dy *= values.friction;
    this.dx *= 0.7;

    //check bottom boundary
    if (this.y + this.height > this.maxHeight) {
      this.width = 48;
      this.height = 68;
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

    //shooting function
    this.shoot();

    //bulletBoundary function
    if (this.bullets.length) {
      let removeBullet = [];
      this.bullets.forEach((bullet, index) => {
        bullet.move();
        if (
          bullet.x > this.maxWidth ||
          bullet.x < 0 ||
          bullet.y < 0 ||
          bullet.y > this.maxHeight
        ) {
          removeBullet.push(index);
        }
      });
      this.bullets.filter((val, index) => removeBullet.includes(index));
    }
  };

  shoot = () => {
    if (controller.shoot && this.shootFlag) {
      controller.shoot = false;
      let x = this.x + this.width / 2;
      let y =
        this.jumping || this.crouch
          ? this.y + this.height / 2
          : this.y + this.height / 3;
      let bullet = new Bullet(
        this.context,
        x,
        y,
        this.shootDirection.x,
        this.shootDirection.y,
        this.jumping
      );
      this.bullets.push(bullet);
      this.shootFlag = false;
    }

    return;
  };

  draw = () => {
    let c = this.context;
    c.beginPath();
    // var bg = new Image();
    // bg.src = './assets/p1.png';
    // bg.onload = () => {
    //   this.context.drawImage(
    //     bg,
    //     this.imagePos,
    //     12,
    //     24,
    //     33,
    //     this.x,
    //     this.y,
    //     this.width,
    //     this.height
    //   );
    //   this.imagePos += 26;
    // };
    c.rect(this.x, this.y, this.width, this.height);
    c.fillStyle = display[this.state.sprite];
    c.fill();
  };
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
