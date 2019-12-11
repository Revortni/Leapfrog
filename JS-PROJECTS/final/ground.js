class GroundBoundary {
  constructor() {
    this.startX = 0;
    this.lastBoundary = 0;
    this.y = 0;
    this.ground = [];
  }

  addGroundProperty(distance, type) {
    let from = this.lastBoundary;
    let till = from + distance;
    this.ground.push({
      from: from,
      to: till,
      boundaryFunction: this.boundaryFunction()[type]
    });
    this.lastBoundary = till;
  }

  getBoundaryFunction(x) {
    for (let i = 0; i < this.ground.length; i++) {
      if (x < this.ground[i].to) {
        return this.ground[i];
      }
    }
  }

  boundaryFunction = () => {
    return {
      1: this.midGround,
      2: this.lowerGround,
      3: this.slope
    };
  };

  midGround = (world, object) => {
    let boundary = world.height - worldValues[1].mid;
    if (object.y + object.height > boundary) {
      object.y = boundary - object.height;
      object.jumping = false;
    }
  };

  lowerGround = (world, object) => {
    let boundary = world.height - worldValues[world.level].bot;
    if (object.y + object.height > boundary) {
      object.y = boundary - object.height;
      object.jumping = false;
    }
  };

  slope = (world, object) => {
    let slopeBottomX = 0;
    let playerPosition = world.x + object.x;
    let slopeBottomY =
      world.height -
      worldValues[world.level].mid -
      Math.tan((Math.PI * worldValues[1].slope) / 180) *
        (playerPosition - slopeBottomX);

    if (object.y + object.height > slopeBottomY) {
      let lastY = object.y;
      object.y = slopeBottomY - object.height;
    }
  };
}
