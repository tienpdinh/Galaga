import GameObject from './GameObject';
import * as THREE from 'three';
import { Vector } from 'simple-physics-engine';

export default class Player extends GameObject {
  inMotion;
  constructor(pos, modelMesh) {
    super(pos, modelMesh);

    // Custom model updates
    modelMesh.scale.sub(new THREE.Vector3(0.95, 0.95, 0.95));
    modelMesh.name = 'PlayerSpaceship';
    modelMesh.rotation.y = 3.14;
    this.inMotion = false;
  }

  // Update state of cube... by default this just performs euleriean integration but I'm overriding it to directly add rotation
  update(dt) {
    super.update(dt);
    if (!this.inMotion) {
      this.setVel(Vector.mul(this.getVel(), 1 / 1.1));
    }
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
  }
}
