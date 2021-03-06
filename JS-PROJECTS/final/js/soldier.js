const soldierValues = {
  dx: 1.5,
  dy: 6,
  width: 19,
  height: 33,
  boundaryOffset: 35
};

class Soldier extends Enemy {
  constructor(world, position, loc) {
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
    this.setEntryPoint(position, loc || 0);
  }

  setEntryPoint = (position, loc) => {
    this.image = gameAssets.soldier;
    if (position == 'right') {
      this.x = this.maxWidth + 35;
      this.dx = -soldierValues.dx;
    }
    if (position == 'left') {
      this.x = -this.width * 2;
      this.dx = soldierValues.dx;
      this.invert = -1;
    }

    if (position == 'fixed') {
      this.x = loc.x - this.world.x;
      this.y = this.world.y - loc.y - this.world.screenY;
      this.dx = -soldierValues.dx;
    }
    if (position == 'boss') {
      this.x = loc.x;
      this.y = loc.y;
      this.dx = soldierValues.dx * loc.dir;
      this.invert = -1 * loc.dir;
    }
  };

  update = ({ worldShift }) => {
    if (this.checkIfKilled()) return;

    //add velocity for movement in x y
    this.x += this.dx - (worldShift || 0);
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

    ctx.restore();
    ctx.closePath();
  };
}
