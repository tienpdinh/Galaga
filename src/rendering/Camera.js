import * as THREE from "three";

// Camera class
export default class Camera extends THREE.PerspectiveCamera {
  constructor() {
    const fov = 75; // field of view (75 degrees in vertical direction)
    const aspect = 2; // the canvas default
    const near = 0.1; // anything before this not rendered
    const far = 10; // anything after this not rendered
    super(fov, aspect, near, far);

    this.position.z = 2;
  }

  setAspect(aspect) {
    this.aspect = aspect;
    this.updateProjectionMatrix();
  }
}
