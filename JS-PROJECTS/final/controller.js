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
  keyListener: event => {
    let keyState = event.type == 'keydown' ? true : false;
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
