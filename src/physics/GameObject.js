import * as THREE from 'three';
import { PhysicsObject, Vector, AABB } from 'simple-physics-engine';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default class GameObject extends PhysicsObject {
  geometry;
  material;
  mesh;
  width;
  height;
  depth;
  color;
  dead;

  constructor(pos, dim, col = 0x44aa88) {
    super(pos, {}); // Second parameter is init options like starting vel, etc

    this.dead = false;

    // Add AABB Collider
    this.width = dim[0];
    this.height = dim[1];
    this.depth = dim[2];
    const minExtents = pos.copy();
    const maxExtents = Vector.add(
      minExtents,
      new Vector(this.width, this.height, this.depth)
    );

    const aabbCollider = new AABB(minExtents, maxExtents);
    this.setCollider(aabbCollider);

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

  createMesh = () => {};

  getMesh = () => {
    return this.mesh;
  };

  setMesh = (mesh) => {
    this.mesh = mesh;
  };

  kill = () => {
    this.dead = true;
  };

  isDead = () => {
    return this.dead;
  };
}
