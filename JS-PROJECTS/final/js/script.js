const SCALE = 2;
const IMAGESIZE = { x: 3584, y: 720 };
const SCREEN = { width: 280, height: 224 };

const canvas = document.getElementById('app');
const ctx = canvas.getContext('2d');

canvas.width = SCREEN.width * SCALE;
canvas.height = SCREEN.height * SCALE;

let _assetCount = 0;
let _loaded = 0;

Object.keys(gameAssets).forEach(key => {
  _assetCount++;
  let img = new Image();
  img.src = gameAssets[key].src;
  img.onload = () => {
    gameAssets[key].img = img;
    _loaded++;
    if (_loaded == _assetCount) {
      gameAssets.upgrade0.upgrade.image = gameAssets.mgbullet.img;
      new Game().init(); //initialize game object
    }
  };
});

const showControls = () => {
  let controlInfo = document.getElementById('container');
  controlInfo.style.width = SCREEN.width * SCALE + 'px';
  let hide = document.createElement('div');
  hide.innerHTML = 'hide';
  hide.classList.add('hide');
  controlInfo.appendChild(hide);

  let controls = document.createElement('div');
  controls.style.display = 'block';
  let controlTitles = ['up', 'down', 'left', 'right', 'shoot', 'jump'];
  let control1 = ['w ', 's', 'a', 'd', 'z', 'x'];
  let control2 = ['8 ', '2', '4', '6', '1', '0'];

  let list = document.createElement('ul');
  let title = document.createElement('li');
  title.innerHTML = 'player 1'.toUpperCase();
  list.appendChild(title);
  controlTitles.forEach((x, i) => {
    let item = document.createElement('li');
    item.innerHTML = x.toUpperCase() + ' : ' + control1[i].toUpperCase();
    list.appendChild(item);
  });
  let item = document.createElement('li');
  item.innerHTML = 'SELECT : ENTER';
  list.appendChild(item);
  list.classList.add('p1Controls');
  controls.appendChild(list);

  let list2 = list.cloneNode();
  let title2 = title.cloneNode();
  title2.innerHTML = 'player 2'.toUpperCase();
  list2.appendChild(title2);

  controlTitles.forEach((x, i) => {
    let item = document.createElement('li');
    item.innerHTML = x.toUpperCase() + ' : NUM' + control2[i];
    list2.appendChild(item);
  });
  list2.classList.add('p2Controls');
  controls.appendChild(list2);

  controls.classList.add('controls');
  controlInfo.appendChild(controls);

  hide.onclick = () => {
    controls.style.display =
      controls.style.display == 'block' ? 'none' : 'block';
    hide.innerHTML = controls.style.display == 'block' ? 'hide' : 'show';
  };
};
//show game controls below canvas
showControls();
