const soilderValues = {
  dx: 1.2,
  dy: 40,
  gravity: 5,
  friction: 0.9,
  width: 19,
  height: 33,
  boundaryOffset: 30
};

class Soilder extends Enemy {
  constructor(position) {
    super(soilderValues.width, soilderValues.height);
    this.y = 30;
    this.dx = 0;
    this.dy = soilderValues.dy;

    this.boundaryOffset = soilderValues.boundaryOffset;
    this.setEntryPoint(position);
  }

  setEntryPoint = position => {
    this.image = gameAssets.enemy1L;
    if (position == 'right') {
      this.x = this.maxWidth;
      this.dx = -soilderValues.dx;
    }
    if (position == 'left') {
      this.x = -this.width * 2;
      this.dx = soilderValues.dx;
      this.invert = -1;
    }
  };

  update = worldShift => {
    //add velocity for movement in x y
    this.x += this.dx - worldShift;
    this.y += this.dy;
    if (this.clock % 5 == 0) {
      this.frame++;
      this.frame = this.frame % this.image.frameCount;
    }
    this.clock++;
  };
}
