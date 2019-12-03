class Pipe {
  constructor(parentElement, x, y, height) {
    this.x = x;
    this.y = y;
    this.element = null;
    this.width = 100;
    this.height = height;
    this.parentElement = parentElement;
    this.cleared = false;
  }

  init = () => {
    this.element = this.createPipe();
    this.draw();
    return this;
  };

  createPipe = () => {
    let pipe = document.createElement('div');
    pipe.style.height = this.height + 'px';
    pipe.style.width = this.width + 'px';
    pipe.classList.add('pipe');
    this.parentElement.appendChild(pipe);

    return pipe;
  };

  move = dx => {
    this.x -= dx;
    this.draw();
  };

  draw = () => {
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
  };
}
