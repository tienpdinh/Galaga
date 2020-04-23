import * as THREE from "three";
import PhysicsEngine from "./physics/PhysicsEngine";
import Camera from "./rendering/Camera";

// App globals
const engine = new PhysicsEngine();

// Main app that starts the simulation
const App = () => {
  init(); // initialize app
  requestAnimationFrame(run); // start app
};

// Initialize the app
const init = () => {
  engine.init();
};

// Game loop. Updates game state, renders state, and recursively calls itself.
const run = (time) => {
  update(time);
  render();
  requestAnimationFrame(run);
};

// Updates the state of the game.
const update = (dt) => {
  dt *= 0.001; // convert time to seconds
  engine.update(dt);
};

// Renders the game
function render() {
  // Renderer
  const canvas = document.querySelector("#container");
  const renderer = new THREE.WebGLRenderer({ canvas });

  // Camera
  const camera = new Camera();
  resizeRendererToDisplaySize(renderer);
  camera.setAspect(canvas.clientWidth / canvas.clientHeight);

  // Scene
  const scene = engine.getScene();

  // Actually render scene with camera
  renderer.render(scene, camera);
}

// Helper function to make sure renderer and canvas sizes are aligned
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

export default App;
