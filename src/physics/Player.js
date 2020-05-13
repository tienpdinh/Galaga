import GameObject, { ObjectType } from './GameObject';
import * as THREE from 'three';
import { Vector } from 'simple-physics-engine';

const color = new Vector(0.52, 1, 0.45);

export default class Player extends GameObject {
  inMotion;
  health;
  oldHealth;

  constructor(pos, modelMesh) {
    super(ObjectType.PLAYER, pos, modelMesh, new Vector(70, 10, 25), color);

    // Custom model updates
    // modelMesh.visible = true;
    // modelMesh.scale.sub(new THREE.Vector3(0.95, 0.95, 0.95));
    // modelMesh.name = 'PlayerSpaceship';
    // modelMesh.rotation.y = 3.14;
    this.inMotion = false;
    this.health = 100;
    this.oldHealth = 100;
  }

  kill = () => {
    this.oldHealth = this.health;
    this.health -= 20;
    let healthHTML = document.getElementById('health');
    healthHTML.value -= 20;
    if (healthHTML.value < 50) {
      healthHTML.style.background = 'rgb(128,8,4)';
    }
    if (this.health <= 0) {
      this.dead = true;
    }
  };

  // Update state of player
  update(dt) {
    super.update(dt);

    if (!this.inMotion) {
      this.setVel(Vector.mul(this.getVel(), 1 / 1.1));
    }

    // Boundary checks
    const topX = 55;
    const floorX = -75;
    const topY = 70;
    const floorY = -25;
    const topZ = 430;
    const floorZ = 350;

    const pos = this.pos;
    pos.x = Math.min(pos.x, topX);
    pos.x = Math.max(pos.x, floorX);
    pos.y = Math.min(pos.y, topY);
    pos.y = Math.max(pos.y, floorY);
    pos.z = Math.min(pos.z, topZ);
    pos.z = Math.max(pos.z, floorZ);

    // Update mesh position
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);

    if (this.colliderMesh) {
      const colliderPos = this.getCollider().getCenter();
      this.colliderMesh.position.set(
        colliderPos.x,
        colliderPos.y,
        colliderPos.z
      );
    }
  }
}
