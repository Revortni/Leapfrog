class GroundBoundary {
  constructor() {
    this.startX = 0;
    this.lastBoundary = 0;
    this.y = 0;
    this.groundSet = [];
    this.init();
    this.shift = false;
  }

  init() {
    let floorDimensions = [
      [-200, 56, 750, 56, 0],
      [550, 24, 75, 24, 0],
      [625, 56, 190, 56, 0],
      [815, 56, 1080, 185, 1],
      [1080, 185, 260, 185, 0],
      [1330, 185, 1554, 300, 1]
    ];
    floorDimensions.forEach(x => {
      let newFloor = new Ground(x[0], x[1], x[2], x[3], x[4]);
      this.groundSet.push(newFloor);
    });
  }

  boundaryFunction = () => {
    return {
      1: this.midGround,
      2: this.slope
    };
  };

  slopeFunction = (world, object, ground) => {
    let objPosL = world.x + object.x;
    let objPosB = world.screenY + object.y + object.height;
    if (objPosL > ground.x && objPosL < ground.width) {
      let intercept = ground.y;
      let distanceFromStartOfSlope = objPosL - ground.x;
      let slopeBottomY =
        ((ground.y - (world.y - ground.height)) / (ground.x - ground.width)) *
          distanceFromStartOfSlope +
        intercept;
      if (objPosB > slopeBottomY) {
        console.log('collision');
        object.y = slopeBottomY - object.height - world.screenY;
        if (object instanceof Player) {
          object.jumping = false;
        }
      }
    }
    if (objPosL > ground.width - 100 && !world.shift) {
      world.shift = true;
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
        //bottom collision
        if (objPosR > ground.x && objPosT < ground.y) {
          object.y = ground.y - object.height - world.screenY;
          object.jumping = false;
        }
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
        if (
          objPosL < ground.x &&
          objPosR < ground.x + ground.width &&
          objPosB < ground.y + ground.height &&
          objPosT > ground.y
        ) {
          object.x = ground.x - world.x - object.width;
        }
      } else {
        object.y = ground.y - object.height - world.screenY;
      }
    }
  };
  checkGroundBoundary = (world, object) => {
    this.groundSet.forEach(ground => {
      // console.log('collision', index);
      // if (ground.x == 0) {
      //   console.log('Player', objPosL, objPosR, objPosT, objPosB);
      //   console.log(
      //     'ground',
      //     ground.x,
      //     ground.x + ground.width,
      //     ground.y,
      //     ground.y + ground.height
      //   );
      // }
      if (ground.slope) {
        this.slopeFunction(world, object, ground);
      } else {
        this.flatFunction(world, object, ground);
      }
      if (world.shift) {
        object.y -= 1;
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
      // console.log(this.x - world.x, this.y - world.y, this.width, this.height);
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
