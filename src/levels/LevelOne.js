import { Vector } from 'simple-physics-engine';
import * as THREE from 'three';
import AbstractLevel from './AbstractLevel';
import { ObjectType } from '../physics/GameObject';
import { Levels } from './LevelManager';
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

  // Stats
  ammos;
  currentPackYPos;
  totalShots;
  clock;

  constructor(
    engine,
    renderer,
    camera,
    { assets, onSwitchLevel, onToggleAudio }
  ) {
    super(engine, renderer, camera, {
      assets,
      onSwitchLevel,
      onToggleAudio,
    });
    this.enemyPacks = [];
    this.ammos = 1000;
    this.currentPackYPos = 0;
    this.totalShots = 0;
    this.clock = new THREE.Clock();
    this.clock.start();

    // let physics engine call onPlayerDeath
    this.engine.onPlayerDeath = this.onPlayerDeath;
    this.engine.updateLevel = this.update;
  }

  init = () => {
    this.spawnPlayer();
    this.addEventListeners();
    this.spawnEnemies();
    this.displayHealthbar();
  };

  // Custom update functionality
  update = (dt) => {
    // Loop through enemies and do some logic
    for (let pack of this.enemyPacks) {
      // Respawn pack if all enemies are dead
      if (pack.isDead()) {
        pack.respawn(this.getTotalEnemies());
        for (let enemy of pack.enemies) {
          this.engine.addObject(enemy);
        }
      }

      // Keep track of live enemies
      const liveEnemies = [];

      // Loop through and randomly spawn enemy lasers
      const elapsedTime = this.clock.getElapsedTime();
      const probOfLaser = 0.001 * Math.cbrt(elapsedTime);
      for (let enemy of pack.enemies) {
        if (!enemy.isDead()) {
          // Give user some time to get used to game
          if (elapsedTime > 6) {
            if (Math.random() < probOfLaser) {
              this.spawnEnemyLaser(enemy);
            }
          }

          liveEnemies.push(enemy);
        }
      }

      // reset pack enemies to only be live enemies
      pack.enemies = liveEnemies;
    }
    for (let pack of this.enemyPacks) {
      for (let enemy of pack.enemies) {
        // each enemy has 30% chance of start chasing the player
        enemy.chase(this.player.pos);
      }
    }
  };

  spawnPlayer = () => {
    // The player will be initialized to the bottom middle of the screen
    this.player = new Player(
      new Vector(0, -15, 400),
      this.assets.playerSpaceship
    );

    let tmpHealth = document.getElementById('health');
    tmpHealth.value = 100;

    // Add player to scene
    this.engine.addObject(this.player);
  };

  spawnEnemies = () => {
    // spawn 2 packs initially
    for (let i = 0; i < 2; i++) {
      let pack = new EnemyPack(
        new Vector(-140, this.currentPackYPos + i * 70, 100),
        5,
        i + 1,
        this.assets
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
    if (e.keyCode === 84) {
      // toggle sound with t
      this.onToggleAudio();
    }
  };

  stopPlayer = (e) => {
    this.player.inMotion = false;
  };

  spawnLaser = (e) => {
    if (this.ammos > 1) {
      const pos = this.player.pos.copy();
      pos.z -= 50; // don't collide with player
      const vel = this.player.mesh.getWorldDirection(new THREE.Vector3());
      vel.z *= 0.5;
      this.engine.createParticleSystem(PSystemType.LASER, {
        pos,
        vel,
        color: this.player.color,
        ownerType: ObjectType.PLAYER,
      });
      this.totalShots++;

      // handling ammos and respawning enemies
      this.ammos--;
      // loop through each pack and respawn the pack if all enemies in the pack has been destroyed
    }
  };

  spawnEnemyLaser = (enemy) => {
    const pos = enemy.pos.copy();
    pos.z += 50; // don't collide with player

    // Shoot at player with some random noise
    const vel = Vector.sub(this.player.pos, enemy.pos);
    vel.normalize();
    vel.x += getRandomInt(-1, 1) * 0.05; // make it a lil easier to live
    vel.y += getRandomInt(-1, 1) * 0.01;
    vel.z *= 0.4; // slow down laser

    // Create particle system
    this.engine.createParticleSystem(PSystemType.LASER, {
      pos,
      vel,
      color: enemy.color,
    });
  };

  // Point player towards mouse, completely based off the following link
  // https://stackoverflow.com/questions/44823986/how-to-rotate-object-to-look-mouse-point-in-three-js
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

  pointTowardsPlayer = (enemy) => {
    // const dir = Vector.sub(this.player.pos.copy(), enemy.pos.copy());
    // enemy.lookAt(new THREE.Vector3(dir.x, dir.y, dir.z));
    enemy.lookAt(this.player.pos.copy());
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

  displayControlsText = () => {
    const controlsDiv = document.getElementById('controls');
    controlsDiv.style.display = 'inherit';
  };

  addEventListeners = () => {
    window.addEventListener('keydown', this.movePlayer, false);
    window.addEventListener('keyup', this.stopPlayer, false);
    window.addEventListener('mousedown', this.spawnLaser, false);
    window.addEventListener('mousemove', this.pointTowardsMouse, false);
  };

  onPlayerDeath = () => {
    this.onSwitchLevel(Levels.CREDITS);
  };

  displayHealthbar = () => {
    const healthBar = document.getElementById('health');
    healthBar.style.display = 'inherit';
  };

  cleanup = () => {
    // Remove all objects
    this.engine.teardown();
    this.engine.updateLevel = null;

    // Remove window handlers
    window.removeEventListener('keydown', this.movePlayer);
    window.removeEventListener('keyup', this.stopPlayer);
    window.removeEventListener('mousedown', this.spawnLaser);
    window.removeEventListener('mousemove', this.pointTowardsMouse);

    // Remove window user controls
    const controlsDiv = document.getElementById('controls');
    controlsDiv.style.display = 'none';
    const healthBar = document.getElementById('health');
    healthBar.style.display = 'none';

    // Stats
    const elapsedTime = this.clock.getElapsedTime().toFixed(2) + ' seconds';
    const kills = this.engine.getKills();
    const totalShots = this.totalShots;
    const remainingAmmo = this.ammos;
    const stats = {
      elapsedTime,
      kills,
      totalShots,
      remainingAmmo,
    };

    // Display stats
    const statsDiv = document.getElementById('stats');
    statsDiv.style.display = 'inherit';
    const statsUl = document.getElementById('stats-list');
    for (let [key, value] of Object.entries(stats)) {
      let li = document.createElement('li');
      li.appendChild(document.createTextNode(`${key}: ${value}`));
      statsUl.appendChild(li);
    }
  };
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
}
