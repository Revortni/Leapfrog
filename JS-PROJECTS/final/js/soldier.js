const soldierValues = {
  dx: 1.5,
  dy: 10,
  gravity: 5,
  friction: 0.9,
  width: 19,
  height: 33,
  boundaryOffset: 30
};

class Soldier extends Enemy {
  constructor(position, world) {
    super();
    this.width = soldierValues.width;
    this.height = soldierValues.height;
    this.y = 30;
    this.dx = 0;
    this.dy = soldierValues.dy;
    this.facingRight = 0;
    this.boundaryOffset = soldierValues.boundaryOffset;
    this.invert = 1;
    this.world = world;
    this.setEntryPoint(position);
  }

  setEntryPoint = position => {
    position = position || 'right';
    this.image = gameAssets.soldier;
    if (position == 'right') {
      this.x = this.maxWidth;
      this.dx = -soldierValues.dx;
    }
    if (position == 'left') {
      this.x = -this.width * 2;
      this.dx = soldierValues.dx;
      this.invert = -1;
    }
  };

  update = ({ worldShift }) => {
    if (this.checkIfKilled()) return;

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
    let posX = this.invert == 1 ? 0 : this.width * -1;
    ctx.beginPath();
    ctx.save();
    ctx.scale(this.invert, 1);
    ctx.drawImage(
      this.image.img,
      this.frame * this.image.w,
      this.facingRight * this.image.h,
      this.image.w,
      this.image.h,
      (this.invert * this.x + posX) * SCALE,
      this.y * SCALE,
      this.image.w * SCALE,
      this.image.h * SCALE
    );

    ctx.strokeRect(
      (this.invert * this.x + posX) * SCALE,
      this.y * SCALE,
      this.image.w * SCALE,
      this.image.h * SCALE
    );
    ctx.restore();
    ctx.closePath();
  };
}
