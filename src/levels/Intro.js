import * as THREE from 'three';
import AbstractLevel from './AbstractLevel';
import { Levels } from './LevelManager';

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

  constructor(engine, renderer, camera, switchLevel) {
    super(engine, renderer, camera, switchLevel);
  }

  init = () => {
    this.addText();
    // TODO: Add particle system space background
    this.addEventListeners();
  };

  cleanup = () => {
    // Remove meshs from engine
    this.engine.removeMesh(this.titleMesh);
    this.engine.removeMesh(this.subtitleMesh);
    // Remove window eventListener for listening to "enter" key
    window.removeEventListener('keypress', this.onPressEnter);
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
    const geometry = new THREE.TextGeometry('Galaga Remake', {
      font: font,
      size: 0.3,
      height: 0.1,
      curveSegments: 4,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.01,
      bevelSegments: 2,
    });
    geometry.center();
    geometry.translate(0, 0.5, 0);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  };

  // Returns a mesh object for the subtitle
  createSubtitleMesh = (font) => {
    const geometry = new THREE.TextGeometry('Press <ENTER> to play...', {
      font: font,
      size: 0.1,
      height: 0.02,
      curveSegments: 4,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.005,
      bevelSegments: 2,
    });
    geometry.center();
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
