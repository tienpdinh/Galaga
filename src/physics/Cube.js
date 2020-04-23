import * as THREE from "three";
import { PhysicsObject } from "simple-physics-engine";

export default class Cube extends PhysicsObject {
  geometry;
  material;
  mesh;

  constructor(pos) {
    super(pos, {}); // Second parameter is init options like starting vel, etc

    // Geometry
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    this.geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    // Material
    this.material = new THREE.MeshBasicMaterial({
      color: 0x44aa88, // greenish blue
    });

    // Mesh
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  // Update state of cube... by default this just performs euleriean integration but I'm overriding it to directly add rotation
  update(dt) {
    this.mesh.rotation.x = dt;
    this.mesh.rotation.y = dt;
  }
}
