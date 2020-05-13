import * as THREE from 'three';
import { PhysicsObject, Vector, AABB } from 'simple-physics-engine';

export const ObjectType = Object.freeze({
  PLAYER: 1,
  ENEMY: 2,
});

export default class GameObject extends PhysicsObject {
  type;
  mesh;
  colliderMesh; // for help with debugging
  dim;
  dead;

  constructor(
    type,
    pos,
    modelMesh,
    dim = new Vector(15, 15, 15),
    color = new Vector(0, 1, 0.5)
  ) {
    super(pos, {}); // Second parameter is init options like starting vel, etc

    this.type = type;
    this.color = color;
    this.dead = false;

    // Add AABB Collider
    this.dim = dim;
    const minExtents = Vector.sub(pos, Vector.div(dim, 2));
    const maxExtents = Vector.add(pos, Vector.div(dim, 2));

    const aabbCollider = new AABB(minExtents, maxExtents);
    this.setCollider(aabbCollider);

    // Add model mesh
    modelMesh.position.add(pos);
    this.mesh = modelMesh;

    // For collider debugging
    const showCollider = false;

    if (showCollider) {
      // Add collider mesh for debugging
      this.colliderMesh = createBoxedMesh(dim, pos, color);
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
