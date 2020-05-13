import * as THREE from 'three';
import Enemy from '../physics/Enemy';
import { Vector, PhysicsObject } from 'simple-physics-engine';

export default class EnemyPack {
  pos; // the enemy in the pack will be equally distributed around this pack position
  enemies;
  enemiesPos;
  size;
  side;
  model;

  constructor(pos, model, size, engine, side = 0, numEnemies) {
    this.size = size;
    this.model = model;
    this.pos = pos;
    this.side = side;
    this.engine = engine;
    this.enemies = [];
    this.enemiesPos = [];
    this.generatePack(numEnemies);
  }

  isDead = () => {
    return this.enemies.length === 0;
  };

  respawn = (numEnemies) => {
    this.enemies = [];
    this.enemiesPos = [];
    this.generatePack(numEnemies);
  };

  generatePack = (numEnemies) => {
    let x;
    let z;
    if (this.side === 0) {
      this.side = this.randInt(1, 3);
    }
    if (this.side === 1) {
      // left of screen
      x = this.rand(-1400, -1200);
      z = this.rand(-200, 200);
    }
    if (this.side === 2) {
      // right of screen
      x = this.rand(1200, 1400);
      z = this.rand(-200, 200);
    }
    for (let i = 0; i < this.size; i++) {
      let enemyInitPos = new Vector(x + i * 20, 40 * i, z + i * 20);
      const name = `EnemySpaceship${numEnemies + i}`;
      let model = this.engine.getMeshByName(name);
      console.log(model, name, numEnemies);
      let enemy = new Enemy(enemyInitPos, model);
      enemy.setDesignatedPos(70 * i + this.pos.x, this.pos.y, this.pos.z);
      this.enemies.push(enemy);
      enemy.getCollider(); // needed for some reason to reset collider and get it working
    }
  };

  to1D = (m, n) => {
    return 5 * m + n;
  };

  rand = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  randInt = (min, max) => {
    return Math.floor(this.rand(min, max));
  };

  pulse = () => {
    // pulse animations for all enemies
  };
}
