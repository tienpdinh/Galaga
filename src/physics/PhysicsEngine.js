import * as THREE from 'three';
import { PhysicsEngine as AbstractPhysicsEngine } from 'simple-physics-engine';

export default class PhysicsEngine extends AbstractPhysicsEngine {
  scene;
  cube;

  constructor() {
    super();
  }

  init() {
    // Create Scene
    this.scene = new THREE.Scene();
  }

  // Return the scene instance
  getScene() {
    return this.scene;
  }

  // Add an object to internal objects list and the scene
  addObject(obj) {
    this.objects.push(obj);
    this.scene.add(obj.mesh);
  }

  // Add a mesh to the scene
  addMesh(mesh) {
    this.scene.add(mesh);
  }

  // Remove a mesh from the scene (garbage collection does not do this for you)
  removeMesh(mesh) {
    this.scene.remove(mesh);
  }
}
