import * as THREE from "three";
import PhysicsEngine from "./physics/PhysicsEngine";
import Camera from "./rendering/Camera";

export default class App {
  engine;
  renderer;
  camera;

  // Initializes and runs the app
  run() {
    // Initialize app
    this.init();

    // Run game loop
    this.renderer.setAnimationLoop(this.animate);
  }

  // Initializes app
  init = () => {
    // Physics engine
    this.engine = new PhysicsEngine();
    this.engine.init();

    // Renderer
    const canvas = document.querySelector("#container");
    this.renderer = new THREE.WebGLRenderer({ canvas });

    // Camera
    this.camera = new Camera();

    // Add event listeners to window
    window.addEventListener("resize", this.onWindowResize, false);
    this.onWindowResize();
  };

  // Game loop
  animate = (dt) => {
    this.update(dt);
    this.render();
  };

  // Updates the game state
  update = (dt) => {
    dt *= 0.001; // convert time to seconds
    this.engine.update(dt);
  };

  // Renders the game
  render = () => {
    // Render scene with camera
    this.renderer.render(this.engine.getScene(), this.camera);
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
}
