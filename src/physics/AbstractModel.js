import * as THREE from 'three';
import { PhysicsObject, Vector } from 'simple-physics-engine';

export default class AbstractModel extends PhysicsObject {
  constructor(pos, options) {
    super(pos, options);
  }
}
