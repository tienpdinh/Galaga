import GameObject from './GameObject';

export default class Player extends GameObject {
  constructor(pos, dim = [15, 15, 15], col = 0x44aa88) {
    super(pos, dim, col); // Last parameter is init options like starting vel, etc
  }

  // Update state of cube... by default this just performs euleriean integration but I'm overriding it to directly add rotation
  update(dt) {
    // Let's stop rotating for now
    // this.mesh.rotation.x = dt;
    // this.mesh.rotation.y = dt;
    super.update(dt);
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
  }
}
