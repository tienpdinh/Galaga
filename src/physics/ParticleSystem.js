import * as THREE from 'three';
import {
  ParticleSystem as PSystem,
  Vector,
  Tween,
} from 'simple-physics-engine';

export default class ParticleSystem extends PSystem {
  // THREE.js stuff
  geometry;
  material;
  mesh;

  constructor() {
    super();
  }

  update = (dt) => {
    if (this.isDead() && this.particles.length === 0) return;

    const liveParticles = [];
    const threeLiveParticles = [];

    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];
      if (!p.isDead()) {
        // particle still alive
        p.update(dt);
        liveParticles.push(p);
        threeLiveParticles.push(new THREE.Vector3(p.pos.x, p.pos.y, p.pos.z));
      }
    }

    this.particles = liveParticles;
    this.geometry.setFromPoints(threeLiveParticles);

    if (!this.isDead()) {
      this.genParticles(dt);
      this.lifespan -= dt;
    }

    console.log(
      'isDead: ',
      this.isDead(),
      '... numParticles: ',
      this.particles.length
    );
    console.log(this.mesh);
    this.geometry.verticesNeedUpdate = true;
  };

  genParticles(dt) {
    const numParticles = Math.round(this.genRate * dt);
    for (let i = 0; i < numParticles; i++) {
      let p = this.genParticle();
      this.particles.push(p);
      this.geometry.vertices.push(new THREE.Vector3(p.pos.x, p.pos.y, p.pos.z));
    }
  }

  setPropsByType = (type, options) => {
    let props = {};
    if (type === 'STAR_TUNNEL') {
      props = this.getStarTunnelProps(options);
    } else {
      throw new Error(
        `Trying to create unsupported particle system of type: "${type}"`
      );
    }

    this.setProps(props);

    // Three.js stuff
    this.geometry = new THREE.Geometry();
    // attributes
    // const geomPositions = new Float32Array(
    //   props.lifespan * props.particleLifespan * 10
    // ); // 3 vertices per point
    // geometry.setAttribute(
    //   'position',
    //   new THREE.BufferAttribute(geomPositions, 3)
    // );
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
      color: 0xffffff,
      // map: props.particleTexture,
      // TODO: Get above texture mapping to work
      size: 0.1,
      blending: props.blendStyle,
      transparent: true,
    });
    // this.material = new THREE.PointsMaterial({ color: 0xffffff });
    this.mesh = new THREE.Points(this.geometry, this.material);
  };

  getStarTunnelProps = (options) => {
    const props = StarTunnelProps;
    // merge options into props
    if (options.pos) props.posBase = pos;

    return StarTunnelProps;
  };

  getPoints() {
    // var vertices = [];
    // for (var i = 0; i < 10000; i++) {
    //   var x = THREE.MathUtils.randFloatSpread(2000);
    //   var y = THREE.MathUtils.randFloatSpread(2000);
    //   var z = THREE.MathUtils.randFloatSpread(2000);
    //   vertices.push(x, y, z);
    // }
    // var geometry = new THREE.BufferGeometry();
    // geometry.setAttribute(
    //   'position',
    //   new THREE.Float32BufferAttribute(
    //     this.particles.map((p) => THREE.Vector3(p.pos.x, p.pos.y, p.pos.z)),
    //     3
    //   )
    // );
    // var material = new THREE.PointsMaterial({ color: 0xffffff });
    // var points = new THREE.Points(geometry, material);
    // points.position.set(0, 0, -5);
    // return points;
  }

  getMesh() {
    // var vertices = [];

    // for (let i = 0; i < 10000; i++) {
    //   var x = THREE.MathUtils.randFloatSpread(2000);
    //   var y = THREE.MathUtils.randFloatSpread(2000);
    //   var z = THREE.MathUtils.randFloatSpread(2000);
    //   this.geometry.vertices.push(new THREE.Vector3(x, y, z));
    // }

    // for (var i = 0; i < 10000; i++) {
    //   var x = THREE.MathUtils.randFloatSpread(2000);
    //   var y = THREE.MathUtils.randFloatSpread(2000);
    //   var z = THREE.MathUtils.randFloatSpread(2000);

    //   vertices.push(x, y, z);
    // }
    // this.geometry.setAttribute(
    //   'position',
    //   new THREE.Float32BufferAttribute(vertices, 3)
    // );

    return this.mesh;
  }
}

const StarTunnelProps = {
  posStyle: ParticleSystem.ShapeType.CUBE,
  posBase: new Vector(0, 0, 0),
  posSpread: new Vector(10, 10, 10),

  velStyle: ParticleSystem.ShapeType.CUBE,
  velBase: new Vector(0, 0, 1),
  velSpread: new Vector(0, 0, 0.1),

  angleBase: 0,
  angleSpread: 720,
  angleVelBase: 10,
  angleVelSpread: 0,

  particleTexture: new THREE.TextureLoader().load(
    '../assets/images/spikey.png'
  ),
  blendStyle: THREE.AdditiveBlending,

  radiusBase: 4.0,
  radiusSpread: 2.0,
  colorBase: new Vector(0.15, 1.0, 0.8), // H,S,L
  opacityBase: 1,

  // genRate: 20000,
  genRate: 100,
  particleLifespan: 600,
  lifespan: 2000,
};
