const soldierValues = {
  dx: 2,
  dy: 10,
  gravity: 5,
  friction: 0.9,
  width: 19,
  height: 33,
  boundaryOffset: 30
};

class Soldier extends Enemy {
  constructor(position) {
    super();
    this.width = soldierValues.width;
    this.height = soldierValues.height;
    this.y = 30;
    this.dx = 0;
    this.dy = soldierValues.dy;
    this.facingRight = 0;
    this.boundaryOffset = soldierValues.boundaryOffset;
    this.setEntryPoint(position);
  }

  setEntryPoint = position => {
    this.image = gameAssets.soldier;
    if (position == 'right') {
      this.x = this.maxWidth;
      this.dx = -soldierValues.dx;
    }
    if (position == 'left') {
      this.x = -this.width * 2;
      this.dx = soldierValues.dx;
      this.facingRight = 1;
    }
  };

  update = ({ worldShift }) => {
    //add velocity for movement in x y
    this.x += this.dx - worldShift;
    this.y += this.dy;
    if (this.clock % 5 == 0) {
      this.frame++;
      this.frame = this.frame % this.image.frameCount;
    }
    this.clock++;
  };

  draw = () => {
    ctx.beginPath();
    ctx.drawImage(
      this.image.img,
      this.frame * this.image.w,
      this.facingRight * this.image.h,
      this.image.w,
      this.image.h,
      this.x * SCALE,
      this.y * SCALE,
      this.image.w * SCALE,
      this.image.h * SCALE
    );

    ctx.strokeRect(
      this.x * SCALE,
      this.y * SCALE,
      this.image.w * SCALE,
      this.image.h * SCALE
    );
    ctx.closePath();
  };
}
