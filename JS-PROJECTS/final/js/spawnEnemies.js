class SpawnEnemies {
  constructor() {
    this.spawnSet = [];
    this.init();
  }

  init() {
    let enemySet = [];
    enemySet.forEach(x => {
      let spawn = new Spawn();
      this.spawnSet.push(spawn);
    });
  }
}
class Spawn {
  constructor(x) {}
}
