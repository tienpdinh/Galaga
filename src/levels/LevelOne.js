import { Vector } from 'simple-physics-engine';
import * as THREE from 'three';
import AbstractLevel from './AbstractLevel';
import Player from '../physics/Player';
import EnemyPack from '../math/EnemyPack';
import { PSystemType } from '../physics/ParticleSystem';

/**
 * Probably the only level this game will have. The actual game functionality goes in here
 *
 * @class LevelOne
 * @extends {AbstractLevel}
 */
export default class LevelOne extends AbstractLevel {
  enemyPacks;
  player;

  constructor(engine, renderer, camera, assets, switchLevel) {
    super(engine, renderer, camera, assets, switchLevel);
    this.enemyPacks = [];
  }

  init = () => {
    this.spawnPlayer();
    this.addEventListeners();
    this.spawnEnemies();
  };

  spawnPlayer = () => {
    // The player will be initialized to the bottom middle of the screen
    this.player = new Player(new Vector(0, 0, 450));

    // Load player object
    // this.loadGlb(playerSpaceshipImg);
    // console.log(spaceshipObj);

    // Add player to scene
    this.engine.addObject(this.player);

    const { playerSpaceship } = this.assets;

    this.engine.addMesh(playerSpaceship);

    // TODO: put glb spaceship inside player class
  };

  spawnEnemies = () => {
    let tmpPack = new EnemyPack(new Vector(-140, 0, 200), 5, 1);
    this.enemyPacks.push(tmpPack);
    for (let pack of this.enemyPacks) {
      for (let enemy of pack.enemies) {
        this.engine.addObject(enemy);
      }
    }
  };

  movePlayer = (e) => {
    if (e.keyCode === 68 || e.keyCode === 39) {
      // move right
      this.player.setVel(new Vector(0.3, 0, 0));
    }
    if (e.keyCode === 65 || e.keyCode === 37) {
      // move left
      this.player.setVel(new Vector(-0.3, 0, 0));
    }
    if (e.keyCode === 87 || e.keyCode === 38) {
      // move up
      this.player.setVel(new Vector(0, 0, -0.3));
    }
    if (e.keyCode === 83 || e.keyCode === 40) {
      // move down
      this.player.setVel(new Vector(0, 0, 0.3));
    }
  };

  stopPlayer = (e) => {
    this.player.setVel(new Vector());
  };

  spawnLaser = (e) => {
    const pos = this.player.pos.copy();
    pos.z -= 20;
    this.engine.createParticleSystem(PSystemType.LASER, { pos });
  };

  addEventListeners = () => {
    window.addEventListener('keydown', this.movePlayer, false);
    window.addEventListener('keyup', this.stopPlayer, false);
    window.addEventListener('mousedown', this.spawnLaser, false);
  };

  cleanup = () => {};
}
