/**
 * Abstract class for a Level
 *
 * @class AbstractLevel
 */
export default class AbstractLevel {
  engine;
  renderer;
  camera;
  switchLevel;

  constructor(engine, renderer, camera, switchLevel) {
    this.engine = engine;
    this.renderer = renderer;
    this.camera = camera;
    this.switchLevel = switchLevel;
  }

  // Abstract function
  init = () => {};

  // Abstract Function
  cleanup = () => {};
}
