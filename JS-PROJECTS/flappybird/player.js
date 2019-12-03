class Player {
  constructor(x, y, parentElement, maxHeight, maxWidth, controlFlag = 0) {
    this.x = x;
    this.y = y;
    this.element = null;
    this.width = 50;
    this.height = 50;
    this.parentElement = parentElement;
    this.pullDownForce = 0.5;
    this.pushUpForce = -6;
    this.gravity = 0.5;
    this.maxHeight = maxHeight;
    this.maxWidth = maxWidth;
    this.keyHold = false;
    this.alive = true;
    this.imgUp = -0.8;
    this.angle = 0;
    this.useMouse = controlFlag;
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
    return this;
  };

  move() {
    if (this.y + this.width / 2 < this.maxHeight) {
      this.y += this.pullDownForce;
      this.pullDownForce += this.gravity;
    }
    if (this.pullDownForce > 0) {
      if (this.angle < 90) {
        this.angle += 3;
      }
      this.element.style.background = "url('./assets/down.png') no-repeat ";
      this.element.style.backgroundSize = 'contain';
    }
  }

  handleButtonPress = event => {
    if ((event.code == 'Space' || this.useMouse) && this.alive) {
      this.pullDownForce = this.pushUpForce;
      this.angle = -60;
      this.element.style.background = "url('./assets/bird.gif') no-repeat ";
      this.element.style.backgroundSize = 'contain';
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
    this.draw();
  };
}
