class GroundBoundary {
  constructor() {
    this.startX = 0;
    this.lastBoundary = 0;
    this.y = 0;
    this.groundSet = [];
    this.init();
  }

  init() {
    let floorDimensions = DATA.ground1;
    floorDimensions.forEach(x => {
      let newFloor = new Ground(x[0], x[1], x[2], x[3], x[4]);
      this.groundSet.push(newFloor);
    });
  }

  slopeFunction = (world, object, ground) => {
    let objPosL = world.x + object.x;

    let objPosB = world.screenY + object.y + object.height;
    if (objPosL > ground.x && objPosL < ground.width) {
      let intercept = ground.y;
      let distanceFromStartOfSlope = objPosL - ground.x;
      let slopeBottomY =
        -Math.tan((26.5 * Math.PI) / 180) * distanceFromStartOfSlope +
        intercept;
      if (objPosB > slopeBottomY) {
        object.y = slopeBottomY - object.height - world.screenY;
        if (object instanceof Player) {
          object.jumping = false;
          if (objPosL > ground.width - 100 && !ground.shifted) {
            world.shift = true;
            ground.shifted = true;
          }
        } else if (object instanceof Bullet) {
          object.destroyed = true;
        }
      }
    }
  };

  flatFunction = (world, object, ground) => {
    let objPosL = world.x + object.x;
    let objPosR = world.x + object.x + object.width;
    let objPosT = world.screenY + object.y;
    let objPosB = world.screenY + object.y + object.height;
    if (
      objPosR > ground.x &&
      objPosT < ground.y + ground.height &&
      objPosB > ground.y &&
      objPosL < ground.x + ground.width
    ) {
      if (object instanceof Player) {
        //collision with right boundary
        if (
          objPosR > ground.x + ground.width &&
          objPosL > ground.x &&
          objPosB < ground.y + ground.height &&
          objPosT > ground.y
        ) {
          object.x = ground.x + ground.width - world.x;
        }
        //collision with left boundary
        else if (
          objPosL < ground.x &&
          objPosT + object.height / 2 > ground.y &&
          objPosB > ground.y
        ) {
          object.x = ground.x - world.x - object.width;
        }
        //bottom collision
        else if (
          objPosR > ground.x &&
          objPosT < ground.y + ground.height &&
          objPosL < ground.x + ground.width
        ) {
          object.y = ground.y - object.height - world.screenY;
          object.jumping = false;
        }
      } else if (object instanceof Bullet) {
        object.destroyed = true;
      } else {
        object.y = ground.y - object.height - world.screenY;
      }
    }
  };

  checkGroundBoundary = (world, object) => {
    this.groundSet.forEach(ground => {
      if (ground.slope) {
        this.slopeFunction(world, object, ground);
      } else {
        this.flatFunction(world, object, ground);
      }
    });
  };

  draw(world) {
    this.groundSet.forEach(x => {
      x.draw(world);
    });
  }
}
class Ground {
  constructor(x, y, width, height, slope) {
    this.x = x;
    this.y = IMAGESIZE.y - y;
    this.width = width;
    this.height = height;
    this.slope = slope;
    this.shifted = false;
  }

  draw = function(world) {
    let s = SCALE;
    ctx.beginPath();
    if (this.slope) {
      ctx.moveTo((this.x - world.x) * s, (this.y - world.screenY) * s);
      ctx.lineTo(
        (this.width - world.x) * s,
        (world.y - this.height - world.screenY) * s
      );
      ctx.stroke();
    } else {
      ctx.save();
      ctx.fillStyle = 'red';
      ctx.globalAlpha = 0.5;
      ctx.fillRect(
        (this.x - world.x) * s,
        (this.y - world.screenY) * s,
        this.width * s,
        this.height * s
      );
    }
    ctx.restore();
    ctx.closePath();
  };
}
