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
  '1': '',
  '2': '#f00',
  '3': '',
  '4': '#00f',
  '5': '',
  '6': '#0f0',
  '7': '',
  '8': '#FFD700',
  '9': '#006400'
};

const values = {
  dx: 5,
  dy: 50,
  gravity: 1.5,
  friction: 0.9
};

class Player {
  constructor(context, maxWidth, maxHeight) {
    this.width = 50;
    this.height = 50;
    this.x = 100; //x coordinate of player
    this.dx = 0; //velocity of player in x axis
    this.y = 400; //y coordinate of player
    this.dy = 0; //velocity of player in y axis
    this.context = context;
    this.state = null;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this.jumping = true;
    this.bullets = [];
    this.shootFlag = true;
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
      color: '#000',
      facingLeft: false
    };
    this.directionFacing = 0;
    this.shootDirection = { x: 1, y: 0 };
  };

  update = () => {
    this.shootDirection.x = this.state.facingLeft ? -1 : 1;
    if (controller.jump && this.jumping == false) {
      this.dy -= values.dy;
      this.jumping = true;
    }

    if (controller.up) {
      this.shootDirection.x = 0;
      this.shootDirection.y = -1;
      this.state.color = 2;
    } else if (controller.down) {
      this.shootDirection.y = 1;
      this.state.color = 6;
    } else if (!this.jumping) {
      this.state.color = this.directionFacing;
      this.shootDirection.y = 0;
    } else {
      this.shootDirection.y = 0;
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

    if (this.jumping) {
      this.dy += values.gravity;
      this.state.color = this.state.facingLeft ? 9 : 8;
    }
    //add velocity for movement in x y
    this.x += this.dx;
    this.y += this.dy;
    //friction
    this.dx *= values.friction;
    this.dy *= values.friction;

    if (this.y + this.height > this.maxHeight) {
      this.jumping = false;
      this.y = this.maxHeight - this.height;
      this.dy = 0;
      this.state.color = this.directionFacing;
    }

    if (this.x < 0) {
      this.x = 0;
    }
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
      let y = this.y + this.height / 2;
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
    c.rect(this.x, this.y, this.width, this.height);
    c.fillStyle = display[this.state.color];
    c.fill();
  };
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
