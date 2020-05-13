import * as THREE from 'three';
import {
  PhysicsEngine as AbstractPhysicsEngine,
  Vector,
} from 'simple-physics-engine';
import ParticleSystem, { PSystemType } from './ParticleSystem';
import { ObjectType } from './GameObject';

export default class PhysicsEngine extends AbstractPhysicsEngine {
  scene;
  particleSystems;
  kills;

  // Callbacks that are set
  onPlayerDeath;
  updateLevel;

  constructor() {
    super();
  }

  init() {
    // Create Scene
    this.scene = new THREE.Scene();
    this.particleSystems = [];
    this.kills = 0;
  }

  update(dt) {
    // Handle collisions
    this.handleCollisions();

    // Call custom update if available
    if (this.updateLevel) {
      this.updateLevel(dt);
    }

    // Update objects
    const liveObjects = [];
    for (let obj of this.objects) {
      if (!obj.isDead()) {
        obj.update(dt);
        liveObjects.push(obj);
      } else {
        // Check for player death
        if (obj.type === ObjectType.PLAYER) {
          this.onPlayerDeath();
        }
        this.kills++;
        // this.removeMesh(obj.getMesh());
        obj.mesh.visible = false;
        if (obj.colliderMesh) {
          this.removeMesh(obj.colliderMesh);
        }
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
    // Mesh already in engine
    // const mesh = obj.getMesh();
    // mesh.name = name + toString(Math.random() * 10000); // make sure name is unique
    // this.scene.add(mesh);

    // Add collider mesh?
    if (obj.colliderMesh) {
      this.addMesh(obj.colliderMesh);
    }
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

  getKills() {
    return this.kills;
  }

  // Remove all particle systems except star tunnel, remove all objects
  teardown() {
    // Remove all objects
    for (let object of this.objects) {
      this.removeMesh(object.getMesh());
      if (object.colliderMesh) {
        this.removeMesh(object.colliderMesh);
      }
    }
    this.objects = [];
  }
}
