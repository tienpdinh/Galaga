import AbstractLevel from './AbstractLevel';
import Cube from '../physics/Cube';
import { Vector } from 'simple-physics-engine';

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
  }

  init = () => {
    this.spawnPlayer(new Vector(0, -70, 400));
    this.addEventListeners();
    this.spawnEnemies();
  };

  spawnPlayer = (pos) => {
    // The player will be initialized to the bottom middle of the screen
    this.player = new Cube(pos);
    this.engine.addObject(this.player);
  };

  spawnEnemies = () => {};

  movePlayer = (e) => {
    if (e.keyCode === 68) {
      // move right
      this.player.setVel(new Vector(0.1, 0, 0));
    }
    if (e.keyCode === 65) {
      // move left
      this.player.setVel(new Vector(-0.1, 0, 0));
    }
    if (e.keyCode === 87) {
      // move up
      this.player.setVel(new Vector(0, 0, -0.1));
    }
    if (e.keyCode === 83) {
      // move down
      this.player.setVel(new Vector(0, 0, 0.1));
    }
  };

  stopPlayer = (e) => {
    this.player.setVel(new Vector());
  };

  addEventListeners = () => {
    window.addEventListener('keydown', this.movePlayer, false);
    window.addEventListener('keyup', this.stopPlayer, false);
  };

  cleanup = () => {};
}
