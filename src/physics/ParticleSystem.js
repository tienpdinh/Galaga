import * as THREE from 'three';
import {
  ParticleSystem as PSystem,
  Vector,
  Tween,
} from 'simple-physics-engine';

export const PSystemType = Object.freeze({
  STAR_TUNNEL: 1,
  LASER: 2,
});

export default class ParticleSystem extends PSystem {
  // THREE.js stuff
  type;
  geometry;
  geomParticles; // just particle positions array
  material;
  mesh;
  maxPoints;

  constructor() {
    super();
  }

  update = (dt) => {
    if (this.isDead() && this.particles.length === 0) return;

    const liveParticles = [];
    const positions = this.geometry.attributes.position.array;
    let idx = 0;

    // Loop through particles and update live particles
    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];
      if (!p.isDead()) {
        // particle still alive
        p.update(dt);
        liveParticles.push(p);
        positions[idx++] = p.pos.x;
        positions[idx++] = p.pos.y;
        positions[idx++] = p.pos.z;
      }
    }

    // If PSystem alive, generate more particles and push to liveParticles
    if (!this.isDead()) {
      this.lifespan -= dt;
      const newParticles = this.genParticles(dt);
      liveParticles.push(...newParticles);
    }
    this.particles = liveParticles;

    // Update geometry
    this.geometry.setDrawRange(0, this.particles.length % this.maxPoints);
    this.geometry.attributes.position.needsUpdate = true;
  };

  genParticles(dt) {
    const len = this.particles.length;
    if (len > this.maxPoints) return [];
    const numParticles = Math.round(this.genRate * dt);
    let idx = 0;
    const positions = this.geometry.attributes.position.array;
    const newParticles = [];
    for (let i = 0; i < numParticles; i++) {
      let p = this.genParticle();
      newParticles.push(p);
      positions[len * 3 + idx++] = p.pos.x;
      positions[len * 3 + idx++] = p.pos.y;
      positions[len * 3 + idx++] = p.pos.z;
      // this.geometry.vertices.push(new THREE.Vector3(p.pos.x, p.pos.y, p.pos.z));
    }
    return newParticles;
  }

  setPropsByType = (type, options) => {
    let props = {};
    if (type === PSystemType.STAR_TUNNEL) {
      props = this.getStarTunnelProps(options);
      this.type = PSystemType.STAR_TUNNEL;
    } else if (type === PSystemType.LASER) {
      props = this.getLaserProps(options);
      this.type = PSystemType.LASER;
    } else {
      throw new Error(
        `Trying to create unsupported particle system of type: "${type}"`
      );
    }

    this.setProps(props);

    this.maxPoints = 5000; // TODO: Actually calculate this from props and dt with buffer
  };

  getStarTunnelProps = (options) => {
    let props = StarTunnelProps;
    props = this.mergeOptionsWithProps(options, props);

    return props;
  };

  getLaserProps = (options) => {
    let props = LaserProps;
    props = this.mergeOptionsWithProps(options, props);

    return props;
  };

  mergeOptionsWithProps = (options, props) => {
    if (options.pos) props.posBase = options.pos;
    return props;
  };

  getMesh() {
    if (!this.mesh) {
      this.geometry = new THREE.BufferGeometry();
      this.geomParticles = new Float32Array(this.maxPoints * 3);
      this.geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(this.geomParticles, 3) // x,y,z==3
      );
      // this.material = new THREE.ShaderMaterial({
      //   uniforms: {
      //     texture: { type: 't', value: props.particleTexture },
      //   },
      //   vertexShader: particleVertexShader,
      //   fragmentShader: particleFragmentShader,
      //   transparent: true, // alphaTest: 0.5,  // if having transparency issues, try including: alphaTest: 0.5,
      //   blending: THREE.NormalBlending,
      //   depthTest: true,
      // });
      this.material = new THREE.PointsMaterial({
        // map: this.particleTexture,
        // TODO: Get above texture mapping to work
        color: new THREE.Color().setRGB(
          this.colorBase.x,
          this.colorBase.y,
          this.colorBase.z
        ),
        size: this.radiusBase,
        blending: this.blendStyle,
        transparent: true,
      });
      this.mesh = new THREE.Points(this.geometry, this.material);
    }

    return this.mesh;
  }
}

const StarTunnelProps = {
  posStyle: ParticleSystem.ShapeType.CUBE,
  posBase: new Vector(0, 0, 350),
  posSpread: new Vector(0.1, 0.1, 5),

  velStyle: ParticleSystem.ShapeType.CUBE,
  velBase: new Vector(0, 0, 0.2),
  velSpread: new Vector(0.1, 0.1, 0.1),

  angleBase: 0,
  angleSpread: 720,
  angleVelBase: 10,
  angleVelSpread: 0,

  particleTexture: new THREE.TextureLoader().load(
    '../assets/images/spikey.png'
  ),
  blendStyle: THREE.AdditiveBlending,

  radiusBase: 0.1,
  radiusSpread: 0,
  colorBase: new Vector(255, 255, 255), // H,S,L
  opacityBase: 1,

  // genRate: 20000,
  genRate: 0.8,
  particleLifespan: 600,
  lifespan: Infinity,
};

const LaserProps = {
  posStyle: ParticleSystem.ShapeType.CUBE,
  posSpread: new Vector(0.5, 0.5, 3),

  velStyle: ParticleSystem.ShapeType.CUBE,
  velBase: new Vector(0, 0, -0.4),
  velSpread: new Vector(0.001, 0.001, 0.1),

  angleBase: 0,
  angleSpread: 720,
  angleVelBase: 10,
  angleVelSpread: 0,

  particleTexture: new THREE.TextureLoader().load(
    '../assets/images/spikey.png'
  ),
  blendStyle: THREE.AdditiveBlending,

  radiusBase: 3,
  radiusSpread: 0,
  colorBase: new Vector(0, 0, 255), // RGB
  opacityBase: 1,

  // genRate: 20000,
  genRate: 1,
  particleLifespan: 700,
  lifespan: 1,
  isCollidable: true,
};
