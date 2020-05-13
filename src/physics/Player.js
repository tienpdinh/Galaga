import GameObject from './GameObject';
import * as THREE from 'three';

export default class Player extends GameObject {
  constructor(pos, modelMesh) {
    super(pos, modelMesh);

    // Custom model updates
    modelMesh.scale.sub(new THREE.Vector3(0.95, 0.95, 0.95));
    modelMesh.name = 'PlayerSpaceship';
    modelMesh.rotation.y = 3.14;
  }

  moveRight = (vel) => {
    this.setVel(vel);
    this.mesh.rotation.x = 10;
  };

  // Update state of cube... by default this just performs euleriean integration but I'm overriding it to directly add rotation
  update(dt) {
    super.update(dt);
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
  }
}
