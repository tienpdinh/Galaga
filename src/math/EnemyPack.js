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

  constructor(pos, model, size, side = 0) {
    this.size = size;
    this.model = model;
    this.pos = pos;
    this.side = side;
    this.enemies = [];
    this.enemiesPos = [];
    this.generatePack();
  }

  isDead = () => {
    for (let enemy of this.enemies) {
      if (!enemy.isDead()) {
        return false;
      }
    }
    return true;
  };

  respawn = () => {
    this.enemies = [];
    this.enemiesPos = [];
    this.generatePack();
  };

  generatePack = () => {
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
      // let modelClone = this.model.clone(true);
      let modelClone = null;
      let enemy = new Enemy(enemyInitPos, modelClone);
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
