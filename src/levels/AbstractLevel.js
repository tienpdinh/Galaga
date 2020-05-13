/**
 * Abstract class for a Level
 *
 * @class AbstractLevel
 */
export default class AbstractLevel {
  engine;
  renderer;
  camera;
  audio;
  assets;

  // callbacks from LevelManager
  onSwitchLevel;
  onToggleAudio;
  onSetAudio;

  constructor(
    engine,
    renderer,
    camera,
    { assets, onSwitchLevel, onToggleAudio, onSetAudio }
  ) {
    this.engine = engine;
    this.renderer = renderer;
    this.camera = camera;
    this.assets = assets;
    this.onSwitchLevel = onSwitchLevel;
    this.onToggleAudio = onToggleAudio;
    this.onSetAudio = onSetAudio;
  }

  // Abstract function
  init = () => {};

  // Abstract Function
  cleanup = () => {};

  toggleSoundOnKeyDown = (e) => {
    if (e.keyCode === 84) {
      // toggle sound on 't'
      this.onToggleAudio();
    }
  };
}
