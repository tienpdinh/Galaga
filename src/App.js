import * as THREE from 'three';
import PhysicsEngine from './physics/PhysicsEngine';
import LevelManager, { Levels } from './levels/LevelManager';
import Camera from './rendering/Camera';

/**
 * The main app to run the game. Initializes the game and then lets the LevelManager handle the rest
 *
 * @class App
 */
export default class App {
  engine;
  renderer;
  camera;
  levelManager;
  curLevel;

  // Initializes and runs the app
  run() {
    // Initialize app
    this.init();

    // Run game loop
    this.renderer.setAnimationLoop(this.levelManager.run);
  }

  // Initializes app
  init = () => {
    this.createPhysics();
    this.createRenderer();
    this.createCamera();
    this.addEventListeners();
    this.createLevelManager(); // Must be last
  };

  // Helper function to align renderer and canvas size
  onWindowResize = () => {
    if (this.renderer && this.camera) {
      const canvas = this.renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      this.camera.setAspect(canvas.clientWidth / canvas.clientHeight);
      this.renderer.setSize(width, height, false);
    }
  };

  // Initialize physics engine
  createPhysics = () => {
    this.engine = new PhysicsEngine();
    this.engine.init();
  };

  // Initialize renderer
  createRenderer = () => {
    const canvas = document.querySelector('#container');
    this.renderer = new THREE.WebGLRenderer({ canvas });
  };

  // Initialize camera
  createCamera = () => {
    this.camera = new Camera();
  };

  // Create Level manager
  createLevelManager = () => {
    this.levelManager = new LevelManager(
      this.engine,
      this.renderer,
      this.camera
    );
    this.levelManager.init();
  };

  // Add event listeners
  addEventListeners = () => {
    // Event listener for window resize
    window.addEventListener('resize', this.onWindowResize, false);
    this.onWindowResize();
  };
}
