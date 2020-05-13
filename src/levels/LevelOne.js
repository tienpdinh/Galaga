import { Vector } from 'simple-physics-engine';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import AbstractLevel from './AbstractLevel';
import Player from '../physics/Player';
import EnemyPack from '../math/EnemyPack';
import { PSystemType } from '../physics/ParticleSystem';
import playerSpaceshipImg from '../assets/models/playerSpaceship.glb';
import enemySpaceshipImg from '../assets/models/enemySpaceship.glb';

/**
 * Probably the only level this game will have. The actual game functionality goes in here
 *
 * @class LevelOne
 * @extends {AbstractLevel}
 */
export default class LevelOne extends AbstractLevel {
  enemyPacks;
  player;

  ammos;

  currentPackYPos;

  constructor(engine, renderer, camera, assets, switchLevel) {
    super(engine, renderer, camera, assets, switchLevel);
    this.enemyPacks = [];
    this.ammos = 1000;
    this.currentPackYPos = 0;
  }

  init = async () => {
    // TODO: Loading message
    await this.loadAssets();
    this.spawnPlayer();
    this.addEventListeners();
    this.spawnEnemies();
  };

  spawnPlayer = () => {
    // The player will be initialized to the bottom middle of the screen
    this.player = new Player(
      new Vector(0, 0, 400),
      this.assets.playerSpaceship
    );

    // Add player to scene
    this.engine.addObject(this.player);
  };

  spawnEnemies = () => {
    const model = this.assets.playerSpaceship;
    // spawn 2 packs initially
    for (let i = 0; i < 2; i++) {
      let pack = new EnemyPack(
        new Vector(-140, this.currentPackYPos + i * 70, 200),
        model,
        5,
        i + 1
      );
      this.enemyPacks.push(pack);
      this.currentPackYPos += i * 70;
    }
    for (let pack of this.enemyPacks) {
      for (let enemy of pack.enemies) {
        this.engine.addObject(enemy);
      }
    }
  };

  movePlayer = (e) => {
    const amt = 0.3;
    this.player.inMotion = true;
    if (e.keyCode === 68 || e.keyCode === 39) {
      // move right with arrow or D
      this.player.setVel(new Vector(amt, 0, 0));
    }
    if (e.keyCode === 65 || e.keyCode === 37) {
      // move left with arrow or A
      this.player.setVel(new Vector(-1 * amt, 0, 0));
    }
    if (e.keyCode === 87 || e.keyCode === 38) {
      // move up with arrow or W
      this.player.setVel(new Vector(0, amt, -0));
    }
    if (e.keyCode === 83 || e.keyCode === 40) {
      // move down with arrow or S
      this.player.setVel(new Vector(0, -1 * amt, 0));
    }
    if (e.keyCode === 69) {
      // move forward with E
      this.player.setVel(new Vector(0, 0, -1 * amt));
    }
    if (e.keyCode === 81) {
      // move backward with Q
      this.player.setVel(new Vector(0, 0, amt));
    }
  };

  stopPlayer = (e) => {
    this.player.inMotion = false;
  };

  spawnLaser = (e) => {
    if (this.ammos > 1) {
      const pos = this.player.pos.copy();
      pos.z -= 70; // don't collide with player
      const vel = this.player.mesh.getWorldDirection();
      // vel.z = -1
      this.engine.createParticleSystem(PSystemType.LASER, { pos, vel });

      // handling ammos and respawning enemies
      this.ammos--;
      console.log(this.ammos); // for now, we'll add a text to display this
      console.log(this.enemyPacks[0].isDead());
    }
  };

  pointTowardsMouse = (e) => {
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster(); //for reuse
    const mouse = new THREE.Vector2(); //for reuse
    const intersectPoint = new THREE.Vector3(); //for reuse

    //get mouse coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, this.camera); //set raycaster
    raycaster.ray.intersectPlane(plane, intersectPoint); // find the point of intersection
    this.player.lookAt(intersectPoint); // face our arrow to this point
  };

  getTotalEnemies = () => {
    let total = 0;
    for (let pack of this.enemyPacks) {
      for (let _ of pack.enemies) {
        total++;
      }
    }
    return total;
  };

  addEventListeners = () => {
    window.addEventListener('keydown', this.movePlayer, false);
    window.addEventListener('keyup', this.stopPlayer, false);
    window.addEventListener('mousedown', this.spawnLaser, false);
    window.addEventListener('mousemove', this.pointTowardsMouse, false);
  };

  loadAssets = async () => {
    const promises = [
      this.loadGlb(playerSpaceshipImg),
      this.loadGlb(enemySpaceshipImg),
    ];

    // Convert resolved assetArr into assets object
    const assetArr = await Promise.all(promises);

    // Get spaceships
    const playerSpaceship = assetArr[0].scene;
    const enemySpaceship = assetArr[1].scene;

    // Set this.assets for future use
    this.assets = {
      playerSpaceship,
      enemySpaceship,
    };
  };

  loadGlb = (glbFile) => {
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
      loader.load(glbFile, (data) => resolve(data), null, reject);
    });
  };

  cleanup = () => {};
}
