import * as THREE from 'three';
import { PhysicsObject, Vector, AABB } from 'simple-physics-engine';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default class GameObject extends PhysicsObject {
  mesh;
  dim;
  dead;
  minExtentMesh;
  maxExtentMesh;

  constructor(pos, modelMesh, dim = new Vector(15, 15, 15)) {
    super(pos, {}); // Second parameter is init options like starting vel, etc

    this.dead = false;

    // Add AABB Collider
    this.dim = dim;
    const minExtents = Vector.sub(pos, Vector.div(dim, 2));
    const maxExtents = Vector.add(pos, Vector.div(dim, 2));
    // TODO: Update AABB Collider with model size

    const aabbCollider = new AABB(minExtents, maxExtents);
    this.setCollider(aabbCollider);

    if (modelMesh) {
      modelMesh.position.add(pos);
      this.mesh = modelMesh;
    } else {
      const redColor = new THREE.Color(0xff0000); // red
      this.mesh = createBoxedMesh(dim, pos, redColor);
    }
  }

  getMesh = () => {
    return this.mesh;
  };

  getColliderMesh = () => {
    return this.colliderMesh;
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

const createBoxedMesh = (dim, pos, color) => {
  // Geometry
  const geometry = new THREE.BoxGeometry(dim.x, dim.y, dim.z);
  // Material
  const material = new THREE.MeshBasicMaterial({
    color,
  });
  // Mesh
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(pos.x, pos.y, pos.z);

  return mesh;
};
