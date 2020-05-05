import * as THREE from 'three';
import {
  PhysicsEngine as AbstractPhysicsEngine,
  Vector,
} from 'simple-physics-engine';
import ParticleSystem from './ParticleSystem';

export default class PhysicsEngine extends AbstractPhysicsEngine {
  scene;
  particleSystems;

  constructor() {
    super();
  }

  init() {
    // Create Scene
    this.scene = new THREE.Scene();
    this.particleSystems = [];
  }

  update(dt) {
    // Handle collisions
    this.handleCollisions();

    // Update objects
    for (let obj of this.objects) {
      obj.update(dt);
    }

    // Update particle systems
    for (let ps of this.particleSystems) {
      ps.update(dt);
    }
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

  createParticleSystem(type, options = {}) {
    const ps = new ParticleSystem();
    ps.setPropsByType(type, options);
    this.particleSystems.push(ps);
    this.scene.add(ps.getMesh());
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
