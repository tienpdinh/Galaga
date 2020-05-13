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
    // Load Assets
    await this.loadAssets();

    // Set Intro as current level
    const firstLevel = Levels.INTRO;
    this.setLevel(firstLevel);

    // Show stats
    this.createStats();
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
    const enemySpaceship0 = assetArr[1].scene;
    const enemySpaceship1 = enemySpaceship0.clone(true);
    const enemySpaceship2 = enemySpaceship0.clone(true);
    const enemySpaceship3 = enemySpaceship0.clone(true);
    const enemySpaceship4 = enemySpaceship0.clone(true);
    const enemySpaceship5 = enemySpaceship0.clone(true);
    const enemySpaceship6 = enemySpaceship0.clone(true);
    const enemySpaceship7 = enemySpaceship0.clone(true);
    const enemySpaceship8 = enemySpaceship0.clone(true);
    const enemySpaceship9 = enemySpaceship0.clone(true);
    const enemySpaceship10 = enemySpaceship0.clone(true);

    // Set init properties of spaceships
    this.setPlayerModel(playerSpaceship);
    this.setEnemyModel(enemySpaceship0, 'EnemySpaceship0');
    this.setEnemyModel(enemySpaceship1, 'EnemySpaceship1');
    this.setEnemyModel(enemySpaceship2, 'EnemySpaceship2');
    this.setEnemyModel(enemySpaceship3, 'EnemySpaceship3');
    this.setEnemyModel(enemySpaceship4, 'EnemySpaceship4');
    this.setEnemyModel(enemySpaceship5, 'EnemySpaceship5');
    this.setEnemyModel(enemySpaceship6, 'EnemySpaceship6');
    this.setEnemyModel(enemySpaceship7, 'EnemySpaceship7');
    this.setEnemyModel(enemySpaceship8, 'EnemySpaceship8');
    this.setEnemyModel(enemySpaceship9, 'EnemySpaceship9');
    this.setEnemyModel(enemySpaceship10, 'EnemySpaceship10');

    // Set this.assets for future use
    this.assets = {
      playerSpaceship,
      enemySpaceship0,
      enemySpaceship1,
      enemySpaceship2,
      enemySpaceship3,
      enemySpaceship4,
      enemySpaceship5,
      enemySpaceship6,
      enemySpaceship7,
      enemySpaceship8,
      enemySpaceship9,
      enemySpaceship10,
    };

    // Add assets to engine
    for (let asset of Object.values(this.assets)) {
      this.engine.addMesh(asset);
    }
  };

  setPlayerModel = (playerModel) => {
    playerModel.name = 'PlayerSpaceship';
    playerModel.scale.sub(new THREE.Vector3(0.95, 0.95, 0.95));
    playerModel.rotation.y = 3.14;
    playerModel.visible = false;
  };

  setEnemyModel = (enemyModel, name) => {
    enemyModel.name = name;
    enemyModel.visible = false;
    enemyModel.scale.add(new THREE.Vector3(3, 3, 3));
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
    if (this.stats) this.stats.begin();

    this.update(dt);
    this.render();

    if (this.stats) this.stats.end();
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
    if (this.audio && this.audio.isPlaying) {
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
      audio.setVolume(0.4);
      audio.play();
    });
  };
}
