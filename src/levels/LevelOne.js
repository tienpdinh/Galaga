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
  cube;

  constructor(engine, renderer, camera, switchLevel) {
    super(engine, renderer, camera, switchLevel);
  }

  init = () => {
    // Cube
    this.cube = new Cube(new Vector());
    this.engine.addObject(this.cube);
  };

  cleanup = () => {};
}
