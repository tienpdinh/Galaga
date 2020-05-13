import * as THREE from 'three';
import { PhysicsObject, Vector, AABB } from 'simple-physics-engine';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default class GameObject extends PhysicsObject {
  mesh;
  width;
  height;
  depth;
  color;
  dead;

  constructor(pos, modelMesh, dim = [15, 15, 15]) {
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
    // TODO: Update AABB Collider with model size

    const aabbCollider = new AABB(minExtents, maxExtents);
    this.setCollider(aabbCollider);

    if (modelMesh) {
      modelMesh.position.add(pos);
      this.mesh = modelMesh;
    } else {
      // Geometry
      const geometry = new THREE.BoxGeometry(
        this.width,
        this.height,
        this.depth
      );
      // Material
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0xff0000), // red
      });
      // Mesh
      this.mesh = new THREE.Mesh(geometry, material);
      this.mesh.position.set(pos.x, pos.y, pos.z);
    }
  }

  getMesh = () => {
    return this.mesh;
  };

  lookAt = (point) => {
    this.mesh.lookAt(point);
  };

  kill = () => {
    this.dead = true;
  };

  isDead = () => {
    return this.dead;
  };
}
