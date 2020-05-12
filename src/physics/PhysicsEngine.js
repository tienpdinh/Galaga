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
    const liveObjects = [];
    for (let obj of this.objects) {
      if (!obj.isDead()) {
        obj.update(dt);
        liveObjects.push(obj);
      } else {
        this.removeMesh(obj.getMesh());
      }
    }
    this.objects = liveObjects;

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
    for (let i = this.objects.length - 1; i >= 0; i--) {
      for (let j = this.particleSystems.length - 1; j >= 0; j--) {
        let obj = this.objects[i];
        let ps = this.particleSystems[j];
        // Make sure particle system is a laser
        if (ps.type === PSystemType.LASER) {
          for (let p of ps.particles) {
            const isCollision = this.handleCollision(obj, p);
            if (isCollision) {
              // Kill ps and obj
              ps.kill();
              obj.kill();
              break;
            }
          }
        }
      }
    }
  }

  handleCollision(obj, p) {
    // Get colliders and intersect
    const objCollider = obj.getCollider();
    const pCollider = p.getCollider();
    pCollider.center = p.pos.copy();

    const intersectData = objCollider.intersect(pCollider);

    // If intersecting, do collision response
    if (intersectData.doesIntersect) {
      // console.log(`collision detected: `, obj, p);

      // Create explosion
      this.createParticleSystem(PSystemType.EXPLOSION, {
        pos: obj.pos,
      });

      // return true if collision
      return true;
    }

    // no collision
    return false;
  }

  // Return the scene instance
  getScene() {
    return this.scene;
  }

  // Add an object to internal objects list and the scene
  addObject(obj) {
    this.objects.push(obj);
    const mesh = obj.getMesh();
    mesh.name = name + toString(Math.random() * 1000);
    this.scene.add(mesh);
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

  getMeshByName(name) {
    return this.scene.getObjectByName(name);
  }

  // Remove a mesh from the scene (garbage collection does not do this for you)
  removeMesh(mesh) {
    this.scene.remove(mesh);
  }
}
