const gameAssets = {
  enemy1L: {
    src: './assets/enemy1L.png',
    w: 19,
    h: 33,
    frameCount: 6
  },
  soldier: {
    src: './assets/soldier.png',
    w: 19,
    h: 33,
    frameCount: 6
  },
  player1: { src: './assets/p1.png', w: 24, h: 45 },
  player2: { src: './assets/p21.png', w: 24, h: 45 },
  life1: {
    src: './assets/ExtraLifeBlue.png',
    w: 8,
    h: 16
  },
  life2: {
    src: './assets/ExtraLifeRed.png',
    w: 8,
    h: 16
  },
  sniper: { src: './assets/SniperDL.png', w: 16, h: 31 },
  sbsniper: { src: './assets/SandbagSniperL.png', w: 32, h: 17 },
  mechgun: { src: './assets/mechGun.png', w: 32, h: 48 },
  lastsniper: { src: './assets/lastShooter.png', w: 16, h: 31 },
  boss: { src: './assets/boss1.png', w: 238, h: 90, frames: 3 },
  bossGun: { src: './assets/bossGun.png', w: 14, h: 16 },
  almostDead: { src: './assets/almostDead.png', w: 23, h: 22, frames: 3 },
  hatch: { src: './assets/hatch.png', w: 42, h: 32 },
  bullet: { src: './assets/bullet1.png' },
  bulletE: { src: './assets/bulletE.png' },
  mgbullet: { src: './assets/mgbullet.png' },
  upgrade0: {
    src: './assets/powerups/MachineGun.png',
    w: 24,
    h: 16,
    upgrade: { reload: 8, size: 3 },
    type: 'upgrade'
  },
  upgrade1: {
    src: './assets/powerups/MegaShell.png',
    w: 24,
    h: 15,
    type: 'destroy'
  },
  upgrade2: {
    src: './assets/powerups/SpreadGun.png',
    w: 24,
    h: 15
  },
  enemyExplode: {
    src: './assets/explode.png',
    w: 32,
    h: 32,
    r: 16
  },
  capsule: { src: './assets/powerups/FlyingCapsule.png' },
  loadScreen: { src: './assets/loadscreen1.png' },
  button: { src: './assets/button.png', r: 8 }
};

function SOUND(src, loop) {
  this.sound = document.createElement('audio');
  this.sound.src = src;
  this.sound.loop = loop || false;
  this.sound.setAttribute('preload', 'auto');
  this.sound.setAttribute('controls', 'none');
  this.sound.style.display = 'none';
  document.body.appendChild(this.sound);
  this.play = () => {
    this.sound.currentTime = 0;
    this.sound.play();
  };
  this.stop = () => {
    this.sound.pause();
  };
}
const themeSound = new SOUND('./assets/audio/theme.mp3', true);
const shootSound = new SOUND('./assets/audio/normalShoot.wav');
const enemyShootSound = new SOUND('./assets/audio/enemyShoot.wav');
const enemyDeadSound = new SOUND('./assets/audio/enemyX.wav');
const playerDeadSound = new SOUND('./assets/audio/dead.wav');
const bossDeadSound = new SOUND('./assets/audio/bossDead.wav');
