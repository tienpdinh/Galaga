import * as THREE from 'three';
import Enemy from '../physics/Enemy';
import { Vector } from 'simple-physics-engine';

export default class EnemyPack {
  pos; // the enemy in the pack will be equally distributed around this pack position
  enemies;
  enemiesPos;

  constructor() {
    // Enemies designated spots
    this.enemiesPos.push(new Vector(-140, -20, 200));
    this.enemiesPos.push(new Vector(-70, -20, 200));
    this.enemiesPos.push(new Vector(0, -20, 200));
    this.enemiesPos.push(new Vector(70, -20, 200));
    this.enemiesPos.push(new Vector(140, -20, 200));
    this.enemiesPos.push(new Vector(-140, -20, 150));
    this.enemiesPos.push(new Vector(-70, -20, 150));
    this.enemiesPos.push(new Vector(0, -20, 150));
    this.enemiesPos.push(new Vector(70, -20, 150));
    this.enemiesPos.push(new Vector(140, -20, 150));
    this.enemiesPos.push(new Vector(-140, -20, 100));
    this.enemiesPos.push(new Vector(-70, -20, 100));
    this.enemiesPos.push(new Vector(0, -20, 100));
    this.enemiesPos.push(new Vector(70, -20, 100));
    this.enemiesPos.push(new Vector(140, -20, 100));

    // Actual enemies
    // spawning them at random positions outside the player's view
    for (let i = 0; i < 15; i++) {
      let enemy = new Enemy();
      this.enemies.push();
    }
  }

  to1D = (m, n) => {
    return 5 * m + n;
  };

  rand = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  pulse = () => {
    // pulse animations for all players
  };
}
