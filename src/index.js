import { WEBGL } from 'three/examples/jsm/WebGL.js';
import './index.css';
import App from './App';

if (WEBGL.isWebGLAvailable()) {
  // Initiate app here
  const app = new App();
  app.run();
} else {
  const warning = WEBGL.getWebGLErrorMessage();
  document.getElementById('container').appendChild(warning);
}
