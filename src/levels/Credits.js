import * as THREE from 'three';
import AbstractLevel from './AbstractLevel';
import { Levels } from './LevelManager';
import { PSystemType } from '../physics/ParticleSystem';
import gameplaySound from '../assets/sounds/starwars_gameplay.ogg';

/**
 * First level a user sees when loading the game.
 * Simply displays game title and tells user how to proceed
 *
 * @class Intro
 * @extends {AbstractLevel}
 */
export default class Intro extends AbstractLevel {
  titleMesh;
  subtitleMesh;

  constructor(engine, renderer, camera, assets, switchLevel) {
    super(engine, renderer, camera, assets, switchLevel);
  }

  init = () => {
    this.addText();
    this.addEventListeners();
    this.showStats();
  };

  cleanup = () => {
    // Remove meshs from engine
    this.engine.removeMesh(this.titleMesh);
    this.engine.removeMesh(this.subtitleMesh);
    // Remove window eventListener for listening to "enter" key
    window.removeEventListener('keypress', this.onPressEnter);
    // Remove stats
    const statsDiv = document.getElementById('stats');
    statsDiv.style.display = 'none';
    const statsUl = document.getElementById('stats-list');
    statsUl.innerHTML = '';
  };

  // Add a title and subtitle to main scene
  addText = () => {
    const loader = new THREE.FontLoader();

    const onFontLoad = (font) => {
      // TODO: Make text responsive
      // create text mesh
      this.titleMesh = this.createTitleMesh(font);
      this.subtitleMesh = this.createSubtitleMesh(font);
      // add mesh to engine
      this.engine.addMesh(this.titleMesh);
      this.engine.addMesh(this.subtitleMesh);
    };

    loader.load(
      'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
      onFontLoad
    );
  };

  // Returns a mesh object for the title
  createTitleMesh = (font) => {
    const geometry = new THREE.TextGeometry('You can do better than that...', {
      font: font,
      size: 6,
      height: 1.5,
      curveSegments: 4,
      bevelEnabled: true,
      bevelThickness: 0.7,
      bevelSize: 0.3,
      bevelSegments: 20,
    });
    geometry.center();
    geometry.translate(0, 25, 430);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  };

  // Returns a mesh object for the subtitle
  createSubtitleMesh = (font) => {
    const geometry = new THREE.TextGeometry('Press <ENTER> to try again', {
      font: font,
      size: 2,
      height: 0.1,
      curveSegments: 4,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.1,
      bevelSegments: 20,
    });
    geometry.center();
    geometry.translate(0, 12, 460);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  };

  addEventListeners = () => {
    // Add event listener for <Enter> key
    window.addEventListener('keypress', this.onPressEnter, false);
  };

  // Switch levels when <Enter> is pressed
  onPressEnter = (e) => {
    if (e.keyCode === 13) {
      // <Enter> key
      this.switchLevel(Levels.LEVEL_ONE);
    }
  };
}
