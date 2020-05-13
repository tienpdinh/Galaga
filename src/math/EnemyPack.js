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

  constructor(pos, size, side = 0, assets) {
    this.size = size;
    this.pos = pos;
    this.side = side;
    this.assets = assets;
    this.enemies = [];
    this.enemiesPos = [];
    this.generatePack();
  }

  isDead = () => {
    return this.enemies.length === 0;
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
      let model = this.getAvailableEnemy();
      let enemy = new Enemy(enemyInitPos, model);
      enemy.setDesignatedPos(70 * i + this.pos.x, this.pos.y, this.pos.z);
      this.enemies.push(enemy);
      enemy.getCollider(); // needed for some reason to reset collider and get it working
    }
  };

  to1D = (m, n) => {
    return 5 * m + n;
  };

  getAvailableEnemy = () => {
    // Loop through enemies, return first enemy thats not visible
    for (let model of Object.values(this.assets)) {
      if (!model.visible) {
        return model;
      }
    }
    console.error('All models are in use!');
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
