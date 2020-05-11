import * as THREE from 'three';
import {
  PhysicsEngine as AbstractPhysicsEngine,
  Vector,
} from 'simple-physics-engine';
import ParticleSystem, { PSystemType } from './ParticleSystem';

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
    const livePsArr = [];
    for (let ps of this.particleSystems) {
      if (!ps.isDead() || ps.particles.length > 0) {
        ps.update(dt);
        livePsArr.push(ps);
      } else {
        this.removeMesh(ps.getMesh());
      }
    }

    this.particleSystems = livePsArr;
  }

  handleCollisions() {
    // Handle collisions between lasers and game objects
    for (let obj of this.objects) {
      const objCollider = obj.getCollider();
      for (let ps of this.particleSystems) {
        // Make sure particle system is a laser
        if (ps.type === PSystemType.LASER) {
          for (let p of ps.particles) {
            // Compare object against every particle in ps
            const pCollider = p.getCollider();
            pCollider.center = p.pos.copy();
            // console.log(obj, p);
            const intersectData = objCollider.intersect(pCollider);

            // If intersecting, do collision response
            if (intersectData.doesIntersect) {
              // TODO: Initialize explosion here, remove both laser and object
              console.log('Collision detected!');
              this.createParticleSystem(PSystemType.EXPLOSION, {
                pos: obj.pos,
              });
            }
          }
        }
      }
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
    this.addMesh(ps.getMesh());
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
