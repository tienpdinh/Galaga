import Stats from 'stats.js';
import Intro from './Intro';
import LevelOne from './LevelOne';

const levelsArr = [Intro, LevelOne];

export const Levels = Object.freeze({
  INTRO: 0,
  LEVEL_ONE: 1,
  END: 2,
});

/**
 * Handles current level and initializing/cleaning up after levels
 *
 * @class LevelManager
 */
export default class LevelManager {
  engine;
  renderer;
  camera;
  curLevelEnum; // for indexing the levelsArr
  curLevel; // current level object
  stats; // like FPS and the like

  constructor(engine, renderer, camera) {
    this.engine = engine;
    this.renderer = renderer;
    this.camera = camera;
  }

  init = () => {
    // Set Intro as current level
    const firstLevel = Levels.INTRO;
    this.setLevel(firstLevel);
    this.createStats();
  };

  switchLevel = (levelEnum) => {
    // Cleanup and switch
    this.curLevel.cleanup();
    this.setLevel(levelEnum);
  };

  setLevel = (levelEnum) => {
    const Level = levelsArr[levelEnum];
    this.curLevelEnum = levelEnum;
    this.curLevel = new Level(
      this.engine,
      this.renderer,
      this.camera,
      this.assets,
      this.switchLevel // callback to switch to new level
    );
    this.curLevel.init();
  };

  // The actual game loop
  run = (dt) => {
    this.stats.begin();

    this.update(dt);
    this.render();

    this.stats.end();
  };

  // Updates the game state
  update = (dt) => {
    dt *= 0.001; // convert time to seconds
    this.engine.update(8);
  };

  // Renders the game
  render = () => {
    this.renderer.render(this.engine.getScene(), this.camera);
  };

  // To display things like fps
  createStats = () => {
    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);
  };
}
