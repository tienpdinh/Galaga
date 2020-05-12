import GameObject from './GameObject';
import { Vector } from 'simple-physics-engine';
import * as THREE from 'three';

// TODO: There can only be a maximum of 15 enemies at a time
// they spawn randomly outside the view of the player,
// then make their way to their designated spot in the 5x3 grid
// after they aligned, they will start pulsing animation, mainly
// to make it harder for player to shoot at them, after pulsing
// they will start steering toward the direction where the player
// is currently at, mainly to collide with the player and destroy
// the player's ship, while moving, they also try to attack by shooting
// the player, in the direction they are facing.

export default class Enemy extends GameObject {
  designatedPos;
  phase;

  constructor(pos, modelMesh) {
    super(pos, modelMesh);

    // Custom model stuff
    if (modelMesh) {
      modelMesh.scale.sub(new THREE.Vector3(0.999, 0.999, 0.999));
      // modelMesh.name = 'EnemySpaceship';
      modelMesh.rotation.y = 3.14;
    }

    this.phase = 1; // Alignment
  }

  setDesignatedPos = (x, y, z) => {
    this.designatedPos = new Vector(x, y, z);
  };

  setPhase = (phase) => {
    this.phase = phase;
  };

  isAtGoal = () => {
    return Vector.distance(this.pos, this.designatedPos) < 5;
  };

  // Update state of cube... by default this just performs euleriean integration but I'm overriding it to directly add rotation
  update(dt) {
    // Moves toward the designated spot
    super.update(dt);
    this.setVel(new Vector());
    if (this.phase === 1 && !this.isAtGoal()) {
      let velocity = Vector.sub(this.designatedPos, this.pos);
      velocity.normalize();
      velocity.mul(0.7);
      this.setVel(velocity);
    }
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
  }
}
