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
    this.addStarTunnel();
    this.addEventListeners();
    this.addSound();
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

  // Creates star tunnel particle system
  addStarTunnel = () => {
    this.engine.createParticleSystem('STAR_TUNNEL');
  };

  // Returns a mesh object for the title
  createTitleMesh = (font) => {
    const geometry = new THREE.TextGeometry('Galaga Remake', {
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
    geometry.translate(0, 10, 460);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  };

  // Returns a mesh object for the subtitle
  createSubtitleMesh = (font) => {
    const geometry = new THREE.TextGeometry('Press <ENTER> to play...', {
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
    geometry.translate(0, -2, 460);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  };

  addSound = () => {
    const audioLoader = new THREE.AudioLoader();
    const listener = new THREE.AudioListener();
    const audio = new THREE.Audio(listener);
    audio.crossOrigin = 'anonymous';
    // TODO: fix cors issue with loading sound file
    const streamUrl =
      'https://storage.googleapis.com/misc-files-121/starwars_gameplay.ogg';
    audioLoader.load(streamUrl, function (buffer) {
      audio.setBuffer(buffer);
      audio.setLoop(true);
      audio.play();
    });
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
