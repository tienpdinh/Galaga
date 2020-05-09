import AbstractModel from './AbstractModel';
import * as THREE from 'three';

export default class Enemy extends AbstractModel {
  geometry;
  material;
  mesh;
  width;
  height;
  depth;
  color;

  constructor(pos, dim = [15, 15, 15], col = 0xff0000) {
    super(pos, {}); // Second parameter is init options like starting vel, etc

    // Geometry
    this.width = dim[0];
    this.height = dim[1];
    this.depth = dim[2];
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

  // Update state of cube... by default this just performs euleriean integration but I'm overriding it to directly add rotation
  update(dt) {
    // Let's stop rotating for now
    // this.mesh.rotation.x = dt;
    // this.mesh.rotation.y = dt;
    super.update(dt);
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
  }
}
