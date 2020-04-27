# CSCI 5611 Final Project - 3D Asteroids Game

## Setup

Run the following commands to get started

```bash
yarn              # install dependencies
yarn start        # start the app
```

That should be it!

## TODO

- [ ] Refactor game into levels that App renders to support intro/end-game credits, any future extensions
- [ ] Write PhysicsObject extended class for MainCharacter
- [ ] Write PhysicsObject extended class for Asteroid
- [ ] Write PhysicsObject extended class for Powerup
- [ ] Write PhysicsObject extended class for WorldProp (like a tree or house that the player could hide behind)
- [ ] Create character camera who's position trails behind main character, ability for rotation through mouse
- [ ] Translate character position with "WASD" keys, rotation with "QE" keys
- [ ] Fire laser particle system from character to asteroid on mouse click
- [ ] Remove asteroid health / destroy asteroid on collision with laser particle system
- [ ] Remove main character health / die on collision with asteroid
- [ ] Add alerting sound when asteroid is close to colliding with main character
- [ ] Add particle system effect on collision
- [ ] Add fluid simulation to text (mostly for intro and end-credits)
