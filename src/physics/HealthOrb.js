import GameObject, { ObjectType } from './GameObject';
import * as THREE from 'three';
import { Vector } from 'simple-physics-engine';

export default class HealthOrb extends GameObject {
  constructor(pos, modelMesh) {
    super(ObjectType.HEALTH_ORB, pos, modelMesh, new Vector(15, 15, 15));
  }
}
