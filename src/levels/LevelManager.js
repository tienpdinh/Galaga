import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Stats from 'stats.js';
import Intro from './Intro';
import LevelOne from './LevelOne';
import Credits from './Credits';
import playerSpaceshipImg from '../assets/models/playerSpaceship.glb';
import enemySpaceshipImg from '../assets/models/enemySpaceship.glb';

const levelsArr = [Intro, LevelOne, Credits];

export const Levels = Object.freeze({
  INTRO: 0,
  LEVEL_ONE: 1,
  CREDITS: 2,
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
  audio;
  curLevelEnum; // for indexing the levelsArr
  curLevel; // current level object
  stats; // like FPS and the like
  assets;

  constructor(engine, renderer, camera) {
    this.engine = engine;
    this.renderer = renderer;
    this.camera = camera;
  }

  init = async () => {
    this.createStats();

    // Load Assets
    // TODO: Loading message
    await this.loadAssets();

    // Set Intro as current level
    const firstLevel = Levels.INTRO;
    this.setLevel(firstLevel);
  };

  loadAssets = async () => {
    const promises = [
      this.loadGlb(playerSpaceshipImg),
      this.loadGlb(enemySpaceshipImg),
    ];

    // Convert resolved assetArr into assets object
    const assetArr = await Promise.all(promises);

    // Get spaceships
    const playerSpaceship = assetArr[0].scene;
    const enemySpaceship = assetArr[1].scene;

    // Set this.assets for future use
    playerSpaceship.name = 'PlayerSpaceship';

    // Set this.assets for future use
    this.assets = {
      playerSpaceship,
      enemySpaceship,
    };
  };

  loadGlb = (glbFile) => {
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
      loader.load(glbFile, (data) => resolve(data), null, reject);
    });
  };

  onSwitchLevel = (levelEnum) => {
    // Cleanup and switch
    this.curLevel.cleanup();
    this.setLevel(levelEnum);
  };

  setLevel = (levelEnum) => {
    const Level = levelsArr[levelEnum];
    this.curLevelEnum = levelEnum;
    const { onSwitchLevel, onToggleAudio, onSetAudio, assets } = this;
    this.curLevel = new Level(this.engine, this.renderer, this.camera, {
      onSwitchLevel,
      onToggleAudio,
      onSetAudio,
      assets,
    });
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

  // Toggles Audio
  onToggleAudio = () => {
    if (this.audio.isPlaying) this.audio.pause();
    else this.audio.play();
  };

  onSetAudio = (gameplaySound) => {
    if (this.audio) {
      this.audio.stop();
    }

    const audioLoader = new THREE.AudioLoader();
    const listener = new THREE.AudioListener();
    this.audio = new THREE.Audio(listener);
    this.audio.crossOrigin = 'anonymous';

    const audio = this.audio;
    audioLoader.load(gameplaySound, function (buffer) {
      audio.setBuffer(buffer);
      audio.setLoop(true);
      audio.play();
    });
  };
}
