import * as THREE from "three";
import {
  PhysicsEngine as AbstractPhysicsEngine,
  Vector,
} from "simple-physics-engine";
import Cube from "./Cube";

export default class PhysicsEngine extends AbstractPhysicsEngine {
  scene;
  cube;

  constructor() {
    super();
  }

  init() {
    // Scene
    this.scene = new THREE.Scene();

    // Cube
    this.cube = new Cube(new Vector());
    this.addObject(this.cube);
  }

  getScene() {
    return this.scene;
  }

  addObject(obj) {
    this.objects.push(obj);
    this.scene.add(obj.mesh);
  }
}
