class SpawnEnemies {
  constructor() {
    this.spawnSet = [];
    this.init();
  }

  init() {
    let floorDimensions = [];
    floorDimensions.forEach(x => {
      let newFloor = new Spawn();
      this.groundSet.push(newFloor);
    });
  }
}
class Spawn {
  constructor(x) {}
}
