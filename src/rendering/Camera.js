import * as THREE from 'three';

// Camera class
export default class Camera extends THREE.PerspectiveCamera {
  constructor() {
    const fov = 75; // field of view (75 degrees in vertical direction)
    const aspect = 2; // the canvas default
    const near = 2; // anything before this not rendered
    const far = 1500; // anything after this not rendered
    super(fov, aspect, near, far);

    // Bring camera behind
    this.position.z = 500;
    this.position.y = 20;
    this.lookAt(new THREE.Vector3(0, -0.2, 0));
    // Point camera down for 2D like simulation
    // this.position.z = 250; // halfway
    // this.position.y = 300; // above
    // const vecDown = new THREE.Vector3(0, -1, 250);
    // this.lookAt(vecDown);
  }

  setAspect(aspect) {
    this.aspect = aspect;
    this.updateProjectionMatrix();
  }
}
