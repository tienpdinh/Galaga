import * as THREE from 'three';
import PhysicsEngine from './physics/PhysicsEngine';
import LevelManager from './levels/LevelManager';
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
    this.createLights();
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

  createLights = () => {
    // not really sure how these lights work but i can see things
    var hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 300, 0).normalize;
    this.engine.scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xcccccc);
    this.engine.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 1, 1).normalize();
    this.engine.scene.add(directionalLight);
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
