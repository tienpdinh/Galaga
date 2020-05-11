import AbstractModel from './AbstractModel';
import * as THREE from 'three';
import { Vector, AABB } from 'simple-physics-engine';

// TODO: There can only be a maximum of 15 enemies at a time
// they spawn randomly outside the view of the player,
// then make their way to their designated spot in the 5x3 grid
// after they aligned, they will start pulsing animation, mainly
// to make it harder for player to shoot at them, after pulsing
// they will start steering toward the direction where the player
// is currently at, mainly to collide with the player and destroy
// the player's ship, while moving, they also try to attack by shooting
// the player, in the direction they are facing.

export default class Enemy extends AbstractModel {
  geometry;
  material;
  mesh;
  width;
  height;
  depth;
  color;

  designatedPos;

  constructor(pos, dim = [15, 15, 15], col = 0xff0000) {
    super(pos, {}); // Second parameter is init options like starting vel, etc

    // Add AABB Collider
    this.width = dim[0];
    this.height = dim[1];
    this.depth = dim[2];
    const minExtents = pos.copy();
    const maxExtents = Vector.add(
      minExtents,
      new Vector(this.width, this.height, this.depth)
    );
    this.setCollider(new AABB(minExtents, maxExtents));

    // Geometry

    this.color = col;
    this.geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);

    // Material
    this.material = new THREE.MeshBasicMaterial({
      color: this.color, // greenish blue
    });

    // Mesh
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(pos.x, pos.y, pos.z);
  }

  setDesignatedPos(x, z) {
    this.designatedPos = new Vector(x, 0, z);
  }

  // Update state of cube... by default this just performs euleriean integration but I'm overriding it to directly add rotation
  update(dt) {
    // Let's stop rotating for now
    // this.mesh.rotation.x = dt;
    // this.mesh.rotation.y = dt;
    super.update(dt);
  }
}
