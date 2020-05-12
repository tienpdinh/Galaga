import Intro from './Intro';
import LevelOne from './LevelOne';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import playerSpaceshipImg from '../assets/models/playerSpaceship.glb';

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
  assets; // object containing assets for levels (like spaceship)

  constructor(engine, renderer, camera) {
    this.engine = engine;
    this.renderer = renderer;
    this.camera = camera;
  }

  init = async () => {
    // Load assets
    await this.loadAssets();

    // Set Intro as current level
    const firstLevel = Levels.INTRO;
    this.setLevel(firstLevel);
  };

  loadAssets = async () => {
    const promises = [this.loadGlb(playerSpaceshipImg)];

    // Convert resolved assetArr into assets object
    const assetArr = await Promise.all(promises);
    const assets = {
      playerSpaceship: assetArr[0].scene,
    };

    this.assets = assets;

    const playerSpaceship = assetArr[0].scene;

    const position = new THREE.Vector3(0, 0, 300);
    playerSpaceship.position.add(position);
    playerSpaceship.scale.sub(new THREE.Vector3(0.9, 0.9, 0.9));
    playerSpaceship.name = 'PlayerSpaceship';
    console.log(playerSpaceship);
    playerSpaceship.visible = false;
    this.engine.addMesh(playerSpaceship);

    // Promise.all(promises).then((assets) => assets);
    // Promise.resolve(spaceshipPromise).then(() => console.log(assets));
  };

  loadGlb = (glbFile) => {
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
      loader.load(glbFile, (data) => resolve(data), null, reject);
    });
    // return new Promise(() => {
    //   loader.load(
    //     glbFile,
    //     (gltf) => {
    //       const root = gltf.scene;
    //       // Update root to go into field of view
    //       const position = new THREE.Vector3(0, 0, 300);
    //       root.position.add(position);
    //       root.scale.sub(new THREE.Vector3(0.9, 0.9, 0.9));

    //       // console.log(root);
    //       // Add root to scene
    //       // this.assets.playerSpaceship = root;
    //       // return root;
    //       assets.playerSpaceship = root;
    //       return root;
    //       // this.assets.spaceshipObj.position.add(new THREE.Vector3(0, 0, 300));
    //     },
    //     // called while loading is progressing
    //     function (xhr) {
    //       console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    //     },
    //     // called when loading has errors
    //     function (error) {
    //       console.log('An error happened');
    //       console.error(error.message);
    //     }
    //   );
    // });
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
    this.update(dt);
    this.render();
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
}
