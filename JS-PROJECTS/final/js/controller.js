/*a controller object to manage key press states */
const controller = {
  left: false,
  right: false,
  up: false,
  down: false,
  jump: false,
  shoot: false,
  select: false,
  start: false,
  keyset: [65, 83, 68, 87, 88, 90],
  keyListener: event => {
    let keyState = event.type == 'keydown' ? true : false;
    if (controller.keyset.includes(event.keyCode)) {
      event.preventDefault();
    }
    switch (event.keyCode) {
      case 65: //A
        controller.left = keyState;
        break;
      case 83: //S
        controller.down = keyState;
        break;
      case 68: //D
        controller.right = keyState;
        break;
      case 87: //W
        controller.up = keyState;
        break;
      case 88: //X
        controller.jump = keyState;
        break;
      case 90: //Z
        controller.shoot = keyState;
      case 1: //Select
        controller.select = keyState;
        break;
      case 1: //Start
        controller.start = keyState;
    }
  }
};
const controller2 = {
  left: false,
  right: false,
  up: false,
  down: false,
  jump: false,
  shoot: false,
  keyset: [35, 37, 38, 39, 40, 45],
  keyListener: event => {
    let keyState = event.type == 'keydown' ? true : false;
    if (controller2.keyset.includes(event.keyCode)) {
      event.preventDefault();
    }
    switch (event.keyCode) {
      case 37: //A
        controller2.left = keyState;
        break;
      case 40: //S
        controller2.down = keyState;
        break;
      case 39: //D
        controller2.right = keyState;
        break;
      case 38: //W
        controller2.up = keyState;
        break;
      case 35: //X
        controller2.jump = keyState;
        break;
      case 45: //Z
        controller2.shoot = keyState;
    }
  }
};
