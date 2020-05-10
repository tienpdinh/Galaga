import { Vector } from 'simple-physics-engine';
import AbstractLevel from './AbstractLevel';
import Player from '../physics/Player';
import Enemy from '../physics/Enemy';
import { PSystemType } from '../physics/ParticleSystem';

/**
 * Probably the only level this game will have. The actual game functionality goes in here
 *
 * @class LevelOne
 * @extends {AbstractLevel}
 */
export default class LevelOne extends AbstractLevel {
  enemies;
  player;

  constructor(engine, renderer, camera, switchLevel) {
    super(engine, renderer, camera, switchLevel);
    this.enemies = [];
  }

  init = () => {
    this.spawnPlayer();
    this.addEventListeners();
    this.spawnEnemies();
  };

  spawnPlayer = () => {
    // The player will be initialized to the bottom middle of the screen
    this.player = new Player(new Vector(0, -20, 450));
    this.engine.addObject(this.player);
  };

  spawnEnemies = () => {
    const enemy1 = new Enemy(new Vector(-70, -20, 150));
    const enemy2 = new Enemy(new Vector(0, -20, 150));
    const enemy3 = new Enemy(new Vector(70, -20, 150));
    this.enemies.push(enemy1, enemy2, enemy3);
    for (let enemy of this.enemies) {
      this.engine.addObject(enemy);
    }
  };

  movePlayer = (e) => {
    if (e.keyCode === 68 || e.keyCode === 39) {
      // move right
      this.player.setVel(new Vector(0.3, 0, 0));
    }
    if (e.keyCode === 65 || e.keyCode === 37) {
      // move left
      this.player.setVel(new Vector(-0.3, 0, 0));
    }
    if (e.keyCode === 87 || e.keyCode === 38) {
      // move up
      this.player.setVel(new Vector(0, 0, -0.3));
    }
    if (e.keyCode === 83 || e.keyCode === 40) {
      // move down
      this.player.setVel(new Vector(0, 0, 0.3));
    }
  };

  stopPlayer = (e) => {
    this.player.setVel(new Vector());
  };

  spawnLaser = (e) => {
    const keyCode = 32; // SPACE
    const { pos } = this.player;
    if (e.keyCode === keyCode) {
      // TODO: Create laser particle system shooting out in z direction
      this.engine.createParticleSystem(PSystemType.LASER, { pos });
    }
  };

  addEventListeners = () => {
    window.addEventListener('keydown', this.movePlayer, false);
    window.addEventListener('keyup', this.stopPlayer, false);
    window.addEventListener('keypress', this.spawnLaser, false);
  };

  cleanup = () => {};
}
