class SpawnEnemies {
  constructor(world) {
    this.world = world;
    this.spawn = null;
    this.spawnList = SPAWNPOS.slice();
    this.trigger = false;
  }

  checkTriggerPosition = playerPosition => {
    let data = this.spawnList;
    for (let i = 0; i < data.length; i++) {
      let loc = data[i];
      if (loc.pos <= playerPosition) {
        console.log(this.spawnList);
        this.spawn = loc;
        this.spawnList.splice(i, 1);
        this.trigger = true;
        return loc.soldierPos;
      }
    }
    return null;
  };

  createEnemy = world => {
    if (this.trigger) {
      this.trigger = false;
      this.spawn.enemy.forEach(enemy => {
        let e = ENEMYCLASS[enemy.id](world);
        e.setPosition(enemy.x, world.screenHeight - enemy.y);
        world.enemies.push(e);
      });
    }
  };
}
