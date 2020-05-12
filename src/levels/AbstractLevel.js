/**
 * Abstract class for a Level
 *
 * @class AbstractLevel
 */
export default class AbstractLevel {
  engine;
  renderer;
  camera;
  assets;
  switchLevel;

  constructor(engine, renderer, camera, assets, switchLevel) {
    this.engine = engine;
    this.renderer = renderer;
    this.camera = camera;
    this.assets = assets;
    this.switchLevel = switchLevel;
  }

  // Abstract function
  init = () => {};

  // Abstract Function
  cleanup = () => {};
}
