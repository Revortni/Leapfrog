class Player {
  constructor(parentElement, maxHeight, maxWidth, controlFlag = 0) {
    this.element = null;
    this.width = 50;
    this.height = 50;
    this.x = maxWidth / 2 - this.width;
    this.y = maxHeight / 2;
    this.parentElement = parentElement;
    this.pullDownForce = 1; //downward force
    this.pushUpForce = -6; //force when button is pressed
    this.gravity = 0.5; //rate at which downward force increases
    this.maxHeight = maxHeight;
    this.maxWidth = maxWidth;
    this.alive = true;
    this.angleUp = -60; //lowerlimit for angle of player
    this.angleIncrement = 10; //rate at which angle increases
    this.angle = 0; //base angle
    this.angleDown = 90; //upperlimit for angle of player
    this.useMouse = controlFlag; //set if control for game is mouse
    this.images = ['./assets/down.png', './assets/mid.png', './assets/up.png'];
    this.imageIndex = 0;
  }

  init = () => {
    let player = document.createElement('div');
    player.style.height = this.width + 'px';
    player.style.width = this.height + 'px';
    player.style.transform = 'rotate(' + this.angle + 'deg)';
    player.classList.add('player');
    if (!this.useMouse) {
      document.addEventListener('keyup', this.handleButtonPress.bind(this));
    } else {
      this.parentElement.onclick = this.handleButtonPress.bind(this);
    }
    this.element = player;
    this.parentElement.appendChild(this.element);
    this.animateBird();
    return this;
  };

  move() {
    if (this.y + this.width / 2 < this.maxHeight) {
      this.y += this.pullDownForce;
      this.pullDownForce += this.gravity;
    }
    if (this.pullDownForce > 0) {
      if (this.angle < this.angleDown) {
        this.angle += this.angleIncrement;
      }
    }
    if (!this.alive) {
      clearInterval(this.animateInterval);
    }
  }

  animateBird = () => {
    this.animateInterval = setInterval(() => {
      this.element.style.background =
        'url(' + this.images[this.imageIndex] + ') no-repeat ';
      this.element.style.backgroundSize = 'contain';
      this.imageIndex += 1;
      this.imageIndex %= this.images.length;
    }, 30);
  };

  handleButtonPress = event => {
    if ((event.code == 'Space' || this.useMouse) && this.alive) {
      this.pullDownForce = this.pushUpForce;
      this.angle = this.angleUp;
    }
  };

  draw = () => {
    if (this.pullDownForce > 0) {
    } else {
    }
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
    this.element.style.transform = 'rotate(' + this.angle + 'deg)';
  };

  checkCollision = pipes => {
    let left = this.x;
    let right = this.x + this.width;
    let top = this.y;
    let bottom = this.y + this.height;
    for (var i = 0; i < pipes.length; i++) {
      if (left < pipes[i].x + pipes[i].width && right > pipes[i].x && top < 0) {
        return true;
      }
      if (
        left < pipes[i].x + pipes[i].width &&
        right > pipes[i].x &&
        top < pipes[i].y + pipes[i].height &&
        bottom > pipes[i].y
      ) {
        return true;
      }
    }
    return false;
  };

  reset = () => {
    this.alive = true;
    this.y = this.maxHeight / 2;
    this.x = this.maxWidth / 2;
    this.angleUp = -60;
    this.angleIncrement = 3;
    this.angle = 0;
    this.angleDown = 90;
    this.pullDownForce = 1;
    this.element.style.background = "url('./assets/down.png') no-repeat ";
    this.element.style.backgroundSize = 'contain';
    this.animateBird();
    this.draw();
  };
}
